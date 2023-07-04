import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { includes, get } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import MenuContainer from '../../../components/MenuContainer';
import HtSpinner from '../../../../../components/HtSpinner';

import CustomizeItem from './CustomizeItem';
import ItemDetails from './ItemDetails';
import * as CONSTANTS from 'constants/constants';
import { RunToast } from 'utils/toast';
import ApiService from 'admin/ApiService';
import { getCategories } from 'Apis/Elastic';

const ItemEdit = ({ history, match }) => {
  const [item, setItem] = useState({
    id: -1,
    name: '',
    photo_img: '',
    description: '',
    sell_its_own: true,
    base_price: '',
    vat: 0,
    categories: [],
    active: true,
    groups_info: [],
  });
  const [categoryList, setCategoryList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [oldCategoryIds, setOldCategoryIds] = useState([]);

  const [itemValidate, setItemValidate] = useState({
    name: { validate: true, errorMsg: '' },
    categories: { validate: true, errorMsg: '' },
    base_price: { validate: true, errorMsg: '' },
  });
  const [isChanged, setIsChanged] = useState(false);

  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  const formatGroupInfos = (itemOne) => {
    const groups_info = itemOne.groups_info.map((groupInfo) => {
      const group = itemOne.groups.find((group) => group.id === groupInfo.id);
      return {
        ...groupInfo,
        ...group,
        collapsed: true,
      };
    });

    return {
      ...itemOne,
      groups_info,
    };
  };

  useEffect(() => {
    if (get(userInfo, 'id', -1) <= 0) return;

    setLoading(true);
    const fetchData = async () => {
      const categoryListRes = await getCategories(userInfo.id);
      setCategoryList([
        ...categoryListRes.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }),
      ]);

      try {
        const groupListRes = await ApiService({
          method: 'GET',
          url: '/group/full/all',
          headers: {
            'Content-Type': 'application/json',
            ...CONSTANTS.getToken().headers,
          },
        });

        if (groupListRes.data.success)
          setGroupList([
            ...groupListRes.data.groups.map((itemOne) => {
              return {
                ...itemOne,
                value: itemOne.id,
                label: itemOne.name,
              };
            }),
          ]);
      } catch (err) {
        console.log('Load Group List.');
      }

      if (match.params.id >= 0) {
        try {
          const itemRes = await ApiService({
            method: 'POST',
            url: `/item/full/${match.params.id}`,
            data: {},
            headers: CONSTANTS.getToken().headers,
          });

          if (itemRes.data.success) {
            setItem({ ...formatGroupInfos(itemRes.data.item) });
            setOldCategoryIds([
              ...get(itemRes.data.item, 'categories', []).map(
                (item) => item.id
              ),
            ]);
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        setItem({
          id: -1,
          name: '',
          photo_img: '',
          description: '',
          sell_its_own: true,
          base_price: '',
          vat: 0,
          categories: [],
          active: true,
          groups_info: [],
        });
      }

      setLoading(false);
      setIsChanged(false);
    };

    fetchData();
  }, [userInfo]); // eslint-disable-line

  const handleClickDelete = () => {
    setLoading(true);
    ApiService({
      method: 'DELETE',
      url: `/item/${item.id}`,
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          RunToast('success', `Item ${item.name} deleted.`);
          history.push('/menus/items');
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', `Item ${item.name} delete failed.`);
      });
  };

  const handleClickDuplicate = () => {
    setItem({
      ...item,
      id: -1,
    });
    setIsChanged(true);
  };

  const checkValidate = () => {
    const validateTemp = { ...itemValidate };

    if (item.name.length === 0) {
      validateTemp.name = {
        validate: false,
        errorMsg: 'Name is required.',
      };
    } else {
      validateTemp.name = {
        validate: true,
        errorMsg: '',
      };
    }

    if (item.sell_its_own) {
      if (item.categories.length === 0) {
        validateTemp.categories = {
          validate: false,
          errorMsg: 'Category is required.',
        };
      } else {
        validateTemp.categories = { validate: true, errorMsg: '' };
      }
    }

    if (item.base_price) {
      validateTemp.base_price = { validate: true, errorMsg: '' };
    } else {
      validateTemp.base_price = {
        validate: false,
        errorMsg: 'Product selling price is required.',
      };
    }

    setItemValidate({
      ...validateTemp,
    });

    let isValidate = true;
    Object.keys(validateTemp).forEach((itemKey) => {
      if (!isValidate) return false;
      if (!validateTemp[itemKey].validate) isValidate = false;
    });

    return isValidate;
  };

  const handleClickSave = async () => {
    if (!checkValidate()) return;

    setLoading(true);
    const res = await ApiService({
      method: 'post',
      url: '/item/checkname',
      data: { name: item.name },
      headers: CONSTANTS.getToken().headers,
    });

    if (res.data.success) {
      if (res.data.item !== null && get(res.data.item, 'id', -9) !== item.id) {
        setItemValidate({
          ...itemValidate,
          name: {
            validate: false,
            errorMsg: 'Name already exist.',
          },
        });
        setLoading(false);
        return;
      }
    }

    if (item.id === -1) {
      createItem();
    } else {
      updateItem();
    }
  };

  const createItem = () => {
    const itemTemp = { ...item };
    delete itemTemp.id;
    delete itemTemp.photo_img;
    delete itemTemp.photo_file;

    itemTemp.categories = JSON.stringify(
      item.categories.map((itemCategory) => itemCategory.id)
    );
    itemTemp.groups_info = JSON.stringify(
      item.groups_info.map((itemGroup) => {
        return { id: itemGroup.id, order: itemGroup.order };
      })
    );

    const formData = new FormData();
    Object.keys(itemTemp).forEach((itemOne) => {
      formData.append(itemOne, itemTemp[itemOne]);
    });

    if (item.photo_file) formData.append('photo_img', item.photo_file);

    ApiService({
      method: 'POST',
      url: '/item',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...CONSTANTS.getToken().headers,
      },
    })
      .then((res) => {
        if (res.data.success) {
          setItem({
            ...item,
            id: res.data.item.id,
            photo_img: res.data.item.photo_img,
          });
          setIsChanged(false);
          setLoading(false);
          setOldCategoryIds([...JSON.parse(itemTemp.categories)]);
          RunToast('success', `Item ${item.name} created.`);
          history.push('/menus/items');
        } else setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', `Item ${item.name} create failed.`);
      });
  };

  const updateItem = () => {
    const itemTemp = { ...item };
    delete itemTemp.createdAt;
    delete itemTemp.updatedAt;
    delete itemTemp.id;
    delete itemTemp.photo_img;
    delete itemTemp.photo_file;
    delete itemTemp.groups;
    delete itemTemp.menus;
    delete itemTemp.categories;

    itemTemp.groups_info = JSON.stringify(item.groups_info);

    const formData = new FormData();
    Object.keys(itemTemp).forEach((itemOne) => {
      formData.append(itemOne, itemTemp[itemOne]);
    });
    if (item.photo_file) formData.append('photo_img', item.photo_file);

    // get new and removed category id
    const newCategoryIds = item.categories.map((itemOne) => itemOne.id);

    const added_category_ids = [];
    const removed_category_ids = [];

    oldCategoryIds.forEach((itemOne) => {
      if (!includes(newCategoryIds, itemOne))
        removed_category_ids.push(itemOne);
    });
    newCategoryIds.forEach((itemOne) => {
      if (!includes(oldCategoryIds, itemOne)) added_category_ids.push(itemOne);
    });

    formData.append('added_category_ids', JSON.stringify(added_category_ids));
    formData.append(
      'removed_category_ids',
      JSON.stringify(removed_category_ids)
    );

    ApiService({
      method: 'PUT',
      url: `/item/${item.id}`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...CONSTANTS.getToken().headers,
      },
    })
      .then((res) => {
        if (res.data.success) {
          setItem({
            ...item,
            photo_img: res.data.item.photo_img,
          });
          setIsChanged(false);
          setLoading(false);
          RunToast('success', `Item ${item.name} updated.`);
          setOldCategoryIds([...newCategoryIds]);
          history.push('/menus/items');
        }
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', `Item ${item.name} update failed.`);
      });
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_ITEMS_SECTION}>
      <HeaderDiv>
        <h1>
          <BackArrowBtn
            icon={faArrowLeft}
            onClick={() => {
              history.push('/menus/items');
            }}
          />
          Item settings
        </h1>
        {item.id >= 0 && (
          <>
            <DeleteButton
              className="ht-btn-grey"
              onClick={() => {
                handleClickDelete(item.id);
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
          itemID={item.id}
        >
          {isChanged ? 'Save' : 'Saved'}
        </SaveButton>
      </HeaderDiv>
      <ItemDetails
        item={item}
        setItem={(newItem) => {
          setItem({ ...newItem });
          setIsChanged(true);
        }}
        itemValidate={itemValidate}
        setItemValidate={(validateOne) =>
          setItemValidate({
            ...validateOne,
          })
        }
        categoryList={categoryList}
      />
      <CustomizeItem
        item={item}
        setItem={(newItem) => {
          setItem({ ...newItem });
          setIsChanged(true);
        }}
        groupList={groupList}
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

export default withRouter(ItemEdit);
