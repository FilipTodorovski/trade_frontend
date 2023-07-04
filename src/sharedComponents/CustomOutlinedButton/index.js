import React from 'react';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const StyledButton = styled(Button)`
  width: 50px;
  height: 50px;
  background: transparent;
  color: #213f5e;
  border: 1px solid #c7c7c7;
  border-radius: 10px;
  font-size: 2.7em;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 200;
  margin: 0;

  &:not(:disabled):not(.disabled):active,
  &:not(:disabled):not(.disabled).active,
  &:hover,
  &:focus {
    background-color: white;
    color: #213f5e;
    border-color: #213f5e;
    outline: none;
    box-shadow: none;
  }
`;

const CustomOutlinedButton = ({ onClick, styles, children }) => {
  return (
    <StyledButton onClick={onClick} style={{ ...styles }}>
      {children}
    </StyledButton>
  );
};

export default CustomOutlinedButton;
