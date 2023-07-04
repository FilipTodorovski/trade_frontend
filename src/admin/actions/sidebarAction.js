import * as types from './actionTypes';

export const updateSidebarCollpaseAction = (newOne) => (dispatch) => {
  dispatch({
    type: types.UPDATE_SIDEBAR_COLLAPSE,
    payload: newOne,
  });
};
