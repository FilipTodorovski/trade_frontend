import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { get, includes } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { Form, Button } from 'react-bootstrap';
import MenuContainer from '../../../components/MenuContainer';
import HtSpinner from '../../../../../components/HtSpinner';

import { RunToast } from 'utils/toast';
import ApiService from 'admin/ApiService';
import { getMenus } from 'Apis/Elastic';
import * as CONSTANTS from 'constants/constants';

const CategoryEdit = ({ history, match }) => {
  const [category, setCategory] = useState({});
  const [oldMenuIds, setOldMenuIds] = useState([]);
  const [menuList, setMenuList] = useState([]);

  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  const [categoryValidate, setCategoryValidate] = useState({
    name: {
      validate: true,
      errorMsg: '',
    },
    menus: {
      validate: true,
      errorMsg: '',
    },
  });
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadingData = async () => {
      setLoading(true);
      setIsChanged(false);
      try {
        if (match.params.id >= 0) {
          const categoryRes = await ApiService({
            method: 'GET',
            url: `/categoryWithMenuAndItem/${match.params.id}`,
            headers: CONSTANTS.getToken().headers,
          });
          if (categoryRes.data.success) {
            setCategory({
              ...categoryRes.data.category,
            });
            setOldMenuIds([
              ...get(categoryRes.data.category, 'menus', []).map(
                (item) => item.id
              ),
            ]);
          } else {
            setCategory({
              id: -1,
              name: '',
              menus: [],
              description: '',
            });
          }
        } else {
          setCategory({
            id: -1,
            name: '',
            menus: [],
            description: '',
          });
        }
      } catch (err) {}

      setLoading(false);
    };

    loadingData();
  }, []); // eslint-disable-line

  useEffect(() => {
    if (get(userInfo, 'id', -1) > 0) {
      getMenus(userInfo.id).then((resMenuList) => {
        setMenuList([
          ...resMenuList.map((item) => {
            return { value: item.id, label: item.name };
          }),
        ]);
      });
    }
  }, [userInfo]);

  const handleClickDuplicate = () => {
    setCategory({
      ...category,
      id: -1,
    });
    setIsChanged(true);
  };

  const handleClickDelete = () => {
    setLoading(true);
    ApiService({
      method: 'DELETE',
      url: `/category/${category.id}`,
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          history.push('/menus/categories');
          setLoading(false);
          RunToast('success', `Category ${category.name} deleted.`);
        }
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', `Category ${category.name} delete failed.`);
      });
  };

  const checkValidate = () => {
    let isValidate = true;
    let nameValidate = { validate: true, errorMsg: '' };
    let menuValidate = { validate: true, errorMsg: '' };

    if (category.name.length === 0) {
      nameValidate = {
        validate: false,
        errorMsg: 'Name is required.',
      };
      isValidate = false;
    } else {
      nameValidate = {
        validate: true,
        errorMsg: '',
      };
    }
    if (category.menus.length === 0) {
      menuValidate = {
        validate: false,
        errorMsg: 'Menu is required',
      };
      isValidate = false;
    } else {
      menuValidate = { validate: true, errorMsg: '' };
    }
    setCategoryValidate({
      name: { ...nameValidate },
      menus: { ...menuValidate },
    });

    return isValidate;
  };

  const handleClickSave = async () => {
    // check validate
    if (!checkValidate()) return;

    setLoading(true);
    const res = await ApiService({
      method: 'post',
      url: '/category/checkname',
      data: { name: category.name },
      headers: CONSTANTS.getToken().headers,
    });

    if (res.data.success) {
      if (
        res.data.category !== null &&
        get(res.data.category, 'id', -9) !== category.id
      ) {
        setCategoryValidate({
          ...categoryValidate,
          name: {
            validate: false,
            errorMsg: 'Name already exist.',
          },
        });
        setLoading(false);
        return;
      }
    }

    if (category.id === -1) {
      const categoryTemp = { ...category };
      delete categoryTemp.createdAt;
      delete categoryTemp.updatedAt;
      delete categoryTemp.id;
      categoryTemp.menus = categoryTemp.menus.map((item) => item.id);
      ApiService({
        method: 'POST',
        url: '/category',
        data: {
          ...categoryTemp,
        },
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) {
            setCategory({
              ...category,
              id: res.data.category.id,
            });
            setOldMenuIds([...categoryTemp.menus]);
            setIsChanged(false);
            setLoading(false);
            RunToast('success', `Category ${category.name} created.`);
          }
        })
        .catch((err) => {
          RunToast('error', `Category ${category.name} create failed.`);
          setLoading(false);
        });
    } else {
      const categoryTemp = { ...category };
      delete categoryTemp.createdAt;
      delete categoryTemp.updatedAt;
      delete categoryTemp.id;
      delete categoryTemp.menus;

      const newMenuIds = category.menus.map((item) => item.id);

      const added_menu_ids = [];
      const removed_menu_ids = [];

      oldMenuIds.forEach((item) => {
        if (!includes(newMenuIds, item)) removed_menu_ids.push(item);
      });
      newMenuIds.forEach((item) => {
        if (!includes(oldMenuIds, item)) added_menu_ids.push(item);
      });

      ApiService({
        method: 'PUT',
        url: `/category/${category.id}`,
        data: {
          ...categoryTemp,
          added_menu_ids,
          removed_menu_ids,
        },
        headers: {
          'Content-Type': 'application/json',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) {
            setIsChanged(false);
            RunToast('success', `Category ${category.name} updated.`);
            setOldMenuIds([...newMenuIds]);
          }
          setLoading(false);
        })
        .catch((err) => {
          RunToast('error', `Category ${category.name} update failed.`);
          setLoading(false);
        });
    }
  };

  const getSelectedMenuist = (menuValues) => {
    return menuValues.map((item) => {
      return { value: item.id, label: item.name };
    });
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_CATEGORIES_SECTION}>
      <SectionContainer>
        <HeaderDiv>
          <h1>
            <BackArrowBtn
              icon={faArrowLeft}
              onClick={() => {
                history.push('/menus/categories');
              }}
            />
            Category settings
          </h1>
          {category.id >= 0 && (
            <>
              <DeleteButton
                className="ht-btn-grey"
                onClick={() => {
                  handleClickDelete(category.id);
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
            categoryid={category.id}
          >
            {isChanged ? 'Save' : 'Saved'}
          </SaveButton>
        </HeaderDiv>

        <CategoryDetailsContainer className="ht-card">
          <h5>Category details</h5>
          <Form>
            <Form.Group>
              <Form.Label className="ht-label">Category name</Form.Label>
              <Form.Control
                className="ht-form-control name-input"
                type="input"
                value={category.name}
                onChange={(e) => {
                  setCategory({
                    ...category,
                    name: e.target.value,
                  });
                  setIsChanged(true);
                }}
                placeholder="Enter category name"
                isInvalid={!categoryValidate.name.validate}
              />
              <Form.Control.Feedback type="invalid">
                {categoryValidate.name.errorMsg}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label className="ht-label">
                Which menu would you like to associate this category?
              </Form.Label>
              <Select
                name="store-selector"
                options={menuList}
                value={getSelectedMenuist(get(category, 'menus', []))}
                onChange={(e) => {
                  setCategory({
                    ...category,
                    menus:
                      e === null
                        ? []
                        : [
                            ...e.map((item) => {
                              return { id: item.value, name: item.label };
                            }),
                          ],
                  });
                  setIsChanged(true);
                }}
                className={`ht-selector menu-selector ${
                  categoryValidate.menus.validate ? '' : 'invalidate'
                }`}
                classNamePrefix="select"
                isMulti
                placeholder="Add menu..."
              />
              {!categoryValidate.menus.validate && (
                <CustomInvalidLabel>
                  {categoryValidate.menus.errorMsg}
                </CustomInvalidLabel>
              )}
            </Form.Group>
          </Form>
        </CategoryDetailsContainer>
        {loading && <HtSpinner />}
      </SectionContainer>
    </MenuContainer>
  );
};

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

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
  margin-left: ${(props) => (props.categoryid >= 0 ? '15px' : 'auto')};
`;

const CategoryDetailsContainer = styled.div`
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

const CustomInvalidLabel = styled.div`
  width: 100%;
  margin-top: 0.25rem;
  font-size: 100%;
  color: #d4351c;

  &.invalidate {
    .select__control {
      border: solid 1.5px #d4351c !important;
    }
    &:focus {
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
  }
`;
export default withRouter(CategoryEdit);
