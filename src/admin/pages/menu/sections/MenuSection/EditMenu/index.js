import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';

import MenuContainer from '../../../components/MenuContainer';
import HtSpinner from '../../../../../components/HtSpinner';
import MenuHours from './MenuHours';
import { RunToast } from 'utils/toast';
import * as CONSTANTS from 'constants/constants';
import ApiService from 'admin/ApiService';
import { getStores } from 'Apis/Elastic';

const EditMenu = ({ history, match }) => {
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  const [menu, setMenu] = useState({});
  const [oldStoreIds, setOldStoreIds] = useState([]);
  const [storeList, setStoreList] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [menuValidate, setMenuValidate] = useState({
    name: { validate: true, errorMsg: '' },
  });

  useEffect(() => {
    let unmounted = false;
    const loadingData = async () => {
      setLoading(true);
      setIsChanged(false);

      const storeListRes = await getStores(userInfo.id);
      if (!unmounted)
        setStoreList([
          ...storeListRes.map((item) => {
            return { value: item.id, label: item.name };
          }),
        ]);

      try {
        if (match.params.id >= 0) {
          const menuRes = await ApiService({
            method: 'GET',
            url: `/menu/withStore/${match.params.id}`,
            headers: CONSTANTS.getToken().headers,
          });

          if (!unmounted) {
            if (menuRes.data.success) {
              setMenu({ ...menuRes.data.menu });
              setOldStoreIds([
                ...menuRes.data.menu.stores.map((item) => item.id),
              ]);
            } else setMenu({});
          }
        } else {
          if (!unmounted)
            setMenu({
              id: -1,
              name: '',
              stores: [],
              open_hours: [
                [[0, 1, 2, 3, 4, 5, 6], [{ start: [8, 0], end: [20, 0] }]],
              ],
            });
        }
      } catch (err) {
        // setMenu({});
      }
      setLoading(false);
    };

    if (userInfo.id >= 0) loadingData();

    return () => {
      unmounted = true;
    };
  }, [userInfo.id]); // eslint-disable-line

  const checkValidate = () => {
    const menuValidateTemp = { ...menuValidate };

    if (menu.name.length === 0) {
      menuValidateTemp.name = {
        validate: false,
        errorMsg: 'Name is required.',
      };
    } else {
      menuValidateTemp.name = {
        validate: true,
        errorMsg: '',
      };
    }

    setMenuValidate({
      ...menuValidateTemp,
    });

    let isValidate = true;
    Object.keys(menuValidateTemp).forEach((item) => {
      if (!isValidate) return false;
      if (!menuValidateTemp[item].validate) isValidate = false;
    });
    return isValidate;
  };

  const handleClickSave = async () => {
    if (!checkValidate()) return;
    setLoading(true);

    const res = await ApiService({
      method: 'post',
      url: '/menu/checkname',
      data: { name: menu.name },
      headers: CONSTANTS.getToken().headers,
    });

    if (res.data.success) {
      if (
        res.data.menu !== null &&
        _.get(res.data.menu, 'id', -9) !== menu.id
      ) {
        setMenuValidate({
          ...menuValidate,
          name: {
            validate: false,
            errorMsg: 'Name already exist.',
          },
        });
        setLoading(false);

        return;
      }
    }

    const menuTemp = { ...menu };
    delete menuTemp.createdAt;
    delete menuTemp.updatedAt;
    delete menuTemp.id;
    delete menuTemp.stores;
    delete menuTemp.order_info;

    menuTemp.store_ids = menu.stores.map((item) => item.id);
    menuTemp.open_hours = JSON.stringify(menuTemp.open_hours);

    if (menu.id === -1) {
      ApiService({
        method: 'POST',
        url: '/menu',
        data: menuTemp,
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) {
            setMenu({
              ...menu,
              id: res.data.menu.id,
            });
            setOldStoreIds([...menuTemp.store_ids]);
            setIsChanged(false);
            RunToast('success', `Menu ${menu.name} saved.`);
          }
          setLoading(false);
        })
        .catch((err) => {
          RunToast('error', `Menu ${menu.name} save failed.`);
          setLoading(false);
        });
    } else if (menu.id > 0) {
      const newStoreIds = menu.stores.map((item) => item.id);
      const added_store_ids = [];
      const removed_store_ids = [];

      oldStoreIds.forEach((item) => {
        if (!_.includes(newStoreIds, item)) removed_store_ids.push(item);
      });

      newStoreIds.forEach((item) => {
        if (!_.includes(oldStoreIds, item)) added_store_ids.push(item);
      });

      ApiService({
        method: 'PUT',
        url: `/menu/${menu.id}`,
        data: {
          ...menuTemp,
          added_store_ids,
          removed_store_ids,
        },
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) {
            setIsChanged(false);
            RunToast('success', `Menu ${menu.name} updated.`);
            setOldStoreIds([...newStoreIds]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          RunToast('error', `Menu ${menu.name} update failed.`);
        });
    }
  };

  const handleClickDelete = () => {
    setLoading(true);
    ApiService({
      method: 'delete',
      url: `/menu/${menu.id}`,
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          RunToast('success', `Menu ${menu.name} deleted.`);
          history.push('/menus/list');
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        RunToast('error', `Menu ${menu.name} delete failed.`);
      });
  };

  const handleClickDuplicate = () => {
    setMenu({
      ...menu,
      id: -1,
    });
    setIsChanged(true);
  };

  const getSelectedStores = () => {
    const selectedStores = _.get(menu, 'stores', []).map((item) => {
      return { value: item.id, label: item.name };
    });

    return selectedStores;
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_MENUS_SECTION}>
      <HeaderDiv>
        <h1>
          <BackArrowBtn
            icon={faArrowLeft}
            onClick={() => {
              history.push('/menus/list');
            }}
          />
          Catalogue settings
        </h1>
        {menu.id >= 0 && (
          <>
            <DeleteButton
              className="ht-btn-grey"
              onClick={() => {
                handleClickDelete();
              }}
            >
              Delete
            </DeleteButton>
            <DuplicateButton
              variant="outline-primary"
              className="ht-btn-outline-grey"
              onClick={handleClickDuplicate}
            >
              Duplicate
            </DuplicateButton>
          </>
        )}
        <SaveButton
          className={`ht-btn-primary ${
            isChanged ? '' : 'ht-btn-primary-disable'
          }`}
          onClick={handleClickSave}
          menuid={menu.id}
        >
          {isChanged ? 'Save' : 'Saved'}
        </SaveButton>
      </HeaderDiv>
      <MenuDetailsContainer className="ht-card">
        <h5>Catalogue details</h5>
        <Form>
          <Form.Group>
            <Form.Label className="ht-label">Catalogue name</Form.Label>
            <Form.Control
              className="ht-form-control name-input"
              type="input"
              value={menu.name}
              onChange={(e) => {
                setMenu({
                  ...menu,
                  name: e.target.value,
                });
                setIsChanged(true);
              }}
              placeholder="Enter catalogue name"
              isInvalid={!menuValidate.name.validate}
            />
            <Form.Control.Feedback type="invalid">
              {menuValidate.name.errorMsg}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Label className="ht-label">
            Which store would you like to associate this catalogue?
          </Form.Label>
          <Select
            name="store-selector"
            options={storeList}
            value={getSelectedStores()}
            onChange={(e) => {
              if (e === null) {
                setMenu({
                  ...menu,
                  stores: [],
                });
              } else {
                setMenu({
                  ...menu,
                  stores: [
                    ...e.map((item) => {
                      return { id: item.value, name: item.label };
                    }),
                  ],
                });
              }
              setIsChanged(true);
            }}
            className="ht-selector store-selector"
            classNamePrefix="select"
            placeholder="Select which store..."
            noOptionsMessage={() => 'Please add a store to continue.'}
            isMulti
          />
        </Form>
      </MenuDetailsContainer>
      <MenuHours
        menu={menu}
        changeMenu={(newMenuData) => {
          setMenu({ ...menu, ...newMenuData });
          setIsChanged(true);
        }}
      />
      {loading && <HtSpinner />}
    </MenuContainer>
  );
};

const HeaderDiv = styled.div`
  display: flex;
  h1 {
    height: 41px;
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #272848;
    margin: 0;
  }
`;

const BackArrowBtn = styled(FontAwesomeIcon)`
  font-size: 25px;
  color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  cursor: pointer;
  margin-right: 1rem;
`;

const DeleteButton = styled(Button)`
  margin-left: auto;
`;

const DuplicateButton = styled(Button)`
  margin-left: 15px;
`;

const SaveButton = styled(Button)`
  margin-left: ${(props) => (props.menuid >= 0 ? '15px' : 'auto')};
`;

const MenuDetailsContainer = styled.div`
  margin-top: 50px;
  padding: 40px 40px 50px;
  h5 {
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0;
  }

  form {
    margin-top: 30px;

    .form-group {
      margin-bottom: 25px;
      &:last-child {
        margin-bottom: 0;
      }
    }

    .name-input {
      width: 100%;
      max-width: 407px;
    }
  }
`;
export default withRouter(EditMenu);
