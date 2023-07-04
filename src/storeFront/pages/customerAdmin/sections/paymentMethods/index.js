import React, { useState, useEffect } from 'react';

import get from 'lodash/get';
import styled from 'styled-components';
import { Button, Row, Col } from 'react-bootstrap';

import { PRIMARY_DARK_COLOR, PRIMARY_ACTIVE_COLOR } from 'constants/constants';
import HtSpinner from 'admin/components/HtSpinner';
import { RunToast } from 'utils/toast';
import CheckIconPurple from 'assets/images/checked-icon-purple.svg';

import { twoNumberString } from 'utils/string';
import {
  getPaymentsTokenApi,
  getSelectedPaymentIdApi,
  selectPaymentTokenApi,
  removePaymentmethodApi,
} from 'Apis/CustomerApis';

const PaymentMethodSection = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState({});
  const [paymentList, setPaymentList] = useState([]);

  useEffect(() => {
    let unmounted = false;
    const getData = async () => {
      try {
        const resList = await getPaymentsTokenApi();
        if (!unmounted) {
          setPaymentList([...resList.data.cards]);
        }

        const resSelected = await getSelectedPaymentIdApi();
        if (!unmounted) {
          setSelectedPayment(resSelected.data.selectedData);
        }
      } catch (err) {
        console.log(err);
      }
      if (!unmounted) {
        setLoading(false);
      }
    };

    getData();
    return () => {
      unmounted = true;
    };
  }, []);

  const getExpireDate = (cardInfo) => {
    return `${twoNumberString(
      parseInt(cardInfo.expiryMonth)
    )}/${cardInfo.expiryYear.substr(2, 2)}`;
  };

  const checkSelectedPayment = (paymentId) => {
    const customerCartId = get(selectedPayment, 'customer_cart_id', -1);
    if (customerCartId === paymentId) return true;
    return false;
  };

  const selectPaymentToken = (paymentTokenId) => {
    if (checkSelectedPayment(paymentTokenId)) return;

    setLoading(true);

    selectPaymentTokenApi(paymentTokenId)
      .then((res) => {
        if (res.data.success) {
          setLoading(false);
          setSelectedPayment({
            ...selectedPayment,
            customer_cart_id: paymentTokenId,
          });
          RunToast('success', 'Payment method selected.');
        }
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', 'Select payment methods failed.');
      });
  };

  const removePaymentToken = (paymentTokenId) => {
    setLoading(true);

    removePaymentmethodApi(paymentTokenId)
      .then((res) => {
        setLoading(false);
        if (res.data.success) {
          RunToast('success', 'Payment method deleted.');
          setPaymentList([
            ...paymentList.filter((item) => item.id !== paymentTokenId),
          ]);
          if (paymentTokenId === get(selectedPayment, 'customer_cart_id', -1))
            setSelectedPayment({
              ...selectedPayment,
              customer_cart_id: -1,
            });
        } else RunToast('error', 'Delete payment method failed.');
      })
      .catch((err) => {
        setLoading(false);
        RunToast('error', 'Delete payment method failed.');
      });
  };

  return (
    <MainPanel>
      <Title>Payment Methods</Title>
      <SubTitle>
        Review any saved payment details including your default payment method.
      </SubTitle>
      <CardsContainer>
        {paymentList.map((item, idx) => {
          if (get(item, 'card_info', null) === null) return null;
          return (
            <PaymentCard key={idx} xs="4" className="mt-4">
              <div className="payment-card-header">
                <div className="check-icon">
                  <img src={CheckIconPurple} alt="checkicon purple" />
                </div>
                <h5>
                  {
                    item.card_info.details[0].RecurringDetail
                      .paymentMethodVariant
                  }
                </h5>
                <div
                  className="close-button"
                  role="button"
                  onClick={() => {
                    removePaymentToken(item.id);
                  }}
                >
                  ×
                </div>
              </div>
              <div className="payment-card-body">
                <h4>
                  Ending:
                  <span className="ml-auto">
                    ***{item.card_info.details[0].RecurringDetail.card.number}
                  </span>
                </h4>
                <h4>
                  Expires:
                  <span className="ml-auto">
                    {getExpireDate(
                      item.card_info.details[0].RecurringDetail.card
                    )}
                  </span>
                </h4>
                {checkSelectedPayment(item.id) ? (
                  <h5 className="selected">Selected</h5>
                ) : (
                  <SelectButton
                    className="ht-btn-primary"
                    onClick={() => {
                      selectPaymentToken(item.id);
                    }}
                  >
                    Select
                  </SelectButton>
                )}
              </div>
            </PaymentCard>
          );
        })}
      </CardsContainer>
      {/* <AddNewCardButton className="ht-btn-primary mr-auto">
        Add a new card
      </AddNewCardButton> */}
      {loading && <HtSpinner />}
    </MainPanel>
  );
};

const MainPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  background: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 33px 50px;
  min-height: 592px;
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 41px;
  color: ${PRIMARY_DARK_COLOR};
  margin: 0 0 12px 0;
`;

const SubTitle = styled.h4`
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 42px;
  color: ${PRIMARY_DARK_COLOR};
`;

const CardsContainer = styled(Row)`
  display: flex;
  margin-top: 8px;
  margin-bottom: 29px;
  flex-wrap: wrap;
`;

const PaymentCard = styled(Col)`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 216px;
  height: 167px;
  .payment-card-header {
    display: flex;
    align-items: center;
    flex: 0 0 37px;
    background-color: ${PRIMARY_ACTIVE_COLOR};
    padding: 0 16px;
    position: relative;
    h5 {
      margin: 0 0 0 11px;
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: white;
    }
    .check-icon {
      width: 22px;
      height: 22px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      padding-top: 1px;
      padding-left: 1px;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .close-button {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 11px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 18px;
      line-height: 17px;
      &:hover {
        filter: brightness(0.8);
      }
      &:active {
        filter: brightness(0.8);
      }
    }
  }
  .payment-card-body {
    border: 1px solid rgba(0, 0, 0, 0.1);
    flex: 1 1 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px 23px 12px;
    h4 {
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 18px;
      margin: 0;
      display: flex;
      align-items: center;
      width: 100%;
      color: black;
    }
    .selected {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      margin: 26px 0 0 0;
      color: ${PRIMARY_ACTIVE_COLOR};
    }
  }
`;

const SelectButton = styled(Button)`
  margin: 18px 0 0 0;
  padding: 7px 24px;
`;

export default PaymentMethodSection;
