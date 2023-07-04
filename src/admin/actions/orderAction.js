import axios from 'axios';
import * as types from './actionTypes';
import * as CONSTANTS from '../../constants';

export const createOrderAction = (newOrder) => (dispatch) => {
  dispatch({
    type: types.CREATE_ORDER_SUCCESS,
    payload: newOrder,
  });
};

export const getOrderListAction = () => (dispatch) => {
  axios
    .get('/order/all', CONSTANTS.getToken())
    .then((res) => {
      if (res.data.success)
        dispatch({
          type: types.GET_ORDER_LIST_SUCCESS,
          payload: res.data.orders,
        });
      else console.log('Error occured when get order list');
    })
    .catch((err) => {
      console.log('Error occured when get order list');
    });
};
