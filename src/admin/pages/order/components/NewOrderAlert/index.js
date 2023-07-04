import React from 'react';

import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import { PRIMARY_ACTIVE_COLOR } from 'constants/constants';
import NoteSvg from 'assets/images/icon_content_note.svg';

const NewOrderAlert = ({ onHide }) => {
  return (
    <AlertContainer>
      <img src={NoteSvg} alt="New" />
      <h4 className="my-3">You have a new order!</h4>
      <Button className="ht-btn-outline-white" onClick={onHide}>
        View Order
      </Button>
    </AlertContainer>
  );
};

const AlertContainer = styled.div`
  background-color: ${PRIMARY_ACTIVE_COLOR};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: fixed;
  left: 220px;
  bottom: 0;
  width: calc(100% - 240px);
  height: 200px;
  border-radius: 15px 15px 0 0;
  animation: newOrderAlert 0.5s;

  h4 {
    color: white;
  }

  @keyframes newOrderAlert {
    from {
      opacity: 0;
    }
    to {
      height: 1;
    }
  }
`;
export default NewOrderAlert;
