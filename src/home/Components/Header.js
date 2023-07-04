import React from 'react';

import styled from 'styled-components';

import DesktopLogoSvg from '../../svg/quickshopper.svg';
import MobileLogoSvg from '../../svg/Logo.svg';

import * as CONSTANTS from '../../constants';

const Header = () => {
  return (
    <ComponentContainer>
      <MainContainer>
        <a href="/">
          
          <img className="mobile-logo" src={MobileLogoSvg} alt="Mobile Logo" />
        </a>

        <ButtonRow>
          <LoginButton>Login</LoginButton>
          <SignUpButton>Sign Up</SignUpButton>
        </ButtonRow>
      </MainContainer>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: flex;
  background: white;
  position: relative;
  border-bottom: solid 1px rgba(102, 101, 126, 0.3);
  height: 100px;
  padding: 0 80px;

  @media screen and (max-width: 767px) {
    padding: 0 20px;
    height: 73px;
  }
`;

const MainContainer = styled.div`
  max-width: 1280px;
  width: 100%;
  display: flex;
  margin: 0 auto;
  align-items: center;

  .desktop-logo {
    height: 40px;

    @media (max-width: 767px) {
      display: none;
    }
  }

  .mobile-logo {
    display: none;

    @media (max-width: 767px) {
      display: block;
      height: 50px;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  z-index: 1;
  align-items: center;
`;

const LoginButton = styled.div`
  position: relative;
  border: 2px solid ${CONSTANTS.PRIMARY_ACTIVE_COLOR};
  border-radius: 0.4em;
  padding: 0.6em 1em;
  font-size: 18px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  border-radius: 12px;
  box-shadow: rgb(0 0 0 / 5%) 0px 1px 0px 0px;
  border: 1px solid #babfc3;
  padding: 11px 24px;
  color: ${CONSTANTS.PRIMARY_ACTIVE_COLOR};

  &:active {
    filter: brightness(0.8);
  }
`;

const SignUpButton = styled.div`
  position: relative;
  background: ${CONSTANTS.ACTIVE_GREEN_COLOR};
  color: white;
  outline: none;
  cursor: pointer;
  -webkit-text-decoration: none;
  text-decoration: none;
  padding: 16px 40px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  margin: 1em;
  &:active {
    filter: brightness(0.8);
  }
`;

export default Header;
