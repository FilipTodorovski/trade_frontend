import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Modal } from 'react-bootstrap';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import CheckoutForm from './CheckoutForm';
import OrderInfo from './OrderInfo';
import HtSpinner from 'admin/components/HtSpinner';
import { getDeliveryFee } from 'utils/store';
import { getOrderListTotalPrice } from 'utils/order';

import * as types from '../../../../actions/actionTypes';
import * as CONSTANTS from 'constants/constants';

const CheckoutPayPage = ({ history }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { storeInfo, deliveryData, orderList } = useSelector((state) => ({
    storeInfo: state.storeFrontReducer.store,
    deliveryData: state.storeFrontReducer.deliveryData,
    orderList: state.storeFrontReducer.orderList,
  }));

  const [showFailedModal, setShowFailedModal] = useState(false);
  const [failedMsg, setFailedMsg] = useState('');

  const [deliveryFee, setDeliveryFee] = useState(0);

  // get delivery fee
  useEffect(() => {
    if (
      Object.keys(storeInfo).length === 0 &&
      storeInfo.constructor === Object
    ) {
      history.goBack();
    }

    const getDeliveryFeeValue = async () => {
      const deliveryFeeValue = await getDeliveryFee(
        storeInfo,
        deliveryData.postcode
      );
      setDeliveryFee(deliveryFeeValue);
    };
    if (deliveryData.postcode.length > 0 && Object.keys(storeInfo).length > 0)
      getDeliveryFeeValue();
  }, [storeInfo, deliveryData.postcode]); // eslint-disable-line

  useEffect(() => {
    const amount =
      getOrderListTotalPrice(storeInfo, orderList) +
      (deliveryFee >= 0 ? deliveryFee : 0);
    dispatch({
      type: types.ADYEN_UPDATE_AMOUNT,
      payload: amount * 100,
    });
  }, [storeInfo, orderList, deliveryFee]); // eslint-disable-line

  // const getDeliveryPickupTime = () => {
  //   if (deliveryData.type === CONSTANTS.ORDER_TRANS_TYPE.DELIVERY)
  //     return storeInfo.delivery_prep_time;
  //   if (deliveryData.type === CONSTANTS.ORDER_TRANS_TYPE.COLLECTION)
  //     return storeInfo.pickup_prep_time;
  //   return storeInfo.delivery_prep_time;
  // };

  return (
    <CheckoutContainer>
      <div className="container">
        <h3 className="store-title">{storeInfo.name || ''}</h3>

        <Row>
          <Col lg="8" className="mt-4">
            <Row>
              <Col md="12">
                <CheckoutForm
                  success={(isSuccess, failMsg, orderNumber) => {
                    if (isSuccess)
                      history.push(
                        `/confirm-order/${btoa(storeInfo.menu.id)}/${btoa(
                          orderNumber
                        )}`
                      );
                    else {
                      setShowFailedModal(true);
                      setFailedMsg(failMsg);
                    }
                    setLoading(false);
                  }}
                  deliveryFee={deliveryFee}
                  setDeliveryFee={(updatedFee) => setDeliveryFee(updatedFee)}
                  setLoading={(newLoading = true) => setLoading(newLoading)}
                />
              </Col>
            </Row>
          </Col>
          <Col lg="4" className="mt-4 mb-5">
            <Row>
              <Col md="12">
                <OrderInfo deliveryFee={deliveryFee} />
              </Col>
            </Row>
          </Col>
        </Row>

        <Modal
          show={showFailedModal}
          onHide={() => {
            setShowFailedModal(false);
            setTimeout(() => {
              history.push(`/${storeInfo.name}/menu`);
            }, 100);
          }}
          centered
        >
          <Modal.Body className="d-flex flex-column justify-content-center align-items-center p5">
            <h3 style={{ color: CONSTANTS.PRIMARY_RED_COLOR }}>Failed</h3>
            <p>{failedMsg}</p>
          </Modal.Body>
        </Modal>
        {loading && <HtSpinner />}
      </div>
    </CheckoutContainer>
  );
};

const CheckoutContainer = styled.div`
  background-color: ${CONSTANTS.LIGHTEST_PURPLE_COLOR};
  padding: 40px 0;

  h3.store-title {
    font-style: normal;
    font-weight: 600;
    font-size: 34px;
    line-height: 41px;
  }
`;

export default withRouter(CheckoutPayPage);
