import React from 'react';
import styled from 'styled-components';
import * as CONSTANTS from 'constants/constants';

const TopSectionSelector = ({ curSection, setCurSection, storeValidate }) => {
  const sectionArray = [
    CONSTANTS.STORE_INFORMATION_SECTION,
    CONSTANTS.STORE_AREAFEES_SECTION,
  ];

  const checkInformationValidate = () => {
    let isValid = true;
    const validateTemp = { ...storeValidate };

    delete validateTemp.minimum_delivery_amount;
    delete validateTemp.delivery_prep_time;
    delete validateTemp.pickup_prep_time;

    Object.keys(validateTemp).forEach((item) => {
      if (!validateTemp[item].validate) isValid = false;
    });

    return isValid;
  };

  const checkAreaFeeValidate = () => {
    let isValid = true;
    const validateTemp = {
      minimum_delivery_amount: storeValidate.minimum_delivery_amount,
      delivery_prep_time: storeValidate.delivery_prep_time,
      pickup_prep_time: storeValidate.pickup_prep_time,
    };

    Object.keys(validateTemp).forEach((item) => {
      if (!validateTemp[item].validate) isValid = false;
    });

    return isValid;
  };

  const getSectionClass = (section) => {
    let strClass = curSection === section ? 'active' : '';

    if (section === CONSTANTS.STORE_INFORMATION_SECTION) {
      if (!checkInformationValidate()) strClass += ' invalid';
    } else if (section === CONSTANTS.STORE_AREAFEES_SECTION) {
      if (!checkAreaFeeValidate()) strClass += ' invalid';
    }

    return strClass;
  };

  return (
    <ComponentContainer>
      <ul>
        {sectionArray.map((item, nIndex) => {
          return (
            <li
              key={nIndex}
              className={getSectionClass(item)}
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
  width: 500px;
  height: 70px;
  border-radius: 12px;
  background-color: #ffffff;
  padding: 15px 10px;
  display: flex;
  align-items: center;
  align-self: center;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.06);

  ul {
    display: flex;
    flex: 1;
    justify-content: space-between;
    padding: 0;
    margin: 0;

    li {
      flex: 1 1 200px;
      margin: 0 20px;
      list-style: none;
      font-family: 'Inter', sans-serif;
      font-size: 15px;
      font-weight: 600;
      font-stretch: normal;
      font-style: normal;
      line-height: 18px;
      letter-spacing: normal;
      color: ${CONSTANTS.PRIMARY_DARK_COLOR};
      padding: 11px 0;
      cursor: pointer;
      border-radius: 12px;
      text-align: center;

      &:hover {
        color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
      }

      &.active {
        color: ${CONSTANTS.PRIMARY_ACTIVE_BACK_COLOR};
        background-color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
      }

      &.invalid {
        color: ${CONSTANTS.PRIMARY_RED_COLOR} !important;
        background-color: rgba(220, 53, 69, 0.2) !important;
      }
    }
  }
`;

export default TopSectionSelector;
