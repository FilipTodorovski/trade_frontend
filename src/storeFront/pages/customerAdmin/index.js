import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import get from 'lodash/get';
import StoreFrontMasterComponent from 'sharedComponents/StoreFrontMasterComponent';
import StoreFrontHeader from 'sharedComponents/StoreFrontHeader';
import PreviousOrderSection from './sections/previousOrder';
import PaymentMethodSection from './sections/paymentMethods';
import AddressBookSection from './sections/addressBook';
import SecuritySection from './sections/security';
import PersonalDetailsSection from './sections/personalDetails';
import Footer from 'sharedComponents/StoreFrontFooter';
import {
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_ACTIVE_BACK_COLOR,
} from 'constants/constants';

const LEFT_SIDEBAR = [
  'My Orders',
  'Payment Methods',
  'Address Book',
  'Personal Details',
  'Security',
];

const CustomerAdmin = () => {
  const history = useHistory();
  const [curPage, setCurPage] = useState(LEFT_SIDEBAR[0]);

  const { customerInfo } = useSelector((state) => ({
    customerInfo: state.storeFrontReducer.user,
  }));

  useEffect(() => {
    if (
      get(customerInfo, 'user.id', -1) === -1 &&
      !localStorage.getItem('customer-token')
    )
      history.push('/');
  }, [customerInfo.user]); // eslint-disable-line

  return (
    <StoreFrontMasterComponent redirect={true}>
      <ComponentContainer>
        <StoreFrontHeader />
        <MainContainer>
          <LeftPanel>
            {LEFT_SIDEBAR.map((item) => {
              return (
                <div
                  className={`sidebar-item ${curPage === item && 'active'}`}
                  onClick={() => {
                    setCurPage(item);
                  }}
                  role="button"
                  key={item}
                >
                  {item}
                </div>
              );
            })}
          </LeftPanel>
          {curPage === LEFT_SIDEBAR[0] && <PreviousOrderSection />}
          {curPage === LEFT_SIDEBAR[1] && <PaymentMethodSection />}
          {curPage === LEFT_SIDEBAR[2] && <AddressBookSection />}
          {curPage === LEFT_SIDEBAR[3] && <PersonalDetailsSection />}
          {curPage === LEFT_SIDEBAR[4] && <SecuritySection />}
        </MainContainer>
        <Footer />
      </ComponentContainer>
    </StoreFrontMasterComponent>
  );
};

const ComponentContainer = styled.div`
  min-height: 100vh;
  max-width: 100vw;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const MainContainer = styled.div`
  width: 100%;
  max-width: 1280px;
  display: flex;
  padding: 55px 0;
  margin: 0 auto;
`;

const LeftPanel = styled.div`
  background: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 33px 0;
  display: flex;
  flex-direction: column;
  flex: 0 0 263px;
  margin: 0 69px 0 0;
  max-height: 361px;
  .sidebar-item {
    width: 100%;
    height: 52px;
    display: flex;
    align-items: center;
    padding: 17px 22px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    color: ${PRIMARY_ACTIVE_COLOR};
    cursor: pointer;
    &:hover {
      background-color: ${PRIMARY_ACTIVE_BACK_COLOR};
    }
    &.active {
      color: white;
      background-color: ${PRIMARY_ACTIVE_COLOR};
    }
  }
`;

export default CustomerAdmin;
