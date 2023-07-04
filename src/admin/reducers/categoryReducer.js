import * as types from '../actions/actionTypes';
import initialState from '../../reducers/initialState';

export default (state = initialState.category, action) => {
  switch (action.type) {
    case types.GET_CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        list: [...action.payload],
        listLoaded: true,
      };
    case types.CREATE_CATEGORY_SUCCESS:
      return {
        ...state,
        list: [action.payload, ...state.list],
      };
    case types.DELETE_CATEGORY_SUCCESS:
      return {
        ...state,
        list: [...state.list.filter((item) => item.id !== action.payload)],
      };
    case types.UPDATE_CATEGORY_SUCCESS:
      return {
        ...state,
        list: [
          ...state.list.map((item) => {
            if (item.id === action.payload.id) return action.payload;
            return item;
          }),
        ],
      };
    default:
      return state;
  }
};
