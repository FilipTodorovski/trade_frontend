import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Button } from 'react-bootstrap';
import styled from 'styled-components';
import Select from 'react-select';
import _ from 'lodash';

import MenuContainer from '../../components/MenuContainer';
import CategoryDragable from './CategoryDragable';
import { sortMenuData } from 'utils/sortMenu';
import HtSpinner from '../../../../components/HtSpinner';
import { RunToast } from 'utils/toast';
import ApiService from 'admin/ApiService';
import { getMenus } from 'Apis/Elastic';
import * as CONSTANTS from 'constants/constants';

const OverviewSection = () => {
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));
  const history = useHistory();
  const [menuId, setMenuId] = useState(-1);
  const [menuList, setMenuList] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unmounted = false;
    const getMenuList = async () => {
      const resMenuList = await getMenus(userInfo.id);
      if (!unmounted) {
        if (resMenuList.length > 0) {
          setMenuList([...resMenuList]);
          setMenuId(resMenuList[0].id);
        } else setLoading(false);
      }
    };
    getMenuList();

    return () => {
      unmounted = true;
    };
  }, []); // eslint-disable-line

  const getMenuListOptions = () => {
    return menuList.map((item) => {
      return { value: item.id, label: item.name };
    });
  };

  const getSelectedMenuValue = (id) => {
    const filteredOne = menuList.filter((item) => item.id === id);
    if (filteredOne.length > 0)
      return { value: filteredOne[0].id, label: filteredOne[0].name };
  };

  useEffect(() => {
    if (menuId > 0) {
      setLoading(true);
      ApiService({
        method: 'get',
        url: `/menu/full/${menuId}`,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...CONSTANTS.getToken().headers,
        },
      })
        .then((res) => {
          if (res.data.success) {
            setSelectedMenu({ ...sortMenuData(res.data.menu) });
            setLoading(false);
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  }, [menuId]);

  const handleClickCollapse = (bCollapse) => {
    const string = JSON.stringify(selectedMenu.categories);
    let stringResult = '';

    if (bCollapse) {
      stringResult = string.split('"collapsed":false').join('"collapsed":true');
    } else {
      stringResult = string.split('"collapsed":true').join('"collapsed":false');
    }

    setSelectedMenu({
      ...selectedMenu,
      categories: [...JSON.parse(stringResult)],
    });
  };

  const handleClickSave = () => {
    // get order_info
    const order_infoTemp = [];
    selectedMenu.categories.forEach((categoryItem) => {
      const categoryOrder = {
        id: categoryItem.id,
        order: categoryItem.order,
        item: [],
      };

      categoryItem.category.item.forEach((itemOne) => {
        const groups = [];
        itemOne.groups_info.forEach((groupItem) => {
          groups.push({ id: groupItem.id, order: groupItem.order });
        });
        categoryOrder.item.push({
          id: itemOne.id,
          order: itemOne.order,
          group: [...groups],
        });
      });
      order_infoTemp.push(categoryOrder);
    });

    setLoading(true);
    ApiService({
      method: 'PUT',
      url: `/menu/order/${menuId}`,
      data: { order_info: JSON.stringify(order_infoTemp) },
      headers: {
        ...CONSTANTS.getToken().headers,
      },
    })
      .then((res) => {
        setIsChanged(false);
        setLoading(false);
        RunToast(
          'success',
          `Store ${getSelectedMenuValue(menuId).label} order saved.`
        );
      })
      .catch((err) => {
        setLoading(false);
        RunToast(
          'error',
          `Store ${getSelectedMenuValue(menuId).label} order save failed.`
        );
      });
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_OVERVIEW_SECTION}>
      <SectionContainer>
        <HeaderPanel>
          <h1 className="h1-title">Overview</h1>
          {menuList.length > 0 && (
            <>
              <Select
                className="menu-selector ht-selector"
                classNamePrefix="select"
                isDisabled={false}
                isLoading={false}
                isClearable={false}
                isSearchable={false}
                name="menu-selector"
                value={getSelectedMenuValue(menuId)}
                options={getMenuListOptions()}
                onChange={(e) => {
                  setMenuId(e.value);
                  setIsChanged(false);
                }}
              />
              <SaveButton
                variant="primary"
                className={`ht-btn-primary ${
                  menuId < 0 || !isChanged ? 'ht-btn-primary-disable' : ''
                }`}
                onClick={() => {
                  handleClickSave();
                }}
              >
                {isChanged ? 'Save' : 'Saved'}
              </SaveButton>
            </>
          )}
        </HeaderPanel>
        {menuList.length > 0 && (
          <ExpandDiv>
            <div
              onClick={() => {
                handleClickCollapse(false);
              }}
            >
              Expand all
            </div>
            <div
              onClick={() => {
                handleClickCollapse(true);
              }}
            >
              Collapse all
            </div>
          </ExpandDiv>
        )}
        {_.get(selectedMenu, 'id', -1) >= 0 &&
          (!selectedMenu.categories ||
            selectedMenu.categories.length === 0) && (
            <HasNoCategory>This menu has no category.</HasNoCategory>
          )}
        {menuList.length > 0 ? (
          <CategoryDragable
            selectedMenu={selectedMenu}
            updateCategory={(updatedOne) => {
              setSelectedMenu({
                ...selectedMenu,
                categories: [...updatedOne],
              });
              setIsChanged(true);
            }}
          />
        ) : (
          <EmptyDiv className="ht-card">
            <h5>No menus exist yet</h5>
            <Button
              variant="primary"
              className="ht-btn-primary btn-create-menu"
              onClick={() => {
                history.push('/menus/edit/-1');
              }}
            >
              Create your first menu
            </Button>
          </EmptyDiv>
        )}
        {loading && <HtSpinner />}
      </SectionContainer>
    </MenuContainer>
  );
};

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const HeaderPanel = styled.div`
  display: flex;
  margin-bottom: 40px;

  .menu-selector {
    margin-left: 30px;
    .select__control {
      width: 186px;
    }
  }
`;

const SaveButton = styled(Button)`
  margin-left: auto;
`;

const ExpandDiv = styled.div`
  display: flex;
  margin-top: 13px;

  div {
    cursor: pointer;
    margin-right: 30px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 17px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  }
`;

const EmptyDiv = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 40px 50px;
  h5 {
    font-size: 18px;
    line-height: 22px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 22px;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0 0 25px 0;
  }

  .btn-create-menu {
    padding: 0;
    border-radius: 12px;
    border: solid 1.5px rgba(0, 0, 0, 0.1);
    width: 243px;
    height: 50px;
    font-size: 15px;
    font-weight: 600;
  }
`;

const HasNoCategory = styled.p`
  margin: 100px auto 0;
  font-size: 15px;
  color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  text-align: center;
  font-weight: 600;
`;
export default OverviewSection;
