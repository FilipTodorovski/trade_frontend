import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Modal, Button } from 'react-bootstrap';
import moment from 'moment';
import DeliveryAddressModal from './DeliveryAddressModal';
import DeliveryFromModal from './DeliveryFromModal';

const DeliveryDetailModal = ({ isShow, hideModal }) => {
  const [selfShow, setSelfShow] = useState(isShow);
  const [showDeliveryAddrModal, setShowDeliveryAddrModal] = useState(false);
  const [showDeliveryTimeModal, setShowDeliveryTimeModal] = useState(false);
  const { deliveryInfo } = useSelector((state) => ({
    deliveryInfo: state.storeFrontReducer.deliveryData,
  }));

  useEffect(() => {
    setSelfShow(isShow);
  }, [isShow]);

  const getDeliveryIn = () => {
    if (deliveryInfo.data.day === 0) return '25 - 45 min';

    return `${deliveryInfo.data.day === 2 ? 'Tomorrow' : ''} ${moment(
      deliveryInfo.data.value
    ).format('HH:mm')} - ${moment(deliveryInfo.data.value)
      .add(30, 'minutes')
      .format('HH:mm')}`;
  };

  return (
    <>
      <Modal
        show={selfShow}
        onHide={() => {
          hideModal();
        }}
        size="md"
        centered
      >
        <Modal.Header>
          <h3 className="mb-0">Update details</h3>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column">
          <h5 className="mb-0">Where and when</h5>
          <CustomRow
            onClick={() => {
              setSelfShow(false);
              hideModal();
              setShowDeliveryAddrModal(true);
            }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-3" />
            <span>{deliveryInfo.data.postcode}</span>
            <span className="text-primary ml-auto font-weight-bold">
              Change
            </span>
          </CustomRow>
          <CustomRow
            onClick={() => {
              setSelfShow(false);
              hideModal();
              setShowDeliveryTimeModal(true);
            }}
            className="mb-3"
          >
            <svg height="24" width="24" viewBox="0 0 24 24" className="mr-3">
              <path d="M13 12L15.2025 15.8789L13.4704 16.8789L11 12.6V6H13V12ZM12 2C17.5228 2 22 6.47717 22 12C22 17.5228 17.5228 22 12 22C6.47717 22 2 17.5228 2 12C2 6.47717 6.47717 2 12 2ZM12 20C16.4113 20 20 16.4113 20 12C20 7.58875 16.4113 4 12 4C7.58875 4 4 7.58875 4 12C4 16.4113 7.58875 20 12 20Z"></path>
            </svg>

            <span>{getDeliveryIn()}</span>
            <span className="text-primary ml-auto font-weight-bold">
              Change
            </span>
          </CustomRow>
        </Modal.Body>
        <CustomModalFooter>
          <Button
            variant="outline-primary"
            onClick={() => {
              setSelfShow(false);
              hideModal();
            }}
            className="btn-close ht-btn-outline-primary"
          >
            Close
          </Button>
          <Button
            onClick={() => {
              setSelfShow(false);
              hideModal();
            }}
            className="btn-update ht-btn-primary"
          >
            Update
          </Button>
        </CustomModalFooter>
      </Modal>

      {showDeliveryAddrModal && (
        <DeliveryAddressModal
          isShow={showDeliveryAddrModal}
          hideModal={() => {
            setShowDeliveryAddrModal(false);
            setSelfShow(true);
          }}
        />
      )}
      {showDeliveryTimeModal && (
        <DeliveryFromModal
          isShow={showDeliveryTimeModal}
          hideModal={() => {
            setShowDeliveryTimeModal(false);
            setSelfShow(true);
          }}
        />
      )}
    </>
  );
};

const CustomRow = styled.div`
  display: flex;
  align-items: center;
  padding: 25px 0 0 0;
  cursor: pointer;
  font-size: 1rem;
  .svg-inline--fa {
    font-size: 20px;
    width: 20px;
  }
`;

const CustomModalFooter = styled(Modal.Footer)`
  display: flex;
  flex-wrap: nowrap;
  .btn-close {
    flex: 1 2 100%;
  }
  .btn-update {
    flex: 1 1 100%;
  }
`;
export default DeliveryDetailModal;
