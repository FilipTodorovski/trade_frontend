import React, { useEffect } from 'react';
import styled from 'styled-components';

import { getOrderStatuses } from 'Apis/Elastic';
import {
  ORDER_TAB_TITLE,
  ORDER_STATUS,
  PRIMARY_DARK_COLOR,
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_ACTIVE_BACK_COLOR,
} from 'constants/constants';

const orderStatusArray = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.ACCEPTED,
  ORDER_STATUS.READY,
  ORDER_STATUS.DELIVERY_PICKUP,
  ORDER_STATUS.COMPLETED,
];

const TopSectionSelector = ({
  curSection,
  setCurSection,
  storeId,
  orderCount,
  setOrderCount,
}) => {
  const sectionArray = [
    ORDER_TAB_TITLE.NEW,
    ORDER_TAB_TITLE.PREPARING,
    ORDER_TAB_TITLE.READY,
    ORDER_TAB_TITLE.DELIVERY_PICKUP,
    ORDER_TAB_TITLE.COMPLETED,
  ];
  useEffect(() => {
    let unmounted = false;
    if (storeId !== -1) {
      getOrderStatuses([storeId]).then((res) => {
        if (!unmounted) {
          const orderCountTemp = [];
          orderStatusArray.forEach((item) => {
            if (item === ORDER_STATUS.COMPLETED) {
              orderCountTemp.push(
                res.filter((itemRes) => {
                  if (
                    itemRes === ORDER_STATUS.COMPLETED ||
                    itemRes === ORDER_STATUS.REJECTED ||
                    itemRes === ORDER_STATUS.REFUNDED
                  )
                    return true;
                  return false;
                }).length
              );
            } else
              orderCountTemp.push(
                res.filter((itemRes) => itemRes === item).length
              );
          });
          setOrderCount([...orderCountTemp]);
        }
      });
    }
    return () => {
      unmounted = true;
    };
  }, [storeId]); // eslint-disable-line

  return (
    <ComponentContainer>
      <ul>
        {sectionArray.map((item, nIndex) => {
          return (
            <li
              key={nIndex}
              className={item === curSection ? 'active' : ''}
              onClick={() => setCurSection(item)}
            >
              {orderCount[nIndex] > 0 && item !== ORDER_TAB_TITLE.COMPLETED && (
                <span>{orderCount[nIndex]}</span>
              )}
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
      color: ${PRIMARY_DARK_COLOR};
      padding: 11px 45px;
      cursor: pointer;
      border-radius: 12px;
      text-align: center;

      &:hover {
        color: ${PRIMARY_ACTIVE_COLOR};
      }

      &.active {
        color: ${PRIMARY_ACTIVE_BACK_COLOR};
        background-color: ${PRIMARY_ACTIVE_COLOR};
      }
      span {
        color: ${PRIMARY_ACTIVE_COLOR};
        margin-right: 5px;
      }
    }
  }
`;

export default TopSectionSelector;
