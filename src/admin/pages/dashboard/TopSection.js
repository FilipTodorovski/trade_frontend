import React from 'react';

import styled from 'styled-components';
import moment from 'moment';
import { PRIMARY_ACTIVE_COLOR, PRIMARY_RED_COLOR } from 'constants/constants';
import ChevSvg from 'assets/images/chev-up.svg';

const CUR_DATEFORMAT = 'Cur';
const PREV_DATEFORMAT = 'Prev';

const SECTION_TOTAL_REVENUE = 0;
const SECTION_TOTAL_ORDERS = 1;
const SECTION_AVERAGE_ORDER = 2;

const TopSection = ({ dateRange, orderList, prevOrderList }) => {
  const getTotalRevenue = (day) => {
    if (day === CUR_DATEFORMAT) {
      if (orderList.length === 0) return 0;
      return orderList.reduce((a, b) => a + b.amount, 0);
    }
    if (day === PREV_DATEFORMAT) {
      if (prevOrderList.length === 0) return 0;
      return prevOrderList.reduce((a, b) => a + b.amount, 0);
    }
  };

  const getOrderAverageRevenue = (day) => {
    if (day === CUR_DATEFORMAT) {
      if (orderList.length === 0) return 0;
      const sum = orderList.reduce((a, b) => a + b.amount, 0);
      return sum / orderList.length;
    }
    if (day === PREV_DATEFORMAT) {
      if (prevOrderList.length === 0) return 0;
      const sum = prevOrderList.reduce((a, b) => a + b.amount, 0);
      return sum / prevOrderList.length;
    }
  };

  const getUpdatesFromYesterday = (value) => {
    let cur;
    let prev;
    switch (value) {
      case SECTION_TOTAL_REVENUE:
        cur = getTotalRevenue(CUR_DATEFORMAT);
        prev = getTotalRevenue(PREV_DATEFORMAT);
        break;
      case SECTION_TOTAL_ORDERS:
        cur = orderList.length;
        prev = prevOrderList.length;
        break;
      case SECTION_AVERAGE_ORDER:
        cur = getOrderAverageRevenue(CUR_DATEFORMAT);
        prev = getOrderAverageRevenue(PREV_DATEFORMAT);
        break;
      default:
        cur = 0;
        prev = 0;
    }

    const changedValue = cur - prev;
    if (changedValue === 0) return '+0%';
    if (prev === 0) return '+100%';
    if (cur === 0) return '-100%';
    const proValue = parseInt(((cur - prev) / prev) * 100, 0);
    if (proValue > 0) return `+${proValue}%`;
    return `${proValue}%`;
  };

  const renderUpdateStr = (totalKind, prevKind) => {
    let totalValue =
      totalKind === SECTION_TOTAL_ORDERS
        ? prevOrderList.length
        : getTotalRevenue(totalKind);
    const updateStr = getUpdatesFromYesterday(prevKind);
    const firstLetter = updateStr.substr(0, 1);

    return (
      <h4 className={`change-value ${firstLetter === '-' && 'down'}`}>
        {totalKind === SECTION_TOTAL_ORDERS
          ? `${parseInt(totalValue)}`
          : `£${Number(totalValue).toFixed(2)}`}
        {` (${updateStr})`}
      </h4>
    );
  };

  const getPreviousDateStr = () => {
    const curDate = moment(new Date());

    const startDateValue = dateRange.startDate.startOf('day').valueOf();
    const endDateValue = dateRange.endDate.endOf('day').valueOf();

    // check today
    if (
      curDate.startOf('day').startOf().valueOf() === startDateValue &&
      curDate.endOf('day').valueOf() === endDateValue
    )
      return 'Since yesterday';

    if (
      moment(startDateValue).startOf('month').valueOf() === startDateValue &&
      moment(endDateValue).endOf('month').valueOf() === endDateValue
    ) {
      return `Since ${moment(startDateValue)
        .subtract(1, 'months')
        .startOf('month')
        .format('Do MMM')} - ${moment(endDateValue)
        .subtract(1, 'months')
        .endOf('month')
        .format('Do MMM')}`;
    }

    const diff = moment(endDateValue).diff(moment(startDateValue), 'days') + 1;
    const prevStartDate = moment(startDateValue).subtract(diff, 'days');
    const prevEndDate = moment(startDateValue).subtract(1, 'days').endOf('day');

    if (prevStartDate.valueOf() === prevEndDate.startOf('day').valueOf())
      return `Since ${prevStartDate.format('Do MMM')}`;
    return `Since ${prevStartDate.format('Do MMM')} - ${prevEndDate.format(
      'Do MMM'
    )}`;
    // return '';
  };

  const getChevStyles = (value) => {
    let cur;
    let prev;
    switch (value) {
      case SECTION_TOTAL_REVENUE:
        cur = getTotalRevenue(CUR_DATEFORMAT);
        prev = getTotalRevenue(PREV_DATEFORMAT);
        break;
      case SECTION_TOTAL_ORDERS:
        cur = orderList.length;
        prev = prevOrderList.length;
        break;
      case SECTION_AVERAGE_ORDER:
        cur = getOrderAverageRevenue(CUR_DATEFORMAT);
        prev = getOrderAverageRevenue(PREV_DATEFORMAT);
        break;
      default:
        cur = 0;
        prev = 0;
    }

    if (prev === cur) return { display: 'none' };
    if (prev > cur) return { transform: 'rotate(180deg)' };
    return {};
  };

  return (
    <ComponentContainer>
      <DataItem>
        <h4 className="item-label">Total Revenue</h4>
        <h1>£{Number(getTotalRevenue(CUR_DATEFORMAT)).toFixed(2)}</h1>
        <ItemFooter>
          <img
            src={ChevSvg}
            style={getChevStyles(SECTION_TOTAL_REVENUE)}
            alt="total revenue"
          />
          {renderUpdateStr(PREV_DATEFORMAT, SECTION_TOTAL_REVENUE)}
          <h6>{getPreviousDateStr()}</h6>
        </ItemFooter>
      </DataItem>
      <DataItem>
        <h4 className="item-label">Total Orders</h4>
        <h1>{orderList.length}</h1>
        <ItemFooter>
          <img
            src={ChevSvg}
            style={getChevStyles(SECTION_TOTAL_ORDERS)}
            alt="total order"
          />
          {renderUpdateStr(SECTION_TOTAL_ORDERS, SECTION_TOTAL_ORDERS)}
          <h6>{getPreviousDateStr()}</h6>
        </ItemFooter>
      </DataItem>
      <DataItem>
        <h4 className="item-label">Average Order</h4>
        <h1>£{Number(getOrderAverageRevenue(CUR_DATEFORMAT)).toFixed(2)}</h1>
        <ItemFooter>
          <img
            src={ChevSvg}
            style={getChevStyles(SECTION_AVERAGE_ORDER)}
            alt="average order"
          />
          {renderUpdateStr(PREV_DATEFORMAT, SECTION_AVERAGE_ORDER)}
          <h6>{getPreviousDateStr()}</h6>
        </ItemFooter>
      </DataItem>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  margin: 54px 0 0 0;
  flex-wrap: wrap;
  padding: 19px 31px 19px 31px;
  background-color: white !important;
  border: 1px solid rgba(0,0,0,0.1) !important;
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 33.33%;
  margin: 10px 0;
  .item-label {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    margin: 0 0 6px 0;
  }
  h1 {
    font-weight: 600;
    font-size: 50px;
    line-height: 61px;
    color: ${PRIMARY_ACTIVE_COLOR};
    margin: 0 0 7px 0;
  }
`;

const ItemFooter = styled.div`
  display: flex;
  align-items: center;
  .change-value {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    color: #036d21;
    margin: 0 0 0 5px;
    white-space: nowrap;
    &.down {
      color: ${PRIMARY_RED_COLOR};
    }
  }
  h6 {
    font-size: 14px;
    line-height: 17px;
    text-align: center;
    margin: 0 0 0 5px;
  }
`;
export default TopSection;
