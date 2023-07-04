import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import CustomDropDown from '../../../../components/DropDown';
import DateRange from '../../../../components/DateRange';
import SearchBox from '../../../../components/SearchBox';

import { ORDER_STATUS, PRIMARY_DARK_COLOR } from 'constants/constants';

export const COMPLETED_ORDER_LIST = 0;
export const COMPLETED_ORDER_DETAIL = 1;

const CompletedOrderHeader = ({
  storeId,
  setStoreId,
  storeList,
  dateRange,
  changeRange,
  searchStr,
  setSearchStr,
  finishEditSearch,
  curSection,
  selectedOrder,
  backList,
}) => {
  const getStoreOption = (id) => {
    const filteredOne = storeList.filter((item) => item.id === id);

    if (filteredOne.length > 0) return filteredOne[0];

    return { id: -1, name: "Store doesn't exist" };
  };

  return (
    <OrderHeaderContainer>
      {curSection === COMPLETED_ORDER_LIST && (
        <>
          <div className="d-flex justify-content-between">
            <div className="d-flex flex-start">
              <h1>Completed</h1>
              <CustomDropDown
                id="complted-storemenu"
                value={getStoreOption(storeId)}
                options={storeList}
                onChange={(store) => {
                  if (store) setStoreId(store.id);
                }}
              />
            </div>
            <DateRange
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onChange={(val) => changeRange({ ...val })}
            />
          </div>

          <SearchBox
            searchStr={searchStr}
            onSearch={(val) => setSearchStr(val)}
            onBlur={finishEditSearch}
          />
        </>
      )}
      {curSection === COMPLETED_ORDER_DETAIL && (
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-start align-items-center">
            <BackArrowBtn
              icon={faArrowLeft}
              onClick={() => {
                backList();
              }}
            />
            <h1>
              {selectedOrder.status === ORDER_STATUS.COMPLETED &&
                'Completed order'}
              {selectedOrder.status === ORDER_STATUS.REJECTED &&
                'Rejected order'}
              {selectedOrder.status === ORDER_STATUS.REFUNDED &&
                'Refunded order'}
            </h1>
          </div>
        </div>
      )}
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
    color: ${PRIMARY_DARK_COLOR};
  }
`;

const BackArrowBtn = styled(FontAwesomeIcon)`
  font-size: 25px;
  color: ${PRIMARY_DARK_COLOR};
  cursor: pointer;
  margin-right: 1rem;
`;

export default CompletedOrderHeader;
