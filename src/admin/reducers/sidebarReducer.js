import * as types from '../actions/actionTypes';
import initialState from '../../reducers/initialState';

export default (state = initialState.sidebar, action) => {
  switch (action.type) {
    case types.UPDATE_SIDEBAR_COLLAPSE:
      return {
        ...state,
        collapse: action.payload,
      };
    default:
      return state;
  }
};
