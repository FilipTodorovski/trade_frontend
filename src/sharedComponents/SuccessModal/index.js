import React from 'react';

import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { PRIMARY_ACTIVE_COLOR } from 'constants/constants';

const SuccessModal = ({ show, hideModal, title }) => {
  return (
    <ComponentModal show={show} size="md" onHide={hideModal} centered>
      <Modal.Body>
        <FontAwesomeIcon className="icon-search" icon={faCheckCircle} />
        <h3>{title}</h3>
        <Button
          variant="primary"
          className="ht-btn-primary"
          onClick={hideModal}
        >
          Ok
        </Button>
      </Modal.Body>
    </ComponentModal>
  );
};

const ComponentModal = styled(Modal)`
  .modal-content {
    border-radius: 12px;
  }
  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    .fa-check-circle {
      font-size: 70px;
      color: ${PRIMARY_ACTIVE_COLOR};
    }
    h3 {
      font-style: normal;
      font-weight: 600;
      font-size: 20px;
      line-height: 17px;
      color: #272848;
      margin: 20px 0 0 0;
      text-align: center;
    }
    .ht-btn-primary {
      width: 120px;
      margin: 40px 0 0 0;
    }
  }
`;

export default SuccessModal;
