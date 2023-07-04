import React from 'react';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { PRIMARY_ACTIVE_COLOR } from 'constants/constants';
import { get } from 'lodash';

const HtSpinner = ({ spinnerPosition }) => {
  // console.log(spinnerPosition);
  const left = get(spinnerPosition, 'left', 'calc(50% - 25px)');
  const top = get(spinnerPosition, 'top', '200px');

  return (
    <SpinnerContainer left={left} top={top}>
      <Spinner animation="border" variant="primary" size="lg" />
    </SpinnerContainer>
  );
};

const SpinnerContainer = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 99999;
  pointer-events: none;
  background-color: rgba(255, 255, 255, 0.5);

  .spinner-border {
    position: absolute;
    width: 50px;
    height: 50px;
    top: ${(props) => props.top};
    left: ${(props) => props.left};
  }

  .text-primary {
    color: ${PRIMARY_ACTIVE_COLOR} !important;
  }
`;

export default HtSpinner;
