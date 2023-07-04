import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import validator from 'validator';
import { postcodeValidator } from 'postcode-validator';
import { Container } from 'react-bootstrap';

import AppContainer from '../../components/AppContainer';
import TopSectionSelector from './components/TopSectionSelector';
import StoreHeader from './components/StoreHeader';
import InformationSection from './sections/Information';
import AreaFeesSection from './sections/AreaFees';
import HtSpinner from '../../components/HtSpinner';
import { RunToast } from 'utils/toast';
import ApiService from 'admin/ApiService';
import {
  getAddresses as getAddressFromElasticApi,
  getStores,
} from 'Apis/Elastic';
import { getAddresses as getAddressFromFirstClassApi } from 'Apis/SharedApis';
import { getRegularPostCodeStr } from 'utils/address';
import * as CONSTANTS from 'constants/constants';

const StorePage = () => {
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  const formatStore = () => {
    return {
      id: -1,
      name: '',
      public_address: '',
      email: '',
      phone_number: '',
      postcode: '',
      address: '',
      logo_img: '',
      logo_file: null,
      description: '',
      cover_img: '',
      cover_file: null,
      fullfillment_type: {
        delivery: true,
        pickup: true,
      },
      minimum_delivery_amount: 0,
      delivery_prep_time: 0,
      pickup_prep_time: 0,
      delivery_data: {},
      online_status: 0,
    };
  };

  const [loading, setLoading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [storeList, setStoreList] = useState([]);
  const [store, setStore] = useState({ ...formatStore() });
  const [selectedSection, setSelection] = useState(
    CONSTANTS.STORE_INFORMATION_SECTION
  );

  const [storeValidate, setStoreValidate] = useState({
    name: { validate: true, errorMsg: '' },
    email: { validate: true, errorMsg: '' },
    phone_number: { validate: true, errorMsg: '' },
    postcode: { validate: true, errorMsg: '' },
    address: { validate: true, errorMsg: '' },
    description: { validate: true, errorMsg: '' },
    minimum_delivery_amount: { validate: true, errorMsg: '' },
    delivery_prep_time: { validate: true, errorMsg: '' },
    pickup_prep_time: { validate: true, errorMsg: '' },
  });

  const [addressList, setAddressList] = useState([]);

  const formatValidate = () => {
    const validateTemp = { ...storeValidate };
    Object.keys(validateTemp).forEach((item) => {
      validateTemp[item] = { validate: true, errorMsg: '' };
    });
    setStoreValidate({ ...validateTemp });
  };

  const checkValidate = () => {
    let isValidate = true;
    const validateTemp = { ...storeValidate };

    Object.keys(validateTemp).forEach((item) => {
      if (store[item].toString().length === 0) {
        validateTemp[item] = {
          validate: false,
          errorMsg: 'This value Required.',
        };
        isValidate = false;
      } else {
        validateTemp[item] = { validate: true, errorMsg: '' };
      }
    });

    if (validator.isEmail(store.email)) {
      validateTemp.email = { validate: true, errorMsg: '' };
    } else {
      validateTemp.email = {
        validate: false,
        errorMsg: 'Not a valid email address!',
      };
      isValidate = false;
    }

    if (postcodeValidator(store.postcode.trim(), 'UK')) {
      validateTemp.postcode = { validate: true, errorMsg: '' };
    } else {
      validateTemp.postcode = {
        validate: false,
        errorMsg:
          'Sorry we did not recognise that postcode, check and try again.',
      };
      isValidate = false;
    }

    setStoreValidate({
      ...validateTemp,
    });
    return isValidate;
  };

  const loadAddress = async (findPostcode) => {
    setLoading(true);

    const elasticRes= await getAddressFromElasticApi(getRegularPostCodeStr(findPostcode));
    
    if(elasticRes && elasticRes.hits.hits.length > 0) {
      setAddressList(elasticRes.hits.hits);
    } else {
      const addresses = await getAddressFromFirstClassApi(findPostcode);
      console.log(addresses);
    }
    setLoading(false);
  };

  const loadStore = (storeId) => {
    if (storeId >= 0) {
      ApiService({
        method: 'GET',
        url: `/store/${storeId}`,
        headers: CONSTANTS.getToken().headers,
      })
        .then((res) => {
          if (res.data.success) {
            setStore({
              ...res.data.store,
            });
            loadAddress(res.data.store.postcode);
            formatValidate();
          }
        })
        .catch((err) => {
          console.log('Store loaded');
        });
    } else {
      setStore({
        ...formatStore(),
      });
      formatValidate();
    }
  };

  useEffect(() => {
    let unmounted = false;
    setLoading(true);
    setAddressList([]);
    if (userInfo.id >= 0) {
      getStores(userInfo.id).then((res) => {
        if (!unmounted && res.length > 0) {
          if (res.length > 0) loadStore(res[0].id);
          setStoreList([...res]);
        }
        setLoading(false);
      });
    }

    return () => {
      unmounted = true;
    };
  }, [userInfo.id]); // eslint-disable-line

  const handleClickSave = async (storeInfo) => {
    if (!checkValidate()) return;

    setLoading(true);

    try {
      const resCheckName = await ApiService({
        method: 'GET',
        url: `/store/checkname/${storeInfo.name}`,
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      });

      if (resCheckName.data.success) {
        if (resCheckName.data.store.id !== store.id) {
          setStoreValidate({
            ...storeValidate,
            name: {
              validate: false,
              errorMsg: 'Store name already exist.',
            },
          });
          setLoading(false);
          return;
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }

    if (storeInfo.id === -1) {
      setLoading(true);
      const storeTemp = { ...storeInfo };
      delete storeTemp.id;
      delete storeTemp.logo_file;
      delete storeTemp.cover_file;
      delete storeTemp.logo_img;
      delete storeTemp.cover_img;
      delete storeTemp.createdAt;
      delete storeTemp.updatedAt;

      const formData = new FormData();
      Object.keys(storeTemp).forEach((item) => {
        if (item === 'fullfillment_type' || item === 'delivery_data')
          formData.append(item, JSON.stringify(storeTemp[item]));
        else formData.append(item, storeTemp[item]);
      });

      if (storeInfo.logo_file) formData.append('logo_img', storeInfo.logo_file);
      if (storeInfo.cover_file)
        formData.append('cover_img', storeInfo.cover_file);

      ApiService({
        method: 'POST',
        url: '/store',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) {
            setStore({
              ...storeInfo,
              id: res.data.store.id,
              logo_img: res.data.store.logo_img,
              cover_img: res.data.store.cover_img,
              postcode: res.data.store.postcode.trim(),
              logo_file: null,
              cover_file: null,
            });
            setStoreList([
              ...storeList,
              { id: res.data.store.id, name: res.data.store.name },
            ]);
          }
          setLoading(false);
          RunToast('success', `Store ${storeInfo.name} created.`);
        })
        .catch((err) => {
          RunToast('error', `Store ${storeInfo.name} create failed.`);
          setLoading(false);
        });
    } else {
      setLoading(true);
      const storeTemp = { ...storeInfo };
      delete storeTemp.id;
      delete storeTemp.logo_file;
      delete storeTemp.cover_file;
      delete storeTemp.logo_img;
      delete storeTemp.cover_img;
      delete storeTemp.createdAt;
      delete storeTemp.updatedAt;

      const formData = new FormData();
      Object.keys(storeTemp).forEach((key) => {
        if (key === 'fullfillment_type' || key === 'delivery_data')
          formData.append(key, JSON.stringify(storeTemp[key]));
        else formData.append(key, storeTemp[key]);
      });

      if (storeInfo.logo_file) formData.append('logo_img', storeInfo.logo_file);
      if (storeInfo.cover_file)
        formData.append('cover_img', storeInfo.cover_file);

      ApiService({
        method: 'PUT',
        url: `/store/${storeInfo.id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success)
            setStore({
              ...storeInfo,
              logo_img: res.data.store.logo_img,
              cover_img: res.data.store.cover_img,
              postcode: res.data.store.postcode.trim(),
              logo_file: null,
              cover_file: null,
            });
          setLoading(false);
          RunToast('success', `Store ${storeInfo.name} updated.`);
        })
        .catch((err) => {
          RunToast('error', `Store ${storeInfo.name} update failed.`);
          setLoading(false);
        });
    }
  };

  return (
    <AppContainer>
      <MenuContainer>
        <TopSectionSelector
          curSection={selectedSection}
          setCurSection={(sectionId) => setSelection(sectionId)}
          storeValidate={storeValidate}
        />
        <StoreHeader
          title={
            selectedSection === CONSTANTS.STORE_INFORMATION_SECTION
              ? 'Store information'
              : 'Areas and Fees'
          }
          store={store}
          storeList={storeList}
          selectStore={(selectedId) => {
            setIsChanged(false);
            loadStore(selectedId);
          }}
          clickSave={() => handleClickSave(store)}
          isChanged={isChanged}
        />
        <SectionContainer>
          {selectedSection === CONSTANTS.STORE_INFORMATION_SECTION && (
            <InformationSection
              store={store}
              setStore={(updatedStore) => {
                setStore({
                  ...updatedStore,
                });
                setIsChanged(true);
              }}
              storeValidate={storeValidate}
              setStoreValidate={(newValidate) =>
                setStoreValidate({ ...newValidate })
              }
              addressList={addressList}
              setAddressList={(newAddressList) =>
                setAddressList([...newAddressList])
              }
              loadAddress={loadAddress}
            />
          )}
          {selectedSection === CONSTANTS.STORE_AREAFEES_SECTION && (
            <AreaFeesSection
              store={store}
              setStore={(updatedStore) => {
                setStore({
                  ...updatedStore,
                });
                setIsChanged(true);
              }}
              storeValidate={storeValidate}
              saveStore={handleClickSave}
            />
          )}
        </SectionContainer>
      </MenuContainer>
      {loading && <HtSpinner />}
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 54px;
`;

export default withRouter(StorePage);
