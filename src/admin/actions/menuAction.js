import axios from 'axios';
import * as types from './actionTypes';
import * as CONSTANTS from '../../constants';

export const createMenuAction = (newMenu) => (dispatch) => {
  dispatch({
    type: types.CREATE_MENU_SUCCESS,
    payload: newMenu,
  });
};

export const getMenuListAction = () => (dispatch) => {
  axios
    .get('/menu/all', CONSTANTS.getToken())
    .then((res) => {
      if (res.data.success)
        dispatch({
          type: types.GET_MENU_LIST_SUCCESS,
          payload: res.data.menus,
        });
      else console.log('Error occured when get menu list');
    })
    .catch((err) => {
      console.log('Error occured when get menu list');
    });
};

export const setMenuIdAction = (menuId) => (dispatch) => {
  dispatch({
    type: types.SET_MENU_ID,
    payload: menuId,
  });
};

export const updateMenuAction = (updatedMenu) => (dispatch) => {
  dispatch({
    type: types.UPDATE_MENU_SUCCESS,
    payload: updatedMenu,
  });
};

export const deleteMenuAction = (deletedId) => (dispatch) => {
  dispatch({
    type: types.DELETE_MENU_SUCCESS,
    payload: deletedId,
  });
};
