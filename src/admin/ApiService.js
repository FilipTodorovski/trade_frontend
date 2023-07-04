import axios from 'axios';
import CONFIG from '../config';

const ApiService = async (requestData) => {
  return new Promise((resolve, reject) => {
    axios({
      ...requestData,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        if (
          err &&
          err.response &&
          err.response.status &&
          err.response.status === 401
        ) {
          window.location.href = `${CONFIG.BASE_URL}/login`;
          return;
        }
        reject(err);
      });
  });
};

export default ApiService;
