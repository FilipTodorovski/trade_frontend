import React from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { Card } from 'react-bootstrap';

import {
  getOrderListTotalPrice,
  getOrderedProductPrice,
  renderGroupOrderItems,
} from 'utils/order';

import * as CONSTANTS from 'constants/constants';

const OrderInfo = ({ deliveryFee }) => {
  const { storeInfo, orderList } = useSelector((state) => ({
    storeInfo: state.storeFrontReducer.store,
    orderList: state.storeFrontReducer.orderList,
  }));

  return (
    <ComponentContainer>
      <Card.Header>
        <h2>Your Order</h2>
      </Card.Header>
      <Card.Body>
        <div className="order-list">
          {orderList.map((item) => {
            return (
              <div className="d-flex flex-column" key={item.id}>
                <div className="d-flex product-item-row">
                  <div className="product-details">
                    <p className="product-name">
                      {`${item.qty}x ${item.name}`}
                    </p>
                    {item.groups.map((itemGroup) => {
                      return (
                        <div
                          className="group-item"
                          key={item.id + itemGroup.id}
                        >
                          <p className="group-title">{itemGroup.name}</p>
                          <p className="item-description">
                            {renderGroupOrderItems(itemGroup.items)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <span className="ml-auto" style={{ fontWeight: 600 }}>
                    £{Number(getOrderedProductPrice(item)).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {orderList.length > 0 && (
          <div className="subtotal-content">
            <div className="sub-total-text d-flex align-items-center">
              <strong>SUBTOTAL</strong>
              <span className="ml-auto">
                £
                {Number(getOrderListTotalPrice(storeInfo, orderList)).toFixed(
                  2
                )}
              </span>
            </div>
            <div className="sub-total-text d-flex align-items-center">
              Delivery FEE
              {deliveryFee >= 0 && (
                <span className="ml-auto">
                  £{Number(deliveryFee).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        )}
      </Card.Body>
      <Card.Footer>
        <div className="d-flex">
          <p className="mb-0 font-weight-bold">Total</p>
          <p className="ml-auto mb-0 font-weight-bold">
            £
            {Number(
              getOrderListTotalPrice(storeInfo, orderList) +
                (deliveryFee >= 0 ? deliveryFee : 0)
            ).toFixed(2)}
          </p>
        </div>
      </Card.Footer>
    </ComponentContainer>
  );
};

const ComponentContainer = styled(Card)`
  width: 100%;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  .card-header {
    background: #fff;
    border-radius: 12px 12px 0 0;
    padding: 19px 0;

    h2 {
      font-style: normal;
      font-weight: 600;
      font-size: 28px;
      line-height: 41px;
      text-align: center;
      margin: 0;
    }
  }

  .card-body {
    padding: 0;

    .delivery-type-selector {
      padding: 17px 0;
      border-bottom: 1px solid #e4e4e4;
      display: flex;
      justify-content: center;
    }

    .order-list {
      padding: 30px 35px 13px 36px;
      .product-item-row {
        margin-bottom: 13px;
        .product-details {
          display: flex;
          flex-direction: column;
          margin-right: 0.5rem;

          .product-name {
            font-size: 14px;
            font-weight: 600;
            font-stretch: normal;
            font-style: normal;
            letter-spacing: normal;
            color: ${CONSTANTS.PRIMARY_DARK_COLOR};
            line-height: 16px;
            margin: 0;
          }

          .group-item {
            display: flex;
            flex-direction: column;
            padding-left: 19px;

            .group-title {
              font-size: 13px;
              font-weight: 600;
              margin: 5px 0 0 0;
            }
          }

          .item-description {
            font-size: 13px;
            margin: 0;
            color: #6c757d;
            line-height: 16px;
          }
        }
      }
    }

    .subtotal-content {
      display: flex;
      flex-direction: column;
      border-top: 1px solid rgba(0, 0, 0, 0.125);
      padding: 22px 35px 10px 36px;

      .sub-total-text {
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 13px;
        letter-spacing: normal;
        color: ${CONSTANTS.PRIMARY_DARK_COLOR};
        margin-bottom: 15px;
      }
    }
  }

  .card-footer {
    background-color: white;
    padding: 17px 35px 17px 36px;
    border-radius: 0 0 12px 12px;
  }
`;

export default OrderInfo;
