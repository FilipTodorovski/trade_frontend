import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import _ from 'lodash';
import styled from 'styled-components';
import { Card, Button } from 'react-bootstrap';

import AppContainer from '../../../../components/AppContainer';
import { PRIMARY_ACTIVE_COLOR } from 'constants/constants';
import { STRIPE_CLIENT_ID } from 'config';
import { setStripeAccountInfo } from 'Apis/AdminApis/StripeApi';
import { RunToast } from 'utils/toast';

import LogoTextSvg from 'assets/images/logo.svg';
import CircleISvg from 'assets/images/circle-i.svg';
import VisaCardSvg from 'assets/images/visa-card.svg';
import MasterCardSvg from 'assets/images/master-card.svg';

const PaymentPage = () => {
  const location = useLocation();
  const history = useHistory();
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (location.search === '' || !userInfo) return;

    const code = new URLSearchParams(location.search).get('code');
    const connect = async () => {
      try {
        await setStripeAccountInfo({
          user_id: userInfo.id,
          stripe_auth_code: code,
        });

        setConnected(true);
        history.push('/settings/payments');
      } catch (error) {
        console.log('Stripe Connect Error::', error);
        setConnected(false);
        RunToast('error', 'Stripe connect Error');
        history.push('/settings/payments');
      }
    };

    connect();
  }, [location.search, userInfo]);

  return (
    <AppContainer>
      <ComponentContainer className="p-4">
        <TopHeader>
          <h1>Trade Sprint Payments</h1>
        </TopHeader>
        <MainCard className="ht-card">
          <CardHeader>
            <img className="logo" src={LogoTextSvg} alt="logo" width={200} />
          </CardHeader>
          <CurrentStatus>
            <img src={CircleISvg} alt="circle i" />
            <p>
              Set up Trade Sprint payments - We need details to know where to
              pay your money.
            </p>
          </CurrentStatus>
          <Panel1>
            <div className="credit-card">
              <h6>Credit card rate</h6>
              <p>As low as 1.9% + £0.20</p>
              <div className="card-container">
                <div className="card-item">
                  <img src={VisaCardSvg} alt="visa" />
                </div>
                <div className="card-item">
                  <img src={MasterCardSvg} alt="visa" />
                </div>
              </div>
            </div>
            <div className="transaction-fee">
              <h6>Transaction Fee</h6>
              <p>0%</p>
            </div>
          </Panel1>
          <Footer>
            <Button
              variant="outline"
              className="ht-btn-outline-primary"
              onClick={() => {
                history.push('/settings/payment/transactions');
              }}
            >
              View Payouts
            </Button>
            <StripeConnect>
              {connected && (
                <span className="mt-4">
                  You already connected your stripe account to Tradesprint
                </span>
              )}
              <ConnectBtn
                className="ht-btn-primary mt-3 connect-btn"
                href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${STRIPE_CLIENT_ID}&scope=read_write`}
              >
                {connected ? 'Connect again' : 'Connect with Stripe'}
              </ConnectBtn>
            </StripeConnect>
          </Footer>
        </MainCard>
      </ComponentContainer>
    </AppContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 974px;
  margin: 0 auto;
  padding: 40px 0 120px;
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

const MainCard = styled(Card)`
  padding: 40px 60px;
  margin: 70px auto 0;
  width: 100%;
  max-width: 772px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  .manage-button {
    color: ${PRIMARY_ACTIVE_COLOR};
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    text-align: center;
    cursor: pointer;
    margin-left: auto;
  }
`;

const CurrentStatus = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 13px 25px 20px;
  margin: 28px 0 0 0;
  background: rgba(241, 246, 255, 1);
  border-radius: 12px;

  img {
    margin-right: 20px;
  }
  p {
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    color: ${PRIMARY_ACTIVE_COLOR};
    margin: 0;
  }
`;

const Panel1 = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0 0 0;
  .credit-card {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%; 
    margin-right: 50px;
    .card-container {
      display: flex;
      margin: 40px 0 0 0;
      .card-item {
        width: 82px;
        height: 52px;
        margin-right: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .transaction-fee {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    margin-left: 50px;
  }
  h6 {
    font-size: 14px;
    font-weight 600;
    margin: 0;
  }
  p {
    font-size: 14px;
    font-weight normal;
    margin: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 0 0;
  .ht-btn-outline-primary {
    width: 179px;
    padding: 0;
    height: 50px;
  }
  .ht-btn-primary {
    width: 203px;
    margin-left: 20px;
    padding: 0;
    height: 50px;
  }
`;

const StripeConnect = styled.div`
  display: flex;
`;

const ConnectBtn = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  width: 300px;
  margin: 0 0 0 10px !important;

  &:hover {
    text-decoration: none;
    color: white;
  }
`;

export default PaymentPage;
