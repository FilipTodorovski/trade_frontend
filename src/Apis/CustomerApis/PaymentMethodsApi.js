import axios from 'axios';
import { getCustomerToken } from 'utils/tokens';

export const getPaymentsTokenApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/customer-carts',
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const getSelectedPaymentIdApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/customer-carts/selected',
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const getSelectedPaymentInfoApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/customer-carts/selected',
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const selectPaymentTokenApi = (paymentTokenId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      url: `/customer-carts/${paymentTokenId}`,
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const removePaymentmethodApi = (paymentTokenId) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'DELETE',
      url: `/customer-carts/${paymentTokenId}`,
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(false);
      });
  });
};
