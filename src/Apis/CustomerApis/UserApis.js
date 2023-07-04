import axios from 'axios';
import { getCustomerToken } from 'utils/tokens';

export const getMeApi = () => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: '/userwithtoken',
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

export const checkCustomerApi = (email) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: '/user/filter',
      data: {
        email,
      },
    })
      .then((response) => {
        console.log(response);
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};

export const changePasswordApi = (passwordData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      url: '/user/update/password',
      data: {
        ...passwordData,
      },
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateUserDetailsApi = (userId, userData) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      url: `/user/${userId}`,
      data: {
        ...userData,
      },
      headers: {
        Authorization: getCustomerToken(),
      },
    })
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const checkResetPwdTokenApi = (pwdToken) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'GET',
      url: `/resetpassword/${pwdToken}`,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const createResetPwdTokeApi = (email) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'POST',
      url: `/resetpassword`,
      data: {
        email,
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const resetPasswordApi = (token, newPassword) => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'PUT',
      url: `/resetpassword/${token}`,
      data: {
        password: newPassword,
      },
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
