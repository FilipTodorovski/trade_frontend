import React, { useState, useEffect } from 'react';

import styled from 'styled-components';
import { Card } from 'react-bootstrap';
import { Doughnut } from 'react-chartjs-2';
import HtSpinner from '../../components/HtSpinner';

import { ORDER_PAYMENT_METHOD, ORDER_TRANS_TYPE } from 'constants/constants';

const REVENUE_TYPES = [
  {
    payment_method: ORDER_PAYMENT_METHOD.CASH,
    trans_type: ORDER_TRANS_TYPE.DELIVERY,
  },
  {
    payment_method: ORDER_PAYMENT_METHOD.CARD,
    trans_type: ORDER_TRANS_TYPE.DELIVERY,
  },
  {
    payment_method: ORDER_PAYMENT_METHOD.CASH,
    trans_type: ORDER_TRANS_TYPE.COLLECTION,
  },
  {
    payment_method: ORDER_PAYMENT_METHOD.CARD,
    trans_type: ORDER_TRANS_TYPE.COLLECTION,
  },
];

const RevenueType = ({ orderList, loading }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
  };

  const [graphData, setGraphData] = useState({
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: [
          '#213f5e',
          'rgba(138, 83, 255, 0.8)',
          '#0066B2',
          '#028FF8',
        ],
      },
    ],

    // These labels appear in the legend and in the tooltips when hovering different arcs
    labels: [
      'Cash Delivery',
      'Card Delivery',
      'Cash Collection',
      'Card Collection',
    ],
  });

  useEffect(() => {
    const revenues = REVENUE_TYPES.map((item) => {
      const filterOne = orderList.filter((itemOrder) => {
        if (
          itemOrder.payment_method === item.payment_method &&
          itemOrder.trans_type === item.trans_type
        )
          return true;
        return false;
      });
      let totalPrice = 0;
      filterOne.forEach((itemOrder) => {
        totalPrice += itemOrder.amount;
      });
      return totalPrice;
    });
    setGraphData({
      ...graphData,
      datasets: [
        {
          ...graphData.datasets[0],
          data: [...revenues],
        },
      ],
    });
  }, [orderList]); // eslint-disable-line

  return (
    <ComponentCard>
      <CardHeader>Revenue by type</CardHeader>
      <CardBody>
        {!loading && orderList.length > 0 ? (
          <ChartContainer>
            <ChartDiv>
              <Doughnut
                data={graphData}
                options={options}
                width={180}
                height={180}
              />
              <TotalPriceDiv>
                <b>
                  £
                  {Number(
                    graphData.datasets[0].data.reduce((a, b) => a + b, 0)
                  ).toFixed(2)}
                </b>
                <span style={{ fontSize: '14px' }}>Total</span>
              </TotalPriceDiv>
            </ChartDiv>
            <LegendDiv>
              <div className="item-line">
                <span
                  className="rect"
                  style={{ backgroundColor: '#213f5e' }}
                ></span>
                Cash Delivery
                <span className="value">
                  £{Number(graphData.datasets[0].data[0]).toFixed(2)}
                </span>
              </div>
              <div className="item-line">
                <span
                  className="rect"
                  style={{ backgroundColor: 'rgba(138, 83, 255, 0.8)' }}
                ></span>
                Card Delivery
                <span className="value">
                  £{Number(graphData.datasets[0].data[1]).toFixed(2)}
                </span>
              </div>
              <div className="item-line">
                <span
                  className="rect"
                  style={{ backgroundColor: '#0066B2' }}
                ></span>
                Cash Collection
                <span className="value">
                  £{Number(graphData.datasets[0].data[2]).toFixed(2)}
                </span>
              </div>
              <div className="item-line">
                <span
                  className="rect"
                  style={{ backgroundColor: '#028FF8' }}
                ></span>
                Card Collection
                <span className="value">
                  £{Number(graphData.datasets[0].data[3]).toFixed(2)}
                </span>
              </div>
            </LegendDiv>
          </ChartContainer>
        ) : (
          <p className="empty-content">
            No relevant data for selected time period
          </p>
        )}
      </CardBody>
      {loading && <HtSpinner />}
    </ComponentCard>
  );
};

const ComponentCard = styled(Card)`
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  flex: 1 1 100%;
  margin-left: 22.5px;
  max-height: 295px;
  position: relative;
  .empty-content {
    width: 100%;
    text-align: center;
    margin: 90px 0 0 0;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  line-height: 22px;
  height: 82px;
  padding: 0 48px;
  border-bottom: 1px solid rgba(39,40,72,0.2);
`;

const CardBody = styled.div`
  display: flex;
  padding-bottom: 30px;
`;

const ChartContainer = styled.div`
  display: flex;
  padding: 0 50px;
  width: 100%;
`;

const ChartDiv = styled.div`
  flex: 0 0 180px;
  height: 180px;
  position: relative;
`;

const TotalPriceDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 40px;
  font-size: 18px;
  line-height: 22px;
`;

const LegendDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  flex: 1 1 100%;
  margin-left: 40px;
  .item-line {
    align-items: center;
    display: flex;
    .rect {
      display: block;
      width: 18px;
      height: 14px;
      margin-right: 11px;
    }
    .price-item {
      font-size: 14px;
      line-height: 17px;
    }
    .value {
      font-weight: bold;
      margin-left: auto;
    }
  }
`;

export default RevenueType;
