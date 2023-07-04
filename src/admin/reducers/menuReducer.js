import * as types from '../actions/actionTypes';
import initialState from '../../reducers/initialState';

export default (state = initialState.menu, action) => {
  switch (action.type) {
    case types.GET_MENU_LIST_SUCCESS:
      return {
        ...state,
        list: [...action.payload],
        listLoaded: true,
        menuId: action.payload.length > 0 ? action.payload[0].id : -1,
      };
    case types.CREATE_MENU_SUCCESS:
      return {
        ...state,
        list: [...state.list, action.payload],
      };
    case types.UPDATE_MENU_SUCCESS:
      return {
        ...state,
        list: [
          ...state.list.map((item) => {
            if (item.id === action.payload.id) return action.payload;
            return item;
          }),
        ],
      };
    case types.DELETE_MENU_SUCCESS:
      return {
        ...state,
        list: [...state.list.filter((item) => item.id !== action.payload)],
      };
    case types.SET_MENU_ID:
      return {
        ...state,
        menuId: action.payload,
      };
    default:
      return state;
  }
};
