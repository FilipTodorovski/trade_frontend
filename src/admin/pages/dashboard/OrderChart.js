import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import moment from 'moment';
import { Bar } from 'react-chartjs-2';
import { Card, DropdownButton, Dropdown } from 'react-bootstrap';
import HtSpinner from '../../components/HtSpinner';
import {
  PRIMARY_ACTIVE_COLOR,
  ORDER_PAYMENT_METHOD,
  ORDER_TRANS_TYPE,
  PRIMARY_DARK_COLOR,
  SECOND_GREY_COLOR,
  PRIMARY_ACTIVE_BACK_COLOR,
} from 'constants/constants';

const ALL_PAYMENT_TYPES = 'All Payment Types';
const ALL_DELIVERY_TYPES = 'All Delivery Types';
const TRANS_TYPE_OPTIONS = [
  { id: ALL_DELIVERY_TYPES, label: ALL_DELIVERY_TYPES },
  { id: ORDER_TRANS_TYPE.DELIVERY, label: 'Delivery' },
  { id: ORDER_TRANS_TYPE.COLLECTION, label: 'Collection' },
];

const OrderChart = ({ propOrderList, dateRange, loading }) => {
  const [paymentType, setPaymentType] = useState(ALL_PAYMENT_TYPES);
  const [deliveryType, setDeliveryType] = useState(ALL_DELIVERY_TYPES);

  const getBackgroundColors = () => {
    const diffDays = dateRange.endDate.diff(dateRange.startDate, 'days') + 1;
    const backgroundColors = [];
    for (let i = 0; i < diffDays; i++) {
      if (i % 2 === 0) backgroundColors.push(PRIMARY_ACTIVE_COLOR);
      else backgroundColors.push('rgba(116, 51, 255, 0.8)');
    }
    return backgroundColors;
  };

  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [
      {
        label: '',
        backgroundColor: getBackgroundColors(),
        fill: true,
        borderColor: PRIMARY_ACTIVE_COLOR,
        data: [],
        datalabels: {
          color: '#000',
          anchor: 'end',
          align: 'end',
          font: {
            size: 12,
            weight: 'bold',
          },
          display(context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    ],
  });

  const buildGraphData = (orderList) => {
    const labels = [];
    const startValue = dateRange.startDate.valueOf();
    const endValue = dateRange.endDate.valueOf();

    for (let i = startValue; i <= endValue; i += 24 * 60 * 60 * 1000) {
      labels.push(moment(i).format('YYYY-MM-DD'));
    }

    const dataSets = [];
    labels.forEach((item) => {
      const filterOne = orderList.filter((itemOrder) => {
        const startDate = moment(item).valueOf();
        const endDate = moment(item).endOf('day').valueOf();
        const deliveryTimne = moment(itemOrder.delivery_time).valueOf();
        if (startDate <= deliveryTimne && deliveryTimne <= endDate) {
          if (
            paymentType !== ALL_PAYMENT_TYPES &&
            paymentType !== itemOrder.payment_method
          ) {
            return false;
          }
          if (
            deliveryType !== ALL_DELIVERY_TYPES &&
            deliveryType !== itemOrder.trans_type
          )
            return false;
          return true;
        }
        return false;
      });
      dataSets.push(filterOne.length);
    });

    setGraphData({
      ...graphData,
      datasets: [
        {
          ...graphData.datasets[0],
          backgroundColor: getBackgroundColors(),
          data: [...dataSets],
        },
      ],
      labels: [...labels],
    });
  };

  useEffect(() => {
    buildGraphData(propOrderList);
  }, [propOrderList, dateRange, paymentType, deliveryType]); // eslint-disable-line

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          maxBarThickness: 45,
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            borderDash: [10, 10],
            borderDashOffset: 5,
            color: 'rgba(0, 0, 0, 0.1)',
            lineWidth: 1,
            drawBorder: false,
            zeroLineWidth: 1,
            zeroLineColor: 'rgb(0,0,0)',
          },
          ticks: {
            display: false,
            max:
              Math.max(...graphData.datasets[0].data) +
              Math.max(...graphData.datasets[0].data) / 4,
            min: 0,
          },
        },
      ],
    },
  };

  const checkDataExist = () => {
    const filterOne = propOrderList.filter((item) => {
      if (
        paymentType !== ALL_PAYMENT_TYPES &&
        paymentType !== item.payment_method
      ) {
        return false;
      }
      if (
        deliveryType !== ALL_DELIVERY_TYPES &&
        deliveryType !== item.trans_type
      )
        return false;
      return true;
    });
    if (!loading && filterOne.length === 0) return false;
    return true;
  };

  return (
    <ComponentCard>
      <CardHeader>
        <h3 className="title">Orders</h3>
        <OrderControlDropDown
          className="dropdown-payment-types"
          id="dropdown-payment-types"
          title={paymentType}
        >
          {[
            ALL_PAYMENT_TYPES,
            ORDER_PAYMENT_METHOD.CARD,
            ORDER_PAYMENT_METHOD.CASH,
          ].map((item) => {
            return (
              <Dropdown.Item
                key={item}
                onClick={() => setPaymentType(item)}
                active={paymentType === item}
              >
                {item}
              </Dropdown.Item>
            );
          })}
        </OrderControlDropDown>
        <OrderControlDropDown
          className="dropdown-delivery-types"
          id="dropdown-delivery-types"
          title={
            TRANS_TYPE_OPTIONS.find((item) => item.id === deliveryType).label
          }
        >
          {TRANS_TYPE_OPTIONS.map((item) => {
            return (
              <Dropdown.Item
                key={item.id}
                onClick={() => {
                  setDeliveryType(item.id);
                }}
                active={deliveryType === item.id}
              >
                {item.label}
              </Dropdown.Item>
            );
          })}
        </OrderControlDropDown>
      </CardHeader>
      <div id="bar-chart">
        {checkDataExist() ? (
          <Bar data={graphData} options={options} height={345} />
        ) : (
          <p className="empty-content">
            No relevant data for selected time period
          </p>
        )}
      </div>
      {loading && <HtSpinner />}
    </ComponentCard>
  );
};

