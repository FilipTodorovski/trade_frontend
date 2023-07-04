import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { get, includes } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';

import MenuContainer from '../../../components/MenuContainer';
import GroupOptionDetail from './GroupOptionDetail';
import GroupOptionRules from './GroupOptionRules';
import HtSpinner from '../../../../../components/HtSpinner';
import { RunToast } from 'utils/toast';
import ApiService from 'admin/ApiService';
import * as CONSTANTS from 'constants/constants';

const GroupOptionEdit = ({ history, match }) => {
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));
  const [group, setGroup] = useState({
    id: -1,
    name: '',
    items: [],
    require_select_item: true,
    min_item_count: 0,
    max_item_count: 1,
  });
  const [groupValidate, setGroupValidate] = useState({
    name: { validate: true, errorMsg: '' },
    items: { validate: true, errorMsg: '' },
    min_item_count: { validate: true, errorMsg: '' },
    max_item_count: { validate: true, errorMsg: '' },
  });
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newItems, setNewItems] = useState([]);
  const [removedItemIds, setRemovedItemIds] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);

  useEffect(() => {
    let unmounted = false;
    const loadData = async () => {
      setLoading(true);

      if (match.params.id >= 0) {
        try {
          const groupRes = await ApiService({
            method: 'GET',
            url: `/group/full/${match.params.id}`,
            data: {},
            headers: CONSTANTS.getToken().headers,
          });

          if (groupRes.data.success) {
            if (!unmounted) {
              setGroup(groupRes.data.group);
            }
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        if (!unmounted) {
          setGroup({
            id: -1,
            name: '',
            items: [],
            require_select_item: true,
            min_item_count: 0,
            max_item_count: 1,
          });
        }
      }
      if (!unmounted) {
        setLoading(false);
        setIsChanged(false);
      }
    };

    if (get(userInfo, 'id', -1) >= 0) loadData();
    return () => {
      unmounted = true;
    };
  }, [userInfo]);

  const checkValidate = () => {
    const validateValues = (value) => {
      if (value) {
        return {
          validate: true,
          errorMsg: 'Required field',
        };
      } else {
        return {
          validate: false,
          errorMsg: 'Required field',
        };
      }
    };

    const validateTemp = { ...groupValidate };

    validateTemp.name = { ...validateValues(group.name) };
    if (group.require_select_item) {
      validateTemp.min_item_count = { ...validateValues(group.min_item_count) };
      validateTemp.max_item_count = { ...validateValues(group.max_item_count) };
    } else {
      validateTemp.min_item_count = {
        validate: true,
        errorMsg: 'Required field',
      };
      validateTemp.max_item_count = {
        validate: true,
        errorMsg: 'Required field',
      };
    }

    const addedItems = newItems.filter(
      (item) => item.name.length > 0 && item.base_price > 0
    );
    if (group.items.length === 0 && addedItems.length === 0) {
      validateTemp.items = {
        validate: false,
        errorMsg: 'Required field.',
      };
    } else {
      validateTemp.items = { validate: true, errorMsg: '' };
    }

    if (
      validateTemp.min_item_count.validate &&
      validateTemp.max_item_count.validate
    ) {
      if (group.min_item_count > group.max_item_count)
        validateTemp.min_item_count = {
          validate: false,
          errorMsg: 'This field should be less than max item counts',
        };
    }

    setGroupValidate({ ...validateTemp });

    let isValidate = true;
    Object.keys(validateTemp).forEach((itemKey) => {
      if (!isValidate) return false;
      if (!validateTemp[itemKey].validate) isValidate = false;
    });
    return isValidate;
  };

  const handleClickDelete = () => {
    setLoading(true);
    ApiService({
      method: 'DELETE',
      url: `/group/${group.id}`,
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          history.push('/menus/groups');
          RunToast('success', `Group ${group.name} deleted.`);
        }
        setLoading(false);
      })
      .catch((err) => {
        RunToast('error', `Group ${group.name} delete failed.`);
        setLoading(false);
      });
  };

  const handleClickDuplicate = () => {
    setGroup({
      ...group,
      id: -1,
    });
    setIsChanged(true);
  };

  const handleClickSave = async () => {
    if (!checkValidate()) return;

    setLoading(true);

    const res = await ApiService({
      method: 'post',
      url: '/group/checkname',
      data: { name: group.name },
      headers: CONSTANTS.getToken().headers,
    });

    if (res.data.success) {
      if (
        res.data.group !== null &&
        get(res.data.group, 'id', -9) !== group.id
      ) {
        setGroupValidate({
          ...groupValidate,
          name: {
            validate: false,
            errorMsg: 'Name already exist.',
          },
        });
        setLoading(false);
        return;
      }
    }

    if (group.id === -1) {
      createGroup();
    } else {
      updateGroup();
    }
  };

  const createGroup = async () => {
    const groupTemp = { ...group };
    delete groupTemp.id;
    delete groupTemp.createdAt;
    delete groupTemp.updatedAt;

    ApiService({
      method: 'POST',
      url: '/group',
      data: groupTemp,
      headers: {
        'Content-Type': 'application/json',
        ...CONSTANTS.getToken().headers,
      },
    })
      .then(async (res) => {
        if (res.data.success) {
          setGroup({
            ...group,
            id: res.data.group.id,
          });

          if (newItems.length > 0) {
            const newItemsRes = await createNewItems(res.data.group.id);
            newItemsRes.data.items.forEach((item) => {
              group.items_info.push({
                id: item.id,
                order: group.items_info.length,
                price: item.base_price,
                name: item.name,
              });
            });
          }

          RunToast('success', `Group ${group.name} created.`);
        }
        setLoading(false);
        setIsChanged(false);
        history.push('/menus/groups');
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', `Group ${group.name} create failed.`);
      });
  };

  const updateGroup = async () => {
    const groupTemp = { ...group };
    delete groupTemp.id;
    delete groupTemp.createdAt;
    delete groupTemp.updatedAt;

    if (newItems.length > 0) {
      await createNewItems(group.id);
    }

    if (updatedItems.length > 0) {
      await updateItems(group.id);
    }

    ApiService({
      method: 'PUT',
      url: `/group/${group.id}`,
      data: {
        ...groupTemp,
        removedItemIds,
      },
      headers: {
        'Content-Type': 'application/json',
        ...CONSTANTS.getToken().headers,
      },
    })
      .then((res) => {
        if (res.data.success) {
          setIsChanged(false);
        }
        RunToast('success', `Group ${group.name} updated.`);
        setLoading(false);
        history.push('/menus/groups');
      })
      .catch((err) => {
        RunToast('error', `Group ${group.name} update failed.`);
        setLoading(false);
      });
  };

  const createNewItems = async (groupId) => {
    try {
      const newItemsParam = newItems
        .filter((item) => item.name.length > 0 && item.base_price > 0)
        .flatMap((item) => [
          {
            ...item,
            sell_its_own: false,
            photo_img: '',
            description: '',
            vat: 0,
            groups_info: [],
          },
        ]);

      if (newItemsParam.length === 0) return;
      return await ApiService({
        method: 'POST',
        url: '/item/bulk',
        data: {
          items: newItemsParam,
          group_id: groupId,
        },
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      });
    } catch (error) {
      RunToast('error', `New Items create failed.`);
      setLoading(false);
    }
  };

  const updateItems = async (groupId) => {
    try {
      return await ApiService({
        method: 'PUT',
        url: '/item/bulk',
        data: {
          items: updatedItems,
          group_id: groupId,
        },
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      });
    } catch (error) {
      RunToast('error', `Items update failed.`);
      setLoading(false);
    }
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_GROUP_OPTIONS}>
      <HeaderDiv>
        <h1>
          <BackArrowBtn
            icon={faArrowLeft}
            onClick={() => {
              history.push('/menus/groups');
            }}
          />
          Variation settings
        </h1>
        {group.id >= 0 && (
          <>
            <DeleteButton
              className="ht-btn-grey"
              onClick={() => {
                handleClickDelete(group.id);
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
          itemID={group.id}
        >
          {isChanged ? 'Save' : 'Saved'}
        </SaveButton>
      </HeaderDiv>
      <GroupOptionDetail
        group={group}
        setGroup={(newGroup) => {
          setGroup({ ...newGroup });
          setIsChanged(true);
        }}
        groupValidate={groupValidate}
        newItems={newItems}
        setNewItems={(items) => {
          setNewItems([...items]);
          setIsChanged(true);
        }}
        removedItemIds={removedItemIds}
        setRemovedItemIds={(ids) => {
          setRemovedItemIds([...ids]);
          setIsChanged(true);
        }}
        updatedItems={updatedItems}
        setUpdatedItems={(items) => {
          setUpdatedItems([...items]);
          setIsChanged(true);
        }}
      />
      <GroupOptionRules
        group={group}
        setGroup={(newGroup) => {
          setGroup({ ...newGroup });
          setIsChanged(true);
        }}
        groupValidate={groupValidate}
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
  margin-left: ${(props) => (props.itemID >= 0 ? '15px' : 'auto')};
`;

export default withRouter(GroupOptionEdit);
