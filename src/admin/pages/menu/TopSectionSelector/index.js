import React from 'react';
import styled from 'styled-components';
import * as CONSTANTS from '../../../constants';

const TopSectionSelector = ({ curSection, setCurSection }) => {
  const menuArray = [
    CONSTANTS.MENU_OVERVIEW_SECTION,
    CONSTANTS.MENU_MENUS_SECTION,
    CONSTANTS.MENU_CATEGORIES_SECTION,
    CONSTANTS.MENU_ITEMS_SECTION,
    CONSTANTS.MENU_GROUP_OPTIONS,
  ];

  return (
    <ComponentContainer>
      <ul>
        {menuArray.map((item, nIndex) => {
          return (
            <li
              key={nIndex}
              className={item === curSection ? 'active' : ''}
              onClick={() => setCurSection(item)}
            >
              {item}
            </li>
          );
        })}
      </ul>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  height: 70px;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 15px 28px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.06);

  ul {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 0;
    margin: 0;

    li {
      list-style: none;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 18px;
      letter-spacing: normal;
      color: ${CONSTANTS.PRIMARY_DARK_COLOR};
      padding: 11px 45px;
      cursor: pointer;
      border-radius: 12px;
      text-align: center;

      &:hover {
        color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
      }

      &.active {
        color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
        background-color: ${CONSTANTS.PRIMARY_ACTIVE_BACK_COLOR};
      }
    }
  }
`;

export default TopSectionSelector;
