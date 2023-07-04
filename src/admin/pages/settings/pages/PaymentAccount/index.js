import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import styled from 'styled-components';
import { Container } from 'react-bootstrap';

import AppContainer from '../../../../components/AppContainer';
import { STRIPE_CLIENT_ID } from 'config';
import { setStripeAccountInfo } from 'Apis/AdminApis/StripeApi';

const PaymentAccount = () => {
  const location = useLocation();
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (location.search === '' || !userInfo) return;

    if (userInfo.stripe_user_id) {
      setConnected(true);
    } else {
      const code = new URLSearchParams(location.search).get('code');
      const connect = async () => {
        await setStripeAccountInfo({
          user_id: userInfo.id,
          stripe_auth_code: code,
        });

        setConnected(true);
      };

      connect();
    }
  }, [location.search, userInfo]);

  return (
    <AppContainer>
      <MenuContainer>
        <TopHeader>
          <h1>Trade Sprint Payments</h1>
        </TopHeader>
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
      </MenuContainer>
    </AppContainer>
  );
};

const MenuContainer = styled(Container)`
  padding-top: 40px;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
  max-width: 974px;
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

const ConnectBtn = styled.a`
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  width: 300px;

  &:hover {
    text-decoration: none;
    color: white;
  }
`;

export default PaymentAccount;
