import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import _ from 'lodash';
import DeliveryDetailModal from './DeliveryDetailModal';
import * as types from '../../../../actions/actionTypes';
import * as CONSTANTS from 'constants/constants';

const DeliveryTypeModal = ({ match, isShow, hideModal }) => {
  const dispatch = useDispatch();
  const { storeInfo, deliveryData } = useSelector((state) => ({
    storeInfo: state.storeFrontReducer.store,
    deliveryData: state.storeFrontReducer.deliveryData,
  }));
  const [showDeliverDetailModal, setShowDeliveryDetailModal] = useState(false);
  const clickFullFillMent = (transType) => {
    const storeName = match.params.id.replace(/-/g, ' ');
    dispatch({
      type: types.UPDAGTE_DELIVERY_INFO,
      payload: {
        ...deliveryData,
        type: transType,
        storeName,
      },
    });
    hideModal();
  };

  return (
    <>
      <Modal
        show={isShow}
        onHide={() => {
          hideModal(false);
        }}
        size="md"
        centered
        backdrop="static"
      >
        <Modal.Body className="pt-5 mb-0">
          <h3 className="mb-0 text-center">How would you like to order?</h3>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center border-0 pb-5">
          {_.get(storeInfo, 'fullfillment_type', {
            delivery: false,
            pickup: false,
          }).pickup && (
            <Button
              variant="outline-primary"
              onClick={() => {
                clickFullFillMent(CONSTANTS.ORDER_TRANS_TYPE.COLLECTION);
              }}
              className="ht-btn-outline-primary mr-2"
            >
              Pickup
            </Button>
          )}
          {_.get(storeInfo, 'fullfillment_type', {
            delivery: false,
            pickup: false,
          }).delivery && (
            <Button
              variant="primary"
              onClick={() => {
                clickFullFillMent(CONSTANTS.ORDER_TRANS_TYPE.DELIVERY);
                setTimeout(() => {
                  setShowDeliveryDetailModal(true);
                }, 100);
              }}
              className="ht-btn-primary ml-2"
            >
              Delivery
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <DeliveryDetailModal
        isShow={showDeliverDetailModal}
        hideModal={() => {
          setShowDeliveryDetailModal(false);
        }}
      />
    </>
  );
};

export default DeliveryTypeModal;
