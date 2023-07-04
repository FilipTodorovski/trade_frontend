import React, { useState } from 'react';

import styled from 'styled-components';
import { Button, Modal } from 'react-bootstrap';
import CheckBox from 'sharedComponents/CheckBox';
import HtSpinner from '../../../../components/HtSpinner';
import ApiService from 'admin/ApiService';
import { RunToast } from 'utils/toast';
import { getOrderedProductPrice, getOrderListTotalPrice } from 'utils/order';
import {
  PRIMARY_DARK_COLOR,
  getToken,
  ORDER_STATUS,
} from 'constants/constants';

const RefundOrderModal = ({ onHide, orderInfo, updateRefundOrder }) => {
  const [loading, setLoading] = useState(false);
  const [refundProduct, setRefundProduct] = useState([
    ...orderInfo.items.map((item) => {
      return {
        ...item,
        checked: false,
        amount: getOrderedProductPrice(item),
      };
    }),
  ]);

  const orderTotalPrice = getOrderListTotalPrice(null, orderInfo.items);

  const getRefundedTotalAmount = () => {
    let totalSelect = true;
    refundProduct.forEach((item) => {
      if (totalSelect) totalSelect = item.checked;
    });

    if (totalSelect)
      return (
        refundProduct.reduce((total, obj) => obj.amount + total, 0) +
        orderInfo.delivery_fee
      );

    return refundProduct
      .filter((item) => item.checked)
      .reduce((total, obj) => obj.amount + total, 0);
  };

  const handleClickRefund = () => {
    setLoading(true);

    const refundData = JSON.stringify({
      items: refundProduct
        .filter((item) => item.checked)
        .map((item) => {
          const tempItem = { ...item };
          delete tempItem.checked;
          return tempItem;
        }),
      amount: getRefundedTotalAmount(),
    });

    ApiService({
      method: 'PUT',
      url: `/order/refund/${orderInfo.id}`,
      data: { refund_data: refundData },
      ...getToken(),
    })
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          RunToast('success', `Order ${orderInfo.order_number} refunded.`);
          updateRefundOrder({
            ...orderInfo,
            refund_data: refundData,
            status: ORDER_STATUS.REFUNDED,
          });
          onHide();
        } else {
          RunToast('error', `Order ${orderInfo.order_number} refund failed.`);
        }
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', `Order ${orderInfo.order_number} refund failed.`);
      });
  };

  return (
    <StyledModal
      show
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="order-delivery-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Refund Order {orderInfo.order_number}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="check-description">
          Check the itmes you would like to refund
        </h5>
        <ProductList>
          {refundProduct.map((item) => {
            return (
              <CheckBox
                name={`${item.name} (£${item.amount ? Number(item.amount).toFixed(2) : 0})`}
                checked={
                  refundProduct.find((itemOne) => itemOne.id === item.id)
                    .checked
                }
                onChange={(newValue) => {
                  setRefundProduct([
                    ...refundProduct.map((itemOne) => {
                      if (itemOne.id === item.id)
                        return {
                          ...itemOne,
                          checked: !itemOne.checked,
                        };
                      return itemOne;
                    }),
                  ]);
                }}
                key={item.id}
              />
            );
          })}
        </ProductList>
        <h5 className="totals">
          Sub Total{' '}
          <span style={{ marginLeft: 'auto' }}>
            £{orderTotalPrice ? Number(orderTotalPrice).toFixed(2) : 0}
          </span>
        </h5>
        <h5 className="totals">
          Delivery Fee{' '}
          <span style={{ marginLeft: 'auto' }}>
            £{Number(orderInfo.delivery_fee).toFixed(2)}
          </span>
        </h5>
        <h5 className="totals">
          Total{' '}
          <span style={{ marginLeft: 'auto' }}>
            £
            {orderTotalPrice ? Number(
              orderTotalPrice +
                orderInfo.delivery_fee
            ).toFixed(2) : 0}
          </span>
        </h5>
      </Modal.Body>
      <Modal.Footer>
        <h5>
          Total being Refunded{' '}
          <span style={{ marginLeft: 'auto' }}>
            £{getRefundedTotalAmount() ? Number(getRefundedTotalAmount()).toFixed(2) : 0}
          </span>
        </h5>
        <Button
          variant="primary"
          className="ht-btn-primary"
          onClick={handleClickRefund}
          disabled={!(getRefundedTotalAmount() >= 0)}
        >
          Refund
        </Button>
      </Modal.Footer>
      {loading && <HtSpinner />}
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .modal-dialog {
    max-width: 100%;
  }
  .modal-content {
    position: relative;
    margin-left: auto;
    margin-right: auto;
  }
  .check-description {
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    text-align: center;
    color: ${PRIMARY_DARK_COLOR};
    margin: 10px 0 0 0;
  }
  .totals {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    color: #272848;
    width: 100%;
    max-width: 272px;
    display: flex;
  }
  .modal-footer {
    flex-direction: column;
    h5 {
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      text-align: center;
      color: #272848;
      margin: 0 0 25px 0;
      display: flex;
      max-width: 272px;
      width: 100%;
    }
  }
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px auto 24px;
  width: 100%;
  max-width: 272px;

  .form-label {
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    text-align: left;
    color: #272848;
  }

  h5 {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    color: #272848;
  }
`;

export default RefundOrderModal;
