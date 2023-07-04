import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { Button, Table } from 'react-bootstrap';

import Switch from 'sharedComponents/SwitchButton';
import MenuContainer from '../../components/MenuContainer';
import SearchBox from '../../../../components/SearchBox';
import HtSpinner from '../../../../components/HtSpinner';

import * as CONSTANTS from 'constants/constants';
import ApiService from 'admin/ApiService';

const ItemSection = ({ history }) => {
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStr, setFilterStr] = useState('');

  const formatGroupInfos = (items) => {
    return items.map((itemOne) => {
      const groups_info = itemOne.groups_info.map((groupInfo) => {
        return {
          ...groupInfo,
          ...itemOne.groups.find((group) => group.id === groupInfo.id),
        };
      });

      return {
        ...itemOne,
        groups_info: [...groups_info],
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    ApiService({
      method: 'POST',
      url: '/item/full/all',
      data: {},
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          setItemList([...formatGroupInfos(res.data.items)]);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setItemList([]);
      });
  }, []);

  const getFilteredCategories = () => {
    return itemList.filter((item) => {
      const filterOne = filterStr.toLowerCase();
      if (item.name.toLowerCase().indexOf(filterOne) >= 0) return true;

      for (let i = 0; i < item.menus.length; i++) {
        if (item.menus[i].name.toLowerCase().indexOf(filterOne) >= 0)
          return true;
      }

      for (let i = 0; i < item.categories.length; i++) {
        if (item.categories[i].name.toLowerCase().indexOf(filterOne) >= 0)
          return true;
      }
      return false;
    });
  };

  const getNames = (namesArry) => {
    let nameStr = '';
    namesArry.forEach((item, nIndex) => {
      nameStr += item.name;
      if (nIndex < namesArry.length - 1) nameStr += ', ';
    });
    return nameStr;
  };

  const handleActive = (itemId, value) => {
    ApiService({
      method: 'PUT',
      url: `/item/active/${itemId}`,
      data: { active: value },
      headers: {
        'Content-Type': 'application/json',
        ...CONSTANTS.getToken().headers,
      },
    })
      .then((res) => {
        if (res.data.success)
          setItemList([
            ...itemList.map((item) => {
              if (item.id === itemId)
                return {
                  ...item,
                  active: res.data.item.active,
                };
              return item;
            }),
          ]);
      })
      .catch((err) => {
        console.log('Update Item occur error.');
      });
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_ITEMS_SECTION}>
      <SectionContainer>
        <HeaderDiv>
          <h1>Items</h1>
          <NewItemBtn
            onClick={() => {
              history.push('/menus/item/-1');
            }}
            className="ht-btn-primary"
          >
            + New Product
          </NewItemBtn>
        </HeaderDiv>
        <SearchBox
          searchStr={filterStr}
          onSearch={(val) => setFilterStr(val)}
        />
        <ItemTableContainer>
          <Table>
            <thead>
              <tr>
                <th className="name-td">Products</th>
                <th className="menus-td">Menus</th>
                <th className="menus-td">Categories</th>
                <th className="items-td">Variations</th>
                <th className="price-td">Sell Price</th>
                <th className="item-active">Status</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredCategories().map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <a
                        href
                        className="td-name"
                        onClick={() => {
                          history.push(`/menus/item/${item.id}`);
                        }}
                      >
                        {item.name}
                      </a>
                    </td>
                    <td>
                      <ItemsContent>{getNames(item.menus)}</ItemsContent>
                    </td>
                    <td>
                      <ItemsContent>{getNames(item.categories)}</ItemsContent>
                    </td>
                    <td>
                      <ItemsContent>{getNames(item.groups_info)}</ItemsContent>
                    </td>
                    <td>
                      <ItemsContent>
                        £{Number(item.base_price).toFixed(2)}
                      </ItemsContent>
                    </td>
                    <td>
                      <ItemsContent>
                        <Switch
                          inputId={`item ${item.id}`}
                          isOn={item.active}
                          handleToggle={() => {
                            handleActive(item.id, !item.active);
                          }}
                        />
                      </ItemsContent>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </ItemTableContainer>
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
    line-height: 41px;
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
    margin: 0;
  }
`;

const NewItemBtn = styled(Button)`
  margin-left: auto;
  padding-left: 0;
  padding-right: 0;
  width: 160px;
`;

const ItemTableContainer = styled.div`
  margin-top: 31px;
  border-radius: 12px;
  box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: solid 1px rgba(39, 40, 72, 0.1);
  table {
    margin: 0;
  }

  thead {
    overflow: hidden;
    border-radius: 12px;
    background-color: #fafbff;
    line-height: 17.2px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.SECOND_GREY_COLOR};
    th {
      vertical-align: middle;
      border: none;
      padding: 15px 20px;
      height: 82px;

      &:first-child {
        padding-left: 40px;
      }
      &:last-child {
        padding-right: 40px;
      }
    }
  }
  tbody {
    tr {
      background-color: white;
      border-top: solid 1px rgba(39, 40, 72, 0.1);
      border-left: 0;
      border-right: 0;
      border-bottom: 0;
      td {
        padding-left: 20px;
        padding-right: 20px;
        border: none;
        height: 100px;
        vertical-align: middle;

        &:first-child {
          padding-left: 40px;
        }
        &:last-child {
          padding-right: 40px;
        }

        .td-name {
          cursor: pointer;
          line-height: 22px;
          font-family: 'Inter', sans-serif;
          font-size: 15.41px;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
        }
      }
    }
  }
`;

const ItemsContent = styled.p`
  margin: 0;
  line-height: 17px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  color: ${CONSTANTS.PRIMARY_DARK_COLOR};
`;
export default withRouter(ItemSection);
