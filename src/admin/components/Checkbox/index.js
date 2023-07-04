import React from 'react';
import styled from 'styled-components';
import CheckSvg from 'assets/images/checked-icon-white.svg';
import * as CONSTANTS from 'constants/constants';

const Checkbox = ({ id, checked, onChange, children, style }) => {
  return (
    <CheckboxContainer checked={checked} style={{ ...style }}>
      <input
        type="checkbox"
        className=""
        id={id}
        onChange={onChange}
        checked={checked}
      />
      <label htmlFor={id} className="checkbox-label">
        <span className="checkbox-span">
          {checked && <img src={CheckSvg} alt="Check" />}
        </span>
        {children}
      </label>
    </CheckboxContainer>
  );
};

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;
  }

  label {
    display: flex;
    align-items: center;
    line-height: 17px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    margin: 0;    

    span {
      display:flex;
      justify-content: center;
      align-items center;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      margin-right: 24px;
      background: ${(props) =>
        props.checked ? CONSTANTS.PRIMARY_ACTIVE_COLOR : 'transparent'};
      border: 1px solid ${(props) =>
        props.checked
          ? CONSTANTS.PRIMARY_ACTIVE_COLOR
          : CONSTANTS.SECOND_GREY_COLOR};
    }
  }
`;
export default Checkbox;
