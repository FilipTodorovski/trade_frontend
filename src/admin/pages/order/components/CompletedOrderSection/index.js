import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import CompletedOrderHeader, {
  COMPLETED_ORDER_LIST,
  COMPLETED_ORDER_DETAIL,
} from './CompletedOrderHeader';
import OrderCard from '../OrderCard';
import { getOrderListTotalPrice } from 'utils/order';
import {
  ORDER_STATUS,
  ORDER_TAB_TITLE,
  ORDER_TRANS_TYPE,
  SECOND_GREY_COLOR,
  PRIMARY_DARK_COLOR,
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_RED_COLOR,
} from 'constants/constants';

const CompletedOrderSection = ({
  storeId,
  storeList,
  setStoreId,
  orders,
  orderLoading,
  dateRange,
  changeRange,
  searchStr,
  setSearchStr,
  finishEditSearch,
  refundOrder,
}) => {
  const [selectedOrder, setSelectedOrder] = useState({});

  useEffect(() => {
    setSelectedOrder({});
  }, []);

  const renderOrderException = () => {
    if (orders && orders.length > 0) return null;
    return (
      <div className="grid-row-wrapper">
        <EmptyOrderContainer className="grid-item no-content">
          {orderLoading ? (
            <h4>Loading...</h4>
          ) : (
            <>
              <h4>We are currently waiting for your first order.</h4>
              <span>
                Once it's moved through the order process it will show here.
              </span>
            </>
          )}
        </EmptyOrderContainer>
      </div>
    );
  };

  const clickOrderNumber = (orderNumber) => {
    const fiilteredOne = orders.filter(
      (item) => item.order_number === orderNumber
    );

    if (fiilteredOne.length > 0)
      setSelectedOrder({
        ...fiilteredOne[0],
      });
  };

  const renderStatus = (orderItem) => {
    if (orderItem.status === ORDER_STATUS.COMPLETED) {
      if (orderItem.trans_type === ORDER_TRANS_TYPE.DELIVERY)
        return 'Delivered';
      if (orderItem.trans_type === ORDER_TRANS_TYPE.COLLECTION)
        return 'Picked up';
    } else if (orderItem.status === ORDER_STATUS.REJECTED) {
      return <span style={{ color: PRIMARY_RED_COLOR }}>Rejected</span>;
    } else if (orderItem.status === ORDER_STATUS.REFUNDED) {
      return <span style={{ color: 'red' }}>Refunded</span>;
    }
  };

  return (
    <>
      <CompletedOrderHeader
        storeList={storeList}
        dateRange={dateRange}
        changeRange={changeRange}
        storeId={storeId}
        setStoreId={(newStoreId) => setStoreId(newStoreId)}
        searchStr={searchStr}
        setSearchStr={(newStr) => setSearchStr(newStr)}
        finishEditSearch={finishEditSearch}
        curSection={
          Object.keys(selectedOrder).length === 0
            ? COMPLETED_ORDER_LIST
            : COMPLETED_ORDER_DETAIL
        }
        selectedOrder={selectedOrder}
        backList={() => {
          setSelectedOrder({});
        }}
      />
      {Object.keys(selectedOrder).length === 0 ? (
        <CompletedOrderList>
          <div className="grid-row-header">
            <div className="grid-item">OrderNumber</div>
            <div className="grid-item">Date & Time</div>
            <div className="grid-item">Status</div>
            <div className="grid-item">Amount</div>
          </div>
          {orders.length > 0 &&
            orders.map((item, nIndex) => {
              return (
                <div className="grid-row-wrapper" key={nIndex}>
                  <div className="grid-item order-number">
                    <span onClick={() => clickOrderNumber(item.order_number)}>
                      {item.order_number}
                    </span>
                  </div>
                  <div className="grid-item">
                    {`${moment(item.updatedAt).format(
                      'Do MMM, YYYY'
                    )} at ${moment(item.updatedAt).format('hh:mm')}`}
                  </div>
                  <div className="grid-item">{renderStatus(item)}</div>
                  <div className="grid-item">
                    £{Number(item.amount).toFixed(2)}
                  </div>
                </div>
              );
            })}
          {renderOrderException()}
        </CompletedOrderList>
      ) : (
        <OrderCardContainer>
          <OrderCard
            key={selectedOrder.order_number}
            curSection={ORDER_TAB_TITLE.COMPLETED}
            orderInfo={selectedOrder}
            acceptOrder={() => {}}
            rejectOrder={() => {}}
            readyOrder={() => {}}
            deliverPickOrder={() => {}}
            completeOrder={() => {}}
            refundOrder={(newValue) => {
              setSelectedOrder({ ...newValue });
              refundOrder(newValue);
            }}
          />
        </OrderCardContainer>
      )}
    </>
  );
};

const CompletedOrderList = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: auto auto auto auto;
  border-radius: 12px;
  box-shadow: 0 0 50px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
  background-color: white;

  .grid-row-header {
    display: contents;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 17px;
    letter-spacing: normal;
    color: ${SECOND_GREY_COLOR};
    .grid-item {
      background-color: #fafbff;
    }
  }

  .grid-row-wrapper {
    display: contents;
    font-size: 1rem;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 17px;
    letter-spacing: normal;
    color: ${PRIMARY_DARK_COLOR};

    &:last-child {
      .grid-item {
        border: none;
      }
    }
  }

  .grid-item {
    border-bottom: 1px solid rgba(39, 40, 72, 0.2);
    padding: 39px 40px 38px 40px;
    &.order-number {
      color: ${PRIMARY_ACTIVE_COLOR};
      span {
        cursor: pointer;
      }
    }
    &.no-content {
      grid-column-start: 1;
      grid-column-end: 5;
    }
  }
`;

const EmptyOrderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;

  h4 {
    font-size: 1.2rem;
    font-weight: 700;
  }
`;

const OrderCardContainer = styled.div`
  display: block;
  margin-top: 60px;
`;

export default CompletedOrderSection;
