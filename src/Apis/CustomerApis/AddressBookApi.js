import axios from 'axios';
import { getCustomerToken } from 'utils/tokens';

export const createAddressBookApi = (address) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `/addressbook`,
      data: address,
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

export const getAddressBookApi = (id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `/addressbook/${id}`,
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

export const getSelectedAddressApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/addressbook/get/selected',
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

export const selectAddressBookApi = (id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      url: `/addressbook/select/${id}`,
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

export const removeAddressBookApi = (id) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'DELETE',
      url: `/addressbook/${id}`,
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
