import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import { Modal, Button } from 'react-bootstrap';

const ViewMapModal = ({ isShow, hideModal }) => {
  return (
    <Modal
      show={isShow}
      onHide={() => {
        hideModal();
      }}
      size="md"
    >
      <Modal.Header className="border-0">
        <h3>Open with</h3>
      </Modal.Header>
      <Modal.Body className="d-flex justify-content-center align-items-center">
        <a
          href="https://www.google.com/maps"
          className="d-flex align-items-center"
          style={{ fontSize: '20px' }}
          target="blank"
        >
          <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
          Google Maps
        </a>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center border-0">
        <Button
          variant="primary"
          onClick={() => {
            hideModal();
          }}
          style={{ width: '130px' }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewMapModal;
