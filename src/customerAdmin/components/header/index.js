import React from 'react';

import styled from 'styled-components';
import LogoTextSvg from '../../../assets/images/logo-text.svg';
import UserDropDown from '../userDropDown';

const CustomerHeader = () => {
  return (
    <ComponentContainer>
      <MainContainer>
        <a className="logo">
          <img src={LogoTextSvg} alt="logo-text" />
        </a>
        <UserDropDown />
      </MainContainer>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100px;
  border-bottom: 1px solid rgba(102, 101, 126, 0.3);
  background-color: white;
  .logo {
    display: flex;
    cursor: pointer;
  }
`;

const MainContainer = styled.div`
  margin: 0 auto;
  flex: 1 1 100%;
  width: 100%;
  max-width: 1280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default CustomerHeader;
