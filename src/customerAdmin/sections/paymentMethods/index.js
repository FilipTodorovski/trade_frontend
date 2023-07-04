import React from 'react';

import styled from 'styled-components';
import { Button } from 'react-bootstrap';

import { PRIMARY_DARK_COLOR, PRIMARY_ACTIVE_COLOR } from '../../../constants';
import CheckIconPurple from '../../../assets/images/checked-icon-purple.svg';

const PaymentMethodSection = () => {
  return (
    <MainPanel>
      <Title>Payment Methods</Title>
      <SubTitle>
        Review any saved payment details including your default payment method.
      </SubTitle>
      <CardsContainer>
        <PaymentCard>
          <div className="payment-card-header">
            <div className="check-icon">
              <img src={CheckIconPurple} alt="checkicon purple" />
            </div>
            <h5>Debit Mastercard</h5>
            <div
              className="close-button"
              role="button"
              onClick={() => {
                console.log('asdf');
              }}
            >
              ×
            </div>
          </div>
          <div className="payment-card-body">
            <h4>
              Ending:<span className="ml-auto">0338</span>
            </h4>
            <h4>
              Expires:<span className="ml-auto">12/22</span>
            </h4>
            <h5 className="selected">Selected</h5>
          </div>
        </PaymentCard>
      </CardsContainer>
      <AddNewCardButton className="ht-btn-primary mr-auto">
        Add a new card
      </AddNewCardButton>
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

const CardsContainer = styled.div`
  display: flex;
  margin: 8px 0 29px;
  flex-wrap: wrap;
`;

const PaymentCard = styled.div`
  display: flex;
  flex-direction: column;
  postion: relative;
  width: 216px;
  height: 147px;
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
      width: 20px;
      height: 20px;
      border-radius: 10px;
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
      width: 16px;
      height: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
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
    }
    .selected {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 19px;
      color: ${PRIMARY_ACTIVE_COLOR};
      margin: 16px 0 0 0;
    }
  }
`;

const AddNewCardButton = styled(Button)`
  padding: 12px 24px;
`;

export default PaymentMethodSection;