const ComponentCard = styled(Card)`
  width: 100%;
  height: 439px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 19px 31px 0 31px;
  margin: 56px 0 0 0;
  position: relative;
  .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
  }
  .empty-content {
    text-align: center;
    margin: 100px 0 0 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: cneter;
  height: 75px;
`;

const OrderControlDropDown = styled(DropdownButton)`
  width: 172px;

  &.dropdown-payment-types {
    margin-left: auto;
  }
  &.dropdown-delivery-types {
    margin-left: 20px;
  }

  .dropdown-toggle {
    width: 100%;
    background-color: #fff !important;
    border: 1.5px solid #272848 !important;
    box-sizing: border-box;
    border-radius: 12px;
    color: ${PRIMARY_DARK_COLOR} !important;
    font-size: 14px;
    line-height: 17px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 7px 30px 7px 12px;

    &:after {
      border: 1px solid ${PRIMARY_DARK_COLOR};
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      margin-top: -4px;
      transform: rotate(45deg);
      -webkit-transform: rotate(45deg);
      position: absolute;
      right: 13px;
      top: 15px;
    }

    &:focus,
    &:active {
      box-shadow: 0 0 0 0.2rem ${PRIMARY_ACTIVE_BACK_COLOR} !important;
      color: ${SECOND_GREY_COLOR} !important;
      background-color: white !important;
      border-color: ${PRIMARY_ACTIVE_COLOR} !important;
      border-width: 2px !important;
    }
  }

  .dropdown-menu {
    max-height: 241px;
    overflow-y: auto;
  }

  .dropdown-menu.show {
    min-width: 100%;
    background: white;
    border-radius: 12px;
  }

  .dropdown-item {
    color: ${SECOND_GREY_COLOR};
    margin: 5px 0;
  }

  .dropdown-item.active {
    color: white;
    background-color: ${PRIMARY_ACTIVE_COLOR} !important;
  }
  .dropdown-item:active {
    background-color: rgba(241, 246, 255, 1) !important;
  }
`;

export default OrderChart;
