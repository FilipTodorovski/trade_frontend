import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ReactDOM from 'react-dom';

import styled from 'styled-components';
import UserSvg from 'assets/images/user.svg';
import ChevPurpleUp from 'assets/images/chev-down-purple.svg';
import {
  PRIMARY_ACTIVE_COLOR,
  PRIMARY_ACTIVE_BACK_COLOR,
} from 'constants/constants';
import { CUSTOMER_LOGOUT } from 'storeFront/actions/actionTypes';

const CustomerUserDropdown = ({
  userInfo = null,
  handleLogin,
  handleSignUp,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (ref.current) {
        if (!ReactDOM.findDOMNode(ref.current).contains(event.target)) {
          if (open) {
            setOpen(false);
          }
        }
      }
    };

    document.addEventListener('click', handleDocumentClick, false);

    return () => {
      document.removeEventListener('click', handleDocumentClick, false);
    };
  }, [ref, open]);

  return (
    <ComponentContainer userInfo={userInfo}>
      <TriggerComponent
        role="button"
        onClick={() => {
          setOpen(!open);
        }}
        className={open && 'active'}
        ref={ref}
      >
        <img src={UserSvg} alt="Customer User" />
        {userInfo && <h4>{`${userInfo.first_name} ${userInfo.last_name}`}</h4>}
        <img
          className={`chev-down ${open && 'chev-up'}`}
          src={ChevPurpleUp}
          alt="ChevPurple Up"
        />
      </TriggerComponent>
      {open && (
        <DropDownMenu>
          {userInfo ? (
            <ul>
              <li
                onClick={() => {
                  setOpen(false);
                  history.push('/customer/admin');
                }}
                className={
                  history.location.pathname === '/customer/admin'
                    ? 'active'
                    : ''
                }
              >
                My Account
              </li>
              <li
                onClick={() => {
                  setOpen(false);
                  dispatch({
                    type: CUSTOMER_LOGOUT,
                  });
                }}
              >
                Log out
              </li>
            </ul>
          ) : (
            <ul>
              <li
                onClick={() => {
                  setOpen(false);
                  handleLogin();
                }}
              >
                Login
              </li>
              <li
                onClick={() => {
                  setOpen(false);
                  handleSignUp();
                }}
              >
                Sign Up
              </li>
            </ul>
          )}
        </DropDownMenu>
      )}
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
  margin-left: auto;

  @media screen and (min-width: 768px) {
    display: ${(props) => (props.userInfo ? 'inline-flex' : 'none')};
  }
`;

const TriggerComponent = styled.div`
  position: relative;
  overflow: visible;
  display: flex;
  align-items: center;
  cursor: pointer;
  h4 {
    color: ${PRIMARY_ACTIVE_COLOR};
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    margin: 0 0 0 12px;
  }

  .chev-down {
    margin: 0 0 0 12px;
    transition: transform 0.3s;
    &.chev-up {
      transform: rotate(-180deg);
    }
  }
`;

const DropDownMenu = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 15px);
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  width: 200px;
  z-index: 2;

  ul {
    list-style: none;
    padding: 10px 0;
    margin: 0;
    li {
      cursor: pointer;
      padding: 10px 20px;
      font-size: 16px;
      margin: 0 0 2px 0;
      &:hover {
        background-color: ${PRIMARY_ACTIVE_BACK_COLOR};
      }
      &.active {
        color: ${PRIMARY_ACTIVE_COLOR};
        background-color: ${PRIMARY_ACTIVE_BACK_COLOR};
      }
    }
  }
`;

export default CustomerUserDropdown;
