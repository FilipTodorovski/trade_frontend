import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import get from 'lodash/get';
import styled from 'styled-components';
import DesktopLogoSvg from 'svg/Logo.svg';
import MobileLogoSvg from 'svg/logo-small.svg';
import CustomerUserDropdown from '../CustomerUserDropdown';
import CustomerLoginModal from '../CustomerLoginModal';
import CustomerRegisterModal from '../CustomerRegisterModal';
import CustomerForgotPasswordModal from '../CustomerForgotPasswordModal';
import { PRIMARY_ACTIVE_COLOR, ACTIVE_GREEN_COLOR } from 'constants/constants';

const StoreFrontHeader = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showForgotPwdModal, setShowForgotPwdModal] = useState(false);
  const history = useHistory();

  const { customerInfo } = useSelector((state) => ({
    customerInfo: state.storeFrontReducer.user,
  }));

  return (
    <Header>
      <div className="header-container">
        <a
          href
          onClick={() => {
            history.push('/');
          }}
          role="button"
        >
          <img
            className="desktop-logo"
            src={DesktopLogoSvg}
            alt="Desktop Logo"
          />
          <img className="mobile-logo" src={MobileLogoSvg} alt="Mobile Logo" />
        </a>
        <ButtonWrapper userInfo={customerInfo?.user}>
          <LoginButton
            onClick={() => {
              setShowLoginModal(true);
            }}
          >
            Login
          </LoginButton>
          <SignUpButton
            onClick={() => {
              setShowRegisterModal(true);
            }}
          >
            Sign Up
          </SignUpButton>
        </ButtonWrapper>
        <CustomerUserDropdown
          userInfo={customerInfo?.user}
          handleLogin={() => setShowLoginModal(true)}
          handleSignUp={() => setShowRegisterModal(true)}
        />
      </div>
      {showLoginModal && (
        <CustomerLoginModal
          isShow={showLoginModal}
          gotoSignup={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
          gotoForgotPwd={() => {
            setShowLoginModal(false);
            setShowForgotPwdModal(true);
          }}
          hideModal={() => {
            setShowLoginModal(false);
          }}
        />
      )}
      {showRegisterModal && (
        <CustomerRegisterModal
          isShow={showRegisterModal}
          gotoLogin={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
          hideModal={() => {
            setShowRegisterModal(false);
          }}
        />
      )}
      {showForgotPwdModal && (
        <CustomerForgotPasswordModal
          isShow={showForgotPwdModal}
          gotoLogin={() => {
            setShowForgotPwdModal(false);
            setShowLoginModal(true);
          }}
          hideModal={() => {
            setShowForgotPwdModal(false);
          }}
        />
      )}
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  background: white;
  position: relative;
  border-bottom: solid 1px rgba(102, 101, 126, 0.3);
  height: 100px;
  padding: 0 80px;

  .header-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    max-width: 1280px;
    margin-left: auto;
    margin-right: auto;
  }

  .button-wrapper {
    display: flex;
  }

  @media screen and (max-width: 767px) {
    padding: 0 20px;
    height: 73px;

    .button-wrapper {
      display: none;
    }
  }

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

  .SearchBox {
    margin-left: auto;
    width: 360px;
    .form-group {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 0;
      .form-control {
        width: 260px;
      }
      .btn {
        width: 90px;
        margin-left: 10px;
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
`;

const ButtonWrapper = styled.div`
  display: ${(props) => (props.userInfo ? 'none' : 'flex')};

  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const LoginButton = styled.div`
  position: relative;
  border: 2px solid ${PRIMARY_ACTIVE_COLOR};
  color: white;
  border-radius: 0.4em;
  padding: 0.6em 1em;
  font-size: 18px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${PRIMARY_ACTIVE_COLOR};
  margin-left: auto;

  &:active {
    filter: brightness(0.8);
  }
`;

const SignUpButton = styled.div`
  position: relative;
  background: ${ACTIVE_GREEN_COLOR};
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
  margin-left: 2em;
  &:active {
    filter: brightness(0.8);
  }
`;
export default StoreFrontHeader;
