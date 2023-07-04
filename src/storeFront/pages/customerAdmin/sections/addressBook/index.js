import React, { useState, useEffect } from 'react';

import { Button, Row, Col } from 'react-bootstrap';
import get from 'lodash/get';
import styled from 'styled-components';
import HtSpinner from 'admin/components/HtSpinner';
import AddAddressModal from './AddAddressModal';
import { RunToast } from 'utils/toast';
import {
  getAddressBookApi,
  getSelectedAddressApi,
  selectAddressBookApi,
  removeAddressBookApi,
} from 'Apis/CustomerApis';
import { PRIMARY_DARK_COLOR, PRIMARY_ACTIVE_COLOR } from 'constants/constants';

const AddressBookSection = () => {
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [addressList, setAddressList] = useState([]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  useEffect(() => {
    let unmounted = false;

    const getData = async () => {
      try {
        const resList = await getAddressBookApi('all');
        if (!unmounted) setAddressList([...resList.data.address]);

        const resSelected = await getSelectedAddressApi();
        if (!unmounted) setSelectedAddress({ ...resSelected.data.address });
      } catch (err) {
        console.log(err);
      }

      if (!unmounted) {
        setLoading(false);
      }
    };

    getData();

    return () => {
      unmounted = true;
    };
  }, []);

  const checkSelectedAddress = (id) => {
    if (get(selectedAddress, 'addressbook_id', -1) === id) return true;
    else return false;
  };

  const selectAddress = (id) => {
    setLoading(true);
    selectAddressBookApi(id)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setSelectedAddress({
            addressbook_id: id,
          });
          RunToast('success', `Address, ${id} selected`);
        } else RunToast('error', `Address, ${id} select failed`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        RunToast('error', `Address, ${id} select failed`);
      });
  };

  const removeAddress = (id) => {
    setLoading(true);
    removeAddressBookApi(id)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          setAddressList([...addressList.filter((item) => item.id !== id)]);
          RunToast('success', `Address, ${id} removed`);
        } else RunToast('error', `Address, ${id} remove failed`);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <MainPanel>
      <Title>Address Book</Title>
      <SubTitle>
        Review any saved address details including your default address.
      </SubTitle>
      <AddressListContainer>
        {addressList.map((item) => {
          return (
            <Col xs="4" key={item.id}>
              <AddressCard className="mt-4" xs="4">
                <div
                  className="close-button"
                  role="button"
                  onClick={() => {
                    removeAddress(item.id);
                  }}
                >
                  ×
                </div>
                <h5 className="text-center">{item.address}</h5>

                {checkSelectedAddress(item.id) ? (
                  <h5 className="selected">Selected</h5>
                ) : (
                  <SelectButton
                    className="ht-btn-primary"
                    onClick={() => {
                      selectAddress(item.id);
                    }}
                  >
                    Select
                  </SelectButton>
                )}
              </AddressCard>
            </Col>
          );
        })}
      </AddressListContainer>
      <AddNewAdressButton
        className="ht-btn-primary mr-auto mt-4"
        onClick={() => {
          setShowAddAddressModal(true);
        }}
      >
        Add Default Address
      </AddNewAdressButton>
      {showAddAddressModal && (
        <AddAddressModal
          hideModal={() => {
            setShowAddAddressModal(false);
          }}
          setLoading={(bShow) => {
            setLoading(bShow);
          }}
          addDefaultAddress={(defaultAddress) => {
            setLoading(false);
            setAddressList([defaultAddress.address, ...addressList]);
            setSelectedAddress({
              addressbook_id: defaultAddress.address.id,
            });
            setShowAddAddressModal(false);
          }}
        />
      )}
      {loading && <HtSpinner />}
    </MainPanel>
  );
};

const MainPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  background: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 33px 50px;
  min-height: 592px;
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 41px;
  color: ${PRIMARY_DARK_COLOR};
  margin: 0 0 12px 0;
`;

const SubTitle = styled.h4`
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 42px;
  color: ${PRIMARY_DARK_COLOR};
`;

const AddressListContainer = styled(Row)`
  display: flex;
  margin-top: 8px;
  margin-bottom: 29px;
  flex-wrap: wrap;
`;

const AddressCard = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  height: 150px;
  padding: 24px 23px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  align-items: center;
  justify-content: center;

  .close-button {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 20px;
    height: 20px;
    border: 1px solid ${PRIMARY_ACTIVE_COLOR};
    border-radius: 11px;

    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${PRIMARY_ACTIVE_COLOR};
    font-size: 17px;
    line-height: 20px;
    font-weight: bold;

    &:hover {
      filter: brightness(0.8);
    }
    &:active {
      filter: brightness(0.8);
    }
  }

  .selected {
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 34px;
    margin: 18px 0 0 0;
    color: ${PRIMARY_ACTIVE_COLOR};
  }
`;

const SelectButton = styled(Button)`
  margin: 18px 0 0 0;
  padding: 7px 24px;
`;

const AddNewAdressButton = styled(Button)`
  padding: 12px 24px;
`;

export default AddressBookSection;
