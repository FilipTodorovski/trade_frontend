import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { Button, Table } from 'react-bootstrap';

import MenuContainer from '../../components/MenuContainer';
import SearchBox from '../../../../components/SearchBox';
import HtSpinner from '../../../../components/HtSpinner';
import { RunToast } from 'utils/toast';
import * as CONSTANTS from 'constants/constants';
import ApiService from 'admin/ApiService';

const GroupOptionList = ({ history }) => {
  const [groupOptionList, setGroupOptionList] = useState([]);
  const [filterStr, setFilterStr] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService({
      method: 'GET',
      url: '/group/full/all',
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) {
          setGroupOptionList(res.data.groups);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setGroupOptionList([]);
        RunToast('success', 'Group load failed.');
      });
  }, []);

  const getNames = (items) => {
    const returnElement = [];
    items.forEach((item, nIndex) => {
      let nameStr = item.name;
      if (nIndex < items.length - 1) nameStr += ', ';
      returnElement.push(<span key={nIndex}>{nameStr}</span>);
    });
    return returnElement;
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_GROUP_OPTIONS}>
      <SectionContainer>
        <HeaderDiv>
          <h1>Variations</h1>
          <NewGroupOptionBtn
            onClick={() => {
              history.push('/menus/group/-1');
            }}
            className="ht-btn-primary"
          >
            + New Variation
          </NewGroupOptionBtn>
        </HeaderDiv>
        <SearchBox
          searchStr={filterStr}
          onSearch={(val) => setFilterStr(val)}
        />
        <GroupOptionTableContainer>
          <Table>
            <thead>
              <tr>
                <th className="name-td" width="200">
                  Variation Name
                </th>
                <th className="menus-td">Contains</th>
              </tr>
            </thead>
            <tbody>
              {groupOptionList.map((groupOption, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <a
                        href
                        className="td-name"
                        onClick={() => {
                          history.push(`/menus/group/${groupOption.id}`);
                        }}
                      >
                        {groupOption.name}
                      </a>
                    </td>
                    <td>
                      <ItemsContent>{getNames(groupOption.items)}</ItemsContent>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </GroupOptionTableContainer>
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

const NewGroupOptionBtn = styled(Button)`
  margin-left: auto;
  padding-left: 0;
  padding-right: 0;
  width: 196px;
`;

const GroupOptionTableContainer = styled.div`
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

const ItemsContent = styled.div`
  span {
    margin: 0;
    line-height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }
`;

export default withRouter(GroupOptionList);
