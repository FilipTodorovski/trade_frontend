import React from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';

const CheckBox = ({ name, checked, onChange }) => {
  return (
    <StyledFormGroup onClick={onChange}>
      <Form.Check
        custom
        type="checkbox"
        label={name}
        id={name}
        value={checked}
      />
      {checked ? (
        <svg height="24" width="24" viewBox="0 0 24 24" fill="#213f5e">
          <path d="M3.9 3H20.1L21 3.9V20.1L20.1 21H3.9L3 20.1V3.9L3.9 3ZM8.02132 10.9L5.9 13.0213L10.0213 17.1426L18.1426 9.02132L16.0213 6.9L10.0213 12.9L8.02132 10.9Z"></path>
        </svg>
      ) : (
        <svg height="24" width="24" viewBox="0 0 24 24" fill="rgba(0,0,0,0.2)">
          <path d="M3.9 3H20.1L21 3.9V20.1L20.1 21H3.9L3 20.1V3.9L3.9 3ZM5 19H19.0001V5H5V19Z"></path>
        </svg>
      )}
      <Form.Label>{name}</Form.Label>
    </StyledFormGroup>
  );
};

const StyledFormGroup = styled(Form.Group)`
  display: flex;
  aligh-item: center;
  svg {
    min-width: 24px;
  }
  .custom-checkbox {
    display: none;
  }
  .form-label {
    margin: 0 0 0 10px;
    cursor: pointer;
  }
`;
export default CheckBox;
