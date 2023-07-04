import axios from 'axios';
import * as types from './actionTypes';
import * as CONSTANTS from '../../constants';

export const createCategoryAction = (newCategory) => (dispatch) => {
  dispatch({
    type: types.CREATE_CATEGORY_SUCCESS,
    payload: newCategory,
  });
};

export const updateCategoryAction = (newCategory) => (dispatch) => {
  dispatch({
    type: types.UPDATE_CATEGORY_SUCCESS,
    payload: newCategory,
  });
};

export const deleteCategoryAction = (id) => (dispatch) => {
  dispatch({
    type: types.DELETE_CATEGORY_SUCCESS,
    payload: id,
  });
};

export const getCategoryListAction = (menu_id) => (dispatch) => {
  axios
    .get(`/category/${menu_id}`, CONSTANTS.getToken())
    .then((res) => {
      if (res.data.success)
        dispatch({
          type: types.GET_CATEGORY_LIST_SUCCESS,
          payload: res.data.categories,
        });
      else console.log('Error occured when get category list');
    })
    .catch((err) => {
      console.log('Error occured when get category list');
    });
};
