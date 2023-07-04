import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';
import CustomOutlinedButton from 'sharedComponents/CustomOutlinedButton';
import { checkStoreOpenNow } from 'utils/menu';
import {
  getOrderedProductPrice,
  getOrderListTotalPrice,
  renderGroupOrderItems,
} from 'utils/order';
import { getDeliveryFee } from 'utils/store';
import {
  UPDATE_PRODUCT_TO_CART,
  UPDAGTE_DELIVERY_INFO,
} from '../../../../../actions/actionTypes';
import { PRIMARY_ACTIVE_COLOR, PRIMARY_DARK_COLOR } from 'constants/constants';

const Checkout = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const mainRef = useRef(null);

  const { orderList, storeInfo, deliveryInfo } = useSelector((state) => ({
    orderList: state.storeFrontReducer.orderList,
    storeInfo: state.storeFrontReducer.store,
    deliveryInfo: state.storeFrontReducer.deliveryData,
  }));

  const [minAmountError, setMinAmountError] = useState({
    isShow: false,
    diffAmount: 0,
  });

  const [deliveryOption, setDeliveryOption] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(-1);
  const handleScroll = () => {
    const rootElement = document.body.clientWidth;

    if (rootElement <= 991) {
      const checkoutCard = document.getElementById('checkout-card');
      if (checkoutCard) {
        document.getElementById('checkout-card').style.position = 'relative';
        document.getElementById('checkout-card').style.marginTop = '2rem';
      }
      return;
    }

    const scrollTop = window.scrollY;
    if (scrollTop >= 175) {
      document.getElementById('checkout-card').style.width = `${
        document
          .getElementById('checkout-card')
          .parentElement.getBoundingClientRect().width - 30
      }px`;

      const cardBodyHeight = document
        .getElementById('checkout-card')
        .getBoundingClientRect().height;
      const storeBody = document.getElementById('store-body');
      const storeBodyEndY =
        storeBody.offsetTop + storeBody.getBoundingClientRect().height;

      if (window.scrollY + cardBodyHeight + 100 >= storeBodyEndY) {
        document.getElementById('checkout-card').style.position = 'absolute';
        document.getElementById('checkout-card').style.top = 'auto';
        document.getElementById('checkout-card').style.bottom = '0';
        return;
      }

      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 45
      ) {
        document.getElementById('checkout-card').style.position = 'absolute';
        document.getElementById('checkout-card').style.top = 'auto';
        document.getElementById('checkout-card').style.bottom = '0';
      } else {
        document.getElementById('checkout-card').style.position = 'fixed';
        document.getElementById('checkout-card').style.top = '54px';
        document.getElementById('checkout-card').style.bottom = 'auto';
      }
    } else {
      document.getElementById('checkout-card').style.position = 'relative';
      document.getElementById('checkout-card').style.top = '0';
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setDeliveryOption(deliveryInfo.type);
  }, [deliveryInfo]);

  useEffect(() => {
    const getDeliveryFeeValue = async () => {
      const deliveryFeeValue = await getDeliveryFee(
        storeInfo,
        deliveryInfo.postcode
      );
      setDeliveryFee(deliveryFeeValue);
    };
    if (deliveryInfo.postcode.length > 0 && Object.keys(storeInfo).length > 0)
      getDeliveryFeeValue();
  }, [storeInfo, deliveryInfo.postcode]);

  useEffect(() => {
    const totalPrice = Number(
      getOrderListTotalPrice(storeInfo, orderList)
    ).toFixed(2);

    if (
      orderList.length !== 0 &&
      totalPrice < storeInfo.minimum_delivery_amount
    ) {
      setMinAmountError({
        isShow: true,
        diffAmount: storeInfo.minimum_delivery_amount - totalPrice,
      });
    } else {
      setMinAmountError({
        ...minAmountError,
        isShow: false,
      });
    }
  }, [storeInfo, orderList]); // eslint-disable-line

  const handleDeliveryOptionChange = (val) => {
    dispatch({
      type: UPDAGTE_DELIVERY_INFO,
      payload: {
        ...deliveryInfo,
        type: val,
      },
    });
  };

  return (
    <div
      id="checkout-card"
      className="d-flex flex-column justify-content-center align-items-center"
    >
      <CheckoutCard ref={mainRef}>
        <Card.Header>
          <h2>Your Order</h2>
        </Card.Header>
        <Card.Body>
          <div className="delivery-type-selector">
            <label className="delivery-option">
              <input
                type="radio"
                name="radio"
                onChange={() => handleDeliveryOptionChange(1)}
                checked={deliveryOption === 1}
              />
              <span className="checkmark"></span>
              <div>
                <h4>Delivery</h4>
                <span>{storeInfo?.delivery_prep_time} mins</span>
              </div>
            </label>
            <label className="delivery-option">
              <input
                type="radio"
                name="radio"
                onChange={() => handleDeliveryOptionChange(2)}
                checked={deliveryOption === 2}
              />
              <span className="checkmark"></span>
              <div>
                <h4>Collection</h4>
                <span>{storeInfo?.pickup_prep_time} mins</span>
              </div>
            </label>
          </div>
          <div className="order-list">
            {minAmountError.isShow && (
              <MinAmountErrorMsg>
                You need to spend
                <b> £{Number(minAmountError.diffAmount).toFixed(2)}</b> more for
                delivery
              </MinAmountErrorMsg>
            )}

            {orderList.map((item) => {
              return (
                <div className="d-flex flex-column" key={item.id}>
                  <div className="d-flex mt-3">
                    <div className="d-flex">
                      <CustomOutlinedButton
                        styles={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '5px',
                          fontSize: 24,
                        }}
                        onClick={() => {
                          dispatch({
                            type: UPDATE_PRODUCT_TO_CART,
                            payload: {
                              ...item,
                              qty: item.qty - 1,
                            },
                          });
                        }}
                      >
                        -
                      </CustomOutlinedButton>
                      <CountCart>{item.qty}</CountCart>
                      <CustomOutlinedButton
                        styles={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '5px',
                          fontSize: 24,
                        }}
                        onClick={() => {
                          dispatch({
                            type: UPDATE_PRODUCT_TO_CART,
                            payload: {
                              ...item,
                              qty: item.qty + 1,
                            },
                          });
                        }}
                      >
                        +
                      </CustomOutlinedButton>
                    </div>
                    <CheckoutProductName className="ml-2">
                      <p className="product-name">{item.name}</p>
                      {item.groups.map((itemGroup) => {
                        return (
                          <div
                            className="group-item"
                            key={item.id + itemGroup.id}
                          >
                            <p className="group-title">{itemGroup.name}</p>
                            {itemGroup.items && itemGroup.items.length > 0 && (
                              <p className="item-description">
                                {renderGroupOrderItems(itemGroup.items)}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </CheckoutProductName>
                    <ProductPrice>
                      £{Number(getOrderedProductPrice(item)).toFixed(2)}
                    </ProductPrice>
                  </div>
                </div>
              );
            })}

            {orderList.length === 0 && (
              <div className="d-flex justify-content-center align-items-center text-center">
                There are no items currently in your basket, add an item to
                order.{' '}
              </div>
            )}
          </div>

          {orderList.length > 0 && (
            <SubTotalContent>
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
            </SubTotalContent>
          )}
        </Card.Body>
        {orderList.length > 0 && (
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
        )}
      </CheckoutCard>
      <CheckoutBtn
        className={`mt-3 checkout-btn ${
          orderList.length === 0 ? 'bg-secondary' : 'ht-btn-primary'
        } border-0`}
        disabled={
          orderList.length === 0 ||
          !checkStoreOpenNow(storeInfo) ||
          minAmountError.isShow
        }
        style={{ cursor: `${orderList.length === 0 ? 'none' : 'pointer'}` }}
        onClick={() => {
          history.push('/checkout/pay');
        }}
      >
        Checkout
      </CheckoutBtn>
    </div>
  );
};

export default Checkout;

const CheckoutCard = styled(Card)`
  margin-top: -53px;
  z-index: 2;
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
      padding: 10px 35px 20px 36px;
    }
  }

  .card-footer {
    background-color: white;
    padding: 17px 35px 17px 36px;
    border-radius: 0 0 12px 12px;
  }

  .delivery-option {
    display: block;
    position: relative;
    padding-left: 25px;
    margin-right: 24px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;

    h4 {
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 22px;
      margin: 0;
    }
  }

  /* Hide the browser's default radio button */
  .delivery-option input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  /* Create a custom radio button */
  .checkmark {
    position: absolute;
    top: 2px;
    left: 0;
    height: 18px;
    width: 18px;
    border-radius: 50%;
    border: 2px solid rgba(0, 0, 0, 0.2);
  }

  /* When the radio button is checked, add a blue background */
  .delivery-option input:checked ~ .checkmark {
    background-color: ${PRIMARY_ACTIVE_COLOR};
  }

  /* Create the indicator (the dot/circle - hidden when not checked) */
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
    align-items: center;
    justify-content: center;
  }

  /* Show the indicator (dot/circle) when checked */
  .delivery-option input:checked ~ .checkmark:after {
    display: flex;
  }

  /* Style the indicator (dot/circle) */
  .delivery-option .checkmark:after {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: white;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }
`;

const CountCart = styled.p`
  margin: 0;
  width: 30px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

const CheckoutBtn = styled(Button)`
  align-items: center;
  padding: 26px;
  justify-content: center;
  display: flex;
  border-radius: 12px !important;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  width: 80%;

  &:disabled {
    background-color: grey !important;
    pointer-events: none;
    cursor: none;
  }
`;

const CheckoutProductName = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0.5rem 0 1rem;

  .product-name {
    font-size: 14px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: ${PRIMARY_DARK_COLOR};
    line-height: 21px;
    margin: 0;
  }

  .group-item {
    display: flex;
    flex-direction: column;
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
`;

const ProductPrice = styled.p`
  margin: 0 0 0 auto;
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  letter-spacing: normal;
  color: ${PRIMARY_DARK_COLOR};
  line-height: 21px;
`;

const MinAmountErrorMsg = styled.div`
  color: #213f5e;
  background-color: rgba(241, 246, 255, 1);
  text-align: center;
  padding: 5px 15px;
  border-radius: 8px;
  font-size: 12px;
`;

const SubTotalContent = styled.div`
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
    color: ${PRIMARY_DARK_COLOR};
    margin-bottom: 15px;
  }
`;
