import axios from 'axios';

export const getAddresses = (postcode) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `/order/address/${postcode}`,
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        resolve(err);
      });
  });
};
