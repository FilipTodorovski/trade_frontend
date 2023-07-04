import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

import styled from 'styled-components';
import UserSvg from '../../../assets/images/user.svg';
import ChevPurpleUp from '../../../assets/images/chev-down-purple.svg';
import { PRIMARY_ACTIVE_COLOR } from '../../../constants';

const UserDropDown = () => {
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
    <ComponentContainer>
      <TriggerComponent
        role="button"
        onClick={() => {
          setOpen(!open);
        }}
        className={open && 'active'}
        ref={ref}
      >
        <img src={UserSvg} alt="Customer User" />
        <h4>Jamie</h4>
        <img
          className={`chev-down ${open && 'chev-up'}`}
          src={ChevPurpleUp}
          alt="ChevPurple Up"
        />
      </TriggerComponent>
      {open && (
        <DropDownMenu>
          <ul>
            <li>Log out</li>
          </ul>
        </DropDownMenu>
      )}
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  position: relative;
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
  left: 0;
  top: 100%;
`;

export default UserDropDown;
