import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import styled from 'styled-components';
import AppContainer from 'admin/components/AppContainer';
import DotSpan from 'sharedComponents/DotSpan';
import * as CONSTANTS from 'constants/constants';
import ApiService from 'admin/ApiService';

const TransactionDetail = () => {
  const location = useLocation();
  const history = useHistory();
  // const [credits, setCredits] = useState([]);
  const transaction = location.state ?? null;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const filterResponse = await ApiService({
  //       method: 'POST',
  //       url: `/order/filter`,
  //       data: {},
  //       headers: CONSTANTS.getToken().headers,
  //     });

  //     if (!filterResponse.data.success) return;

  //     const orders = filterResponse.data.orders;

  //     setCredits(
  //       location.state.history.map((history) => {
  //         let credit = {};
  //         credit.orderInfo = orders.find(
  //           (order) => order.adyen_payment_reference === history.pspReference
  //         );
  //         credit.transactionInfo = history;
  //         return credit;
  //       })
  //     );
  //   };

  //   fetchData();
  // }, [location.state]);

  const getAmount = (amount) => {
    return parseFloat(amount / 100).toFixed(2);
  };

  return (
    <AppContainer>
      <MenuContainer>
        <TopHeader>
          <BackArrowBtn
            icon={faArrowLeft}
            onClick={() => {
              history.goBack();
            }}
          />
          <h1>
            {transaction?.status} - {transaction?.id}
          </h1>
        </TopHeader>
        <DetailContainer>
          <span>Details</span>
          <DetailCard className="ht-card">
            <InfoRow>
              <InfoLabel>Status</InfoLabel>
              <InfoValue>
                <DotSpan status={transaction?.status} />
                {transaction?.status}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Created</InfoLabel>
              <InfoValue>
                {moment(transaction?.created * 1000).format('Do MMM YYYY')}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Type</InfoLabel>
              <InfoValue>Merchant</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Arrived</InfoLabel>
              <InfoValue>
                {moment(transaction?.created * 1000).format('Do MMM YYYY')}
              </InfoValue>
            </InfoRow>
            {/* <InfoRow>
              <InfoLabel>Creditor</InfoLabel>
              <InfoValue>
                {transaction?.bankAccountDetail?.bankAccountUUID}
              </InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>Creditor account</InfoLabel>
              <InfoValue>
                {transaction?.bankAccountDetail?.accountNumber}
              </InfoValue>
            </InfoRow> */}
            <InfoRowSpace />
            <InfoRow>
              <InfoLabel>Gross amount</InfoLabel>
              <InfoValue>{`£${getAmount(transaction?.amount)}`}</InfoValue>
            </InfoRow>
            <InfoRow>
              <InfoLabel>TradeSprint Fee</InfoLabel>
              <InfoValue className="red">{`£${getAmount(
                transaction?.application_fee_amount
              )}`}</InfoValue>
            </InfoRow>
            <InfoSeparator />
            <InfoRow>
              <InfoLabel>VAT Total</InfoLabel>
              <InfoValue></InfoValue>
            </InfoRow>
            <InfoSeparator />
            <InfoRow>
              <InfoLabel>Net amount</InfoLabel>
              <InfoValue>
                {`£${getAmount(
                  transaction.amount - transaction.application_fee_amount
                )}`}
              </InfoValue>
            </InfoRow>
          </DetailCard>
        </DetailContainer>
        {/* {credits && credits.length > 0 && (
          <CreditListContainer>
            <LabelContainer>
              <CreditSpan>Credits</CreditSpan>
              <CustomerSpan>Customer</CustomerSpan>
              <ChargeSpan>Charged</ChargeSpan>
              <AmountSpan>Amount</AmountSpan>
              <NetSpan>Net</NetSpan>
            </LabelContainer>
            <TableContainer>
              {credits.map((credit, nIndex) => {
                return (
                  <CreditRow>
                    <CreditSpan>{`Payment for ${credit.orderInfo.order_number}`}</CreditSpan>
                    <CustomerSpan>
                      {credit.orderInfo.first_name} {credit.orderInfo.last_name}
                    </CustomerSpan>
                    <ChargeSpan>
                      {moment(credit.transactionInfo.creationDate).format(
                        'DD.MM.YY'
                      )}
                    </ChargeSpan>
                    <AmountSpan>
                      {credit.orderInfo.amount.toFixed(2)}{' '}
                      {credit.transactionInfo.amount.currency}
                    </AmountSpan>
                    <NetSpan>
                      {(credit.transactionInfo.amount.value / 100).toFixed(2)}{' '}
                      {credit.transactionInfo.amount.currency}
                    </NetSpan>
                  </CreditRow>
                );
              })}
            </TableContainer>
          </CreditListContainer>
        )} */}
      </MenuContainer>
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  max-width: 1280px;

  .status-selector {
    margin: 40px 0 0 0;
    width: 100%;
    max-width: 400px;
  }
`;

const TopHeader = styled.div`
  display: flex;
  align-items: center;
  justify-contents: space-around;
  h1 {
    font-size: 34px;
    line-height: 41px;
    font-weight: 600;
    margin: 0;
  }
`;

const BackArrowBtn = styled(FontAwesomeIcon)`
  font-size: 25px;
  color: ${CONSTANTS.PRIMARY_DARK_COLOR};
  cursor: pointer;
  margin-right: 1rem;
`;

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 56px;
`;

const DetailCard = styled(Card)`
  display: flex;
  width: 100%;
  height: 409px;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 3px;
  margin: 10px 0 0;
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

const InfoRow = styled.div`
  display: flex;
`;

const InfoLabel = styled.span`
  width: 200px;
  text-align: right;
  margin-right: 10px;
  line-height: 2;
`;

const InfoValue = styled.span`
  line-height: 2;
  display: flex;
  align-items: center;

  &.red {
    color: red;
  }
`;

const InfoRowSpace = styled.div`
  display: flex;
  padding: 10px;
`;

const InfoSeparator = styled.div`
  display: flex;
  height: 1px;
  background-color: ${CONSTANTS.BORDER_GREY_COLOR};
  margin: 15px 0;
`;

const CreditListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 50px 0 10px;
  padding: 0 15px;
`;

const TableContainer = styled(Card)``;

const CreditRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid ${CONSTANTS.BORDER_GREY_COLOR};

  &:last-child {
    border-bottom: none;
  }
`;

const CreditSpan = styled.span`
  width: 170px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const CustomerSpan = styled.span`
  flex: 1;
`;

const ChargeSpan = styled.span`
  width: 120px;
  text-align: right;
`;

const AmountSpan = styled.span`
  width: 120px;
  text-align: right;
`;

const NetSpan = styled.span`
  width: 120px;
  text-align: right;
  font-weight: bold;
`;

export default TransactionDetail;
