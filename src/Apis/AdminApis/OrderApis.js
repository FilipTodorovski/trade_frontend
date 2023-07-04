import axios from 'axios';
import CONFIG from '../../config';
import { getAdminToken } from 'utils/tokens';

export const getUnreadOrderApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/order/user/unread',
      headers: {
        Authorization: getAdminToken(),
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

export const getNewOrderCountApi = () => {
  return new Promise((resolve, reject) => {
    const elasticBasicToken = Buffer.from(
      `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
    ).toString('base64');

    axios({
      method: 'GET',
      url: '/order/_count',
      headers: {
        Authorization: `Basic ${elasticBasicToken}`,
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        console.log(" - - - -", JSON.stringify(response))
        resolve(response);
      })
      .catch((error) => {
        reject(false);
      });
  });
};

export const deletelUnreadOrderApi = (storeId) => {
  const token = localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    axios({
      method: 'DELETE',
      url: '/order/user/unread',
      data: {
        store_id: storeId,
      },
      headers: {
        Authorization: getAdminToken(),
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
