import axios from 'axios';
import * as types from './actionTypes';
import * as CONSTANTS from '../../constants';

export const getStoreAction = (id) => (dispatch) => {
  dispatch({
    type: types.REQUEST_GET_STORE,
  });

  try {
    dispatch({
      type: types.GET_STORE_SUCCESS,
    });
  } catch (err) {
    dispatch({
      type: types.GET_STORE_ERROR,
    });
  }
};

export const getStoreListAction = () => (dispatch) => {
  try {
    axios
      .get('/store/all', CONSTANTS.getToken())
      .then((res) => {
        dispatch({
          type: types.GET_STORE_LIST_SUCCESS,
          payload: res.data.stores,
        });
      })
      .catch((err) => {
        console.log('Get Store List API Error');
      });
  } catch (err) {
    console.log('Get Store List Error');
  }
};

export const createStoreAction = (newStore) => (dispatch) => {
  dispatch({
    type: types.CREATE_STORE_SUCCESS,
    payload: newStore,
  });
};

export const updateStoreAction = (updatedStore) => (dispatch) => {
  dispatch({
    type: types.UPDATE_STORE_SUCCESS,
    payload: updatedStore,
  });
};
