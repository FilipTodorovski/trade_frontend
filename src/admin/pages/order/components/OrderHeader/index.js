import React from 'react';
import styled from 'styled-components';

import CustomDropDown from '../../../../components/DropDown';
import * as CONSTANTS from 'constants/constants';

const OrderHeader = ({ curSection, storeId, setStoreId, storeList }) => {
  const getStoreOption = (id) => {
    const filteredOne = storeList.filter((item) => item.id === id);

    if (filteredOne.length > 0) return filteredOne[0];

    return { id: -1, name: "Store doesn't exist" };
  };

  return (
    <OrderHeaderContainer>
      <div className="d-flex justify-content-between">
        <div className="d-flex flex-start">
          <h1>{curSection}</h1>
          <CustomDropDown
            id="orderstoremenu"
            value={getStoreOption(storeId)}
            options={storeList}
            onChange={(store) => {
              if (store) setStoreId(store.id);
            }}
          />
        </div>
      </div>
    </OrderHeaderContainer>
  );
};

const OrderHeaderContainer = styled.div`
  h1 {
    margin: 0 20px 0 0;
    font-family: 'Inter', sans-serif;
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  }
`;

export default OrderHeader;
