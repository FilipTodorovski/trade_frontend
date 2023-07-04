import axios from 'axios';
import { getCustomerToken } from 'utils/tokens';

export const getCustomerOrdersApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/order/all',
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
