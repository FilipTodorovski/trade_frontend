import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Table } from 'react-bootstrap';
import MenuContainer from '../../components/MenuContainer';
import HtSpinner from '../../../../components/HtSpinner';

import ApiService from 'admin/ApiService';
import * as CONSTANTS from 'constants/constants';

const MenuList = ({ history }) => {
  const [menuList, setMenuList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    ApiService({
      method: 'GET',
      url: '/menu/withStore/all',
      headers: CONSTANTS.getToken().headers,
    })
      .then((res) => {
        if (res.data.success) setMenuList([...res.data.menus]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setMenuList([]);
        setLoading(false);
      });
  }, []);

  const getDaysStr = (dayArray) => {
    let strDayArr = '';
    for (let i = 0; i < dayArray.length; i++) {
      if (i === 0) strDayArr = CONSTANTS.DAY_NAMES[dayArray[i]];
      else if (dayArray[i] - dayArray[i - 1] > 1)
        strDayArr += `, ${CONSTANTS.DAY_NAMES[dayArray[i]]}`;
      else if (dayArray[i] - dayArray[i - 1] === 1) {
        let distance = 1;
        while (distance === 1 && i < dayArray.length) {
          distance = dayArray[i] - dayArray[i - 1];
          if (distance > 1) {
            i--;
            break;
          }
          if (i === dayArray.length - 1) break;
          i++;
        }
        strDayArr += ` - ${CONSTANTS.DAY_NAMES[dayArray[i]]}`;
      }
    }

    return strDayArr;
  };

  const getHoursStr = (hoursArray) => {
    let strReturn = '';
    hoursArray.forEach((item, nIndex) => {
      strReturn += `${CONSTANTS.getTwoIntString(
        item.start[0]
      )}:${CONSTANTS.getTwoIntString(
        item.start[1]
      )} - ${CONSTANTS.getTwoIntString(
        item.end[0]
      )}:${CONSTANTS.getTwoIntString(item.end[1])}`;

      if (nIndex < hoursArray.length - 1) strReturn += '; ';
    });
    return strReturn;
  };

  const showOpeningHours = (openHoursData) => {
    if (openHoursData === null) return <></>;
    return (
      <>
        <div>
          {openHoursData.map((item) => {
            return (
              <>
                {getDaysStr(item[0])}
                <br />
              </>
            );
          })}
        </div>
        <div style={{ paddingLeft: '10px' }}>
          {openHoursData.map((item) => {
            return (
              <>
                {getHoursStr(item[1])}
                <br />
              </>
            );
          })}
        </div>
      </>
    );
  };

  return (
    <MenuContainer curSection={CONSTANTS.MENU_MENUS_SECTION}>
      <HeaderDiv>
        <h1>Catalogues</h1>
        <Button
          className="btn-new-menu ht-btn-primary"
          onClick={() => {
            history.push('/menus/edit/-1');
          }}
        >
          + New Catalogue
        </Button>
      </HeaderDiv>
      <MenuTableContainer>
        <Table>
          <thead>
            <tr>
              <th className="menu-td">Catalogue name</th>
              <th className="hours-td">Hours</th>
            </tr>
          </thead>
          <tbody>
            {menuList.map((item, nIndex) => {
              return (
                <tr key={nIndex}>
                  <td className="menu-td">
                    <a
                      href
                      className="menuname"
                      onClick={() => {
                        history.push(`/menus/edit/${item.id}`);
                      }}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td className="hours-td">
                    <div className="hours">
                      {showOpeningHours(item.open_hours)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {loading && <HtSpinner />}
      </MenuTableContainer>
    </MenuContainer>
  );
};

const HeaderDiv = styled.div`
  display: flex;
  h1 {
    margin: 0;
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }

  .btn-new-menu {
    margin-left: auto;
  }
`;

const MenuTableContainer = styled.div`
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
      padding: 15px 40px;
      height: 82px;
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
        padding-left: 40px;
        padding-right: 40px;
        border: none;
        height: 100px;
        vertical-align: middle;
        .menuname {
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
        .hours {
          display: flex;
          line-height: 17px;
          font-family: 'Inter', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          font-stretch: normal;
          font-style: normal;
          letter-spacing: normal;
          color: ${CONSTANTS.PRIMARY_DARK_COLOR};
        }
      }
    }
  }
  .menu-td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 35%;
    padding-right: 20px;
  }
  .hours-td {
    width: 65%;
    padding-left: 20px;
  }
`;
export default withRouter(MenuList);
