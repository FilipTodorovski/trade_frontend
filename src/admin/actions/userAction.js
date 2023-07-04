import * as types from './actionTypes';

export const loginUserAction = (user) => (dispatch) => {
  dispatch({
    type: types.LOGIN_SUCCESS,
    payload: user,
  });
};

export const registerUserAction = (user) => (dispatch) => {
  dispatch({
    type: types.REGISTER_SUCCESS,
    payload: user,
  });
};

export const updateUserAction = (user) => (dispatch) => {
  dispatch({
    type: types.UPDATE_USERINFO,
    payload: user,
  });
};
