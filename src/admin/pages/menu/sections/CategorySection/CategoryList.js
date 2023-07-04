import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';

import { Button, Table } from 'react-bootstrap';
import MenuContainer from '../../components/MenuContainer';
import SearchBox from '../../../../components/SearchBox';
import HtSpinner from '../../../../components/HtSpinner';
import ApiService from 'admin/ApiService';

import * as CONSTANTS from 'constants/constants';

const CategoryList = ({ history }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService({
      method: 'GET',
      url: '/categoryWithMenuAndItem/all',
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) setCategories([...res.data.categories]);
        setLoading(false);
      })
      .catch((err) => {
        setCategories([]);
        setLoading(false);
      });
  }, []);

  const [filterStr, setFilterStr] = useState('');

  const getFilteredCategories = () => {
    return categories.filter((item) => {
      const filterOne = filterStr.toLowerCase();
      if (item.name.toLowerCase().indexOf(filterOne) >= 0) return true;

      for (let i = 0; i < item.menus.length; i++) {
        if (item.menus[i].name.toLowerCase().indexOf(filterOne) >= 0)
          return true;
      }
      return false;
    });
  };

  const getMenuName = (menuNames) => {
    let nameStr = '';
    menuNames.forEach((item, nIndex) => {
      nameStr += item.name;
      if (nIndex < menuNames.length - 1) nameStr += ', ';
    });
    return nameStr;
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_CATEGORIES_SECTION}>
      <SectionContainer>
        <HeaderDiv>
          <h1>Categories</h1>
          <NewCategoryBtn
            onClick={() => {
              history.push('/menus/category/-1');
            }}
            className="ht-btn-primary"
          >
            + New Category
          </NewCategoryBtn>
        </HeaderDiv>
        <SearchBox
          searchStr={filterStr}
          onSearch={(val) => setFilterStr(val)}
        />
        <CategoryTableContainer>
          <Table>
            <thead>
              <tr>
                <th className="name-td">Category Name</th>
                <th className="menus-td">Menus</th>
                <th className="items-td">Items</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredCategories().map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <a
                        href
                        className="category-name"
                        onClick={() => {
                          history.push(`/menus/category/${item.id}`);
                        }}
                      >
                        {item.name}
                      </a>
                    </td>
                    <td>
                      <ItemsContent>{getMenuName(item.menus)}</ItemsContent>
                    </td>
                    <td>
                      <ItemsContent>{getMenuName(item.items)}</ItemsContent>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </CategoryTableContainer>
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

const NewCategoryBtn = styled(Button)`
  margin-left: auto;
  padding-left: 0;
  padding-right: 0;
  width: 160px;
`;

const CategoryTableContainer = styled.div`
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

        .category-name {
          cursor: pointer;
          line-height: 22px;
          font-family: 'Inter', sans-serif;
          font-size: 18px;
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

export default withRouter(CategoryList);
