import axios from 'axios';
import {
  ADYEN_GET_CONFIG,
  ADYEN_GET_PAYMENTMETHODS,
  ADYTEN_INIT_PAYMENT,
  ADYEN_SUBMIT_ADDITIONAL_DETAILS,
} from './actionTypes';
import CONFIG from '../../config';

export const getAdyenConfig = () => async (dispatch) => {
  const response = await axios.get(`${CONFIG.API_URL}/adyen/config`);
  dispatch({ type: ADYEN_GET_CONFIG, payload: response.data });
};

export const getPaymentMethods = (customerId) => async (dispatch) => {
  const responseConfig = await axios.get(`${CONFIG.API_URL}/adyen/config`);
  dispatch({ type: ADYEN_GET_CONFIG, payload: responseConfig.data });

  const responsePayment = await fetch(
    `${CONFIG.API_URL}/adyen/getPaymentMethods`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer_id: customerId,
      }),
    }
  );
  dispatch({
    type: ADYEN_GET_PAYMENTMETHODS,
    payload: [await responsePayment.json(), responsePayment.status],
  });
};

export const initiatePayment = (data) => async (dispatch) => {
  const response = await fetch(`${CONFIG.API_URL}/adyen/initiatePayment`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  dispatch({
    type: ADYTEN_INIT_PAYMENT,
    payload: [await response.json(), response.status],
  });
};

export const submitAdditionalDetails = (data) => async (dispatch) => {
  const response = await fetch(
    `${CONFIG.API_URL}/adyen/submitAdditionalDetails`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  dispatch({
    type: ADYEN_SUBMIT_ADDITIONAL_DETAILS,
    payload: [await response.json(), response.status],
  });
};
