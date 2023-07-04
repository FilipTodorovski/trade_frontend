import React, { useState, useRef, useEffect } from 'react';

import styled from 'styled-components';
import moment from 'moment';
import { Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';

import TimeCount from '../TimeCount';
import OrderDeliveryModal from '../OrderDeliveryModal';
import RefundOrderModal from '../RefundOrderModal';
import ComponentToPrint, { printOrder, renderAddress } from 'utils/print';

import {
  ORDER_STATUS,
  BORDER_GREY_COLOR,
  SECOND_GREY_COLOR,
  PRIMARY_DARK_COLOR,
  ORDER_TAB_TITLE,
  ORDER_TRANS_TYPE,
  BACKGROUND_GREY_COLOR,
} from 'constants/constants';
import PrintSvg from 'assets/images/icon_device_printer.svg';
import DeliverySvg from 'assets/images/deliveryicon.svg';
import PickupSvg from 'assets/images/pickupperson.svg';

import { getOrderListTotalPrice, renderGroupOrderItems } from 'utils/order';

const OrderCard = ({
  curSection,
  orderInfo,
  storeList = [],
  acceptOrder,
  rejectOrder,
  readyOrder,
  deliverPickOrder,
  completeOrder,
  refundOrder,
}) => {
  const componentRef = useRef();
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [store, setStore] = useState();

  useEffect(() => {
    const find = storeList.find((store) => store.id === orderInfo.store_id);
    setStore(find);
  }, [storeList, orderInfo]);

  const updateDeliverTime = (newDeliveryDate) => {
    setShowDeliveryModal(false);
    acceptOrder({
      ...orderInfo,
      delivery_time: new Date(newDeliveryDate.valueOf()),
    });
    handlePrint();
  };

  // const handleClickPrintButton = () => {
  //   printOrder(orderInfo);
  // };

  const renderProductAllGroupItems = (groups) => {
    const groupsStr = [];

    groups.forEach((itemGroup) => {
      groupsStr.push(renderGroupOrderItems(itemGroup.items));
    });

    return groupsStr.join(', ');
  };

  return (
    <OrderCardContainer>
      <div className="order-card-hearder d-flex flex-grow-1">
        <div className="order-info d-flex flex-column mx-3 flex-grow-1">
          <h4>Order Number</h4>
          <span>{orderInfo.order_number}</span>
        </div>
        {curSection === ORDER_TAB_TITLE.COMPLETED && (
          <div className="order-info d-flex flex-column mx-3 flex-grow-1">
            <h4>Date & Time</h4>
            <span>
              {moment(orderInfo.delivery_time).format('Do MMMM YYYY')}
              <br />
              {`at ${moment(orderInfo.delivery_time).format('H:mm')}`}
            </span>
          </div>
        )}

        <div className="order-info d-flex flex-column mx-3 flex-grow-1">
          <h4>Customer Address</h4>
          <span>
            {renderAddress(orderInfo.address)}, {orderInfo.postcode}
          </span>
        </div>
        <div className="order-info d-flex flex-column mx-3 flex-grow-1">
          <h4>Contact</h4>
          <span>{orderInfo.phone_number}</span>
        </div>
        <div className="order-info d-flex flex-column mx-3 flex-grow-1">
          <h4>Name</h4>
          <span>{`${orderInfo.first_name} ${orderInfo.last_name}`}</span>
        </div>
        <div className="order-info d-flex flex-column mx-3 flex-grow-1">
          <h4>Delivery Type</h4>
          {orderInfo.trans_type === ORDER_TRANS_TYPE.DELIVERY && (
            <TransTypeImg src={DeliverySvg} />
          )}
          {orderInfo.trans_type === ORDER_TRANS_TYPE.COLLECTION && (
            <TransTypeImg src={PickupSvg} />
          )}
        </div>
        <div className="order-info d-flex flex-column mx-3 flex-grow-1">
          <h4>Amount</h4>
          <span>
            £{Number(orderInfo.amount).toFixed(2)}
            <PaymentMethodBadge>{orderInfo.payment_method}</PaymentMethodBadge>
          </span>
        </div>
        {curSection === ORDER_TAB_TITLE.NEW && (
          <div className="order-info d-flex flex-column mx-3 flex-grow-1">
            <h4>Date & Time</h4>
            <span>
              {moment(orderInfo.delivery_time).format('Do MMMM YYYY')}
              <br />
              {`at ${moment(orderInfo.delivery_time).format('H:mm')}`}
            </span>
          </div>
        )}
        {(curSection === ORDER_TAB_TITLE.PREPARING ||
          curSection === ORDER_TAB_TITLE.READY) && (
          <TimeCount
            deliveryTime={orderInfo.delivery_time}
            requestTime={orderInfo.request_time}
          />
        )}
      </div>
      <div className="order-card-bottom d-flex flex-grow-1 flex-column">
        <div className="ordered-items d-flex justify-content-start align-items-center">
          <h4 className="m-0">Ordered Items</h4>
          {orderInfo.items.map((productItem) => {
            if(productItem.qty){
              return (
                <span className="item-span" key={productItem.id}>
                  <font style={{ fontWeight: 500 }}>
                    {productItem.name} x {productItem.qty}
                  </font>
                  {renderProductAllGroupItems(productItem.groups)}
                </span>
              );
            }
          })}
        </div>
        <div className="bottom-wrapper mt-4 d-flex justify-content-between">
          <div className="additional-info">
            <h4>Additional Information from the customer</h4>
            <span>{orderInfo.customer_request}</span>
          </div>
          <div style={{ display: 'none' }}>
            <ComponentToPrint
              orderInfo={orderInfo}
              storeName={store?.name}
              ref={componentRef}
            />
          </div>

          {curSection === ORDER_TAB_TITLE.NEW && (
            <div className="button-wrapper">
              <Button
                className="ht-btn-outline-red"
                onClick={() => rejectOrder(orderInfo)}
              >
                Reject Order
              </Button>
              <Button
                className="ht-btn-primary ml-4"
                onClick={() => setShowDeliveryModal(true)}
              >
                Accept
              </Button>
            </div>
          )}

          {curSection === ORDER_TAB_TITLE.PREPARING && (
            <div className="button-wrapper">
              <PrintButton src={PrintSvg} className="" onClick={handlePrint} />
              <Button
                className="ht-btn-primary ml-4"
                onClick={() => readyOrder(orderInfo)}
                // disabled={getDeliverDiff() < 0}
              >
                Order Ready
              </Button>
            </div>
          )}
          {curSection === ORDER_TAB_TITLE.READY && (
            <div className="button-wrapper">
              {orderInfo.trans_type === ORDER_TRANS_TYPE.DELIVERY && (
                <Button
                  className="ht-btn-primary"
                  onClick={() => deliverPickOrder(orderInfo)}
                >
                  Out for Delivery
                </Button>
              )}
              {orderInfo.trans_type === ORDER_TRANS_TYPE.COLLECTION && (
                <Button
                  className="ht-btn-primary"
                  onClick={() => deliverPickOrder(orderInfo)}
                >
                  Ready for Collection
                </Button>
              )}
            </div>
          )}
          {curSection === ORDER_TAB_TITLE.DELIVERY_PICKUP && (
            <div className="button-wrapper">
              <Button
                className="ht-btn-primary"
                onClick={() => {
                  completeOrder(orderInfo);
                }}
              >
                Order Completed
              </Button>
            </div>
          )}
          {curSection === ORDER_TAB_TITLE.COMPLETED &&
            orderInfo.status !== ORDER_STATUS.REFUNDED && (
              <div className="button-wrapper">
                <Button
                  variant="outline-secondary"
                  className="ht-btn-outline-grey"
                  onClick={() => {
                    setShowRefundModal(true);
                  }}
                >
                  Refund Order
                </Button>
              </div>
            )}
        </div>
      </div>
      {showDeliveryModal && (
        <OrderDeliveryModal
          isShow={showDeliveryModal}
          onHide={() => setShowDeliveryModal(false)}
          requestDate={orderInfo.request_time}
          updateDate={updateDeliverTime}
        />
      )}
      {showRefundModal && (
        <RefundOrderModal
          onHide={() => {
            setShowRefundModal(false);
          }}
          orderInfo={orderInfo}
          updateRefundOrder={refundOrder}
        />
      )}
    </OrderCardContainer>
  );
};

const OrderCardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border: 1px solid ${BORDER_GREY_COLOR};
  padding: 15px;
  border-radius: 12px;
  margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
  .order-card-hearder {
    padding-bottom: 20px;
    border-bottom: 1px solid ${BORDER_GREY_COLOR};
  }

  .order-info,
  .ordered-items,
  .additional-info {
    h4 {
      font-size: 1rem;
      color: ${SECOND_GREY_COLOR};
    }

    span {
      color: ${PRIMARY_DARK_COLOR};
      font-weight: bold;
    }
  }

  .order-card-bottom {
    padding-top: 20px;

    .ht-btn-primary,
    .ht-btn-outline-red {
      padding: 12px 24px;
    }

    .ordered-items {
      h4 {
        width: 90px;
      }

      .item-span {
        display: flex;
        flex-direction: column;
        background: ${BACKGROUND_GREY_COLOR};
        padding: 5px 10px;
        margin-right: 10px;
        border-radius: 8px;
        font-weight: normal;
        .group-item {
          font-size: 12px;
          color: #6c757d;
          margin: 0;
        }
      }
    }
  }
`;

const TransTypeImg = styled.img`
  align-self: flex-start;
  margin-left: 40px;
  transform: translateX(-50%);
`;

const PaymentMethodBadge = styled.span`
  padding: 2px 5px;
  border-radius: 4px;
  background-color: #d7ffe2;
  margin-left: 5px;
`;

const PrintButton = styled.img`
  cursor: pointer;
`;
export default OrderCard;
