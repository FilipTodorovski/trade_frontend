import * as types from '../actions/actionTypes';
import initialState from '../../reducers/initialState';

export default (state = initialState.store, action) => {
  switch (action.type) {
    case types.GET_STORE_LIST_SUCCESS:
      return {
        ...state,
        list: [...action.payload],
        listLoaded: true,
      };
    case types.CREATE_STORE_SUCCESS:
      return {
        ...state,
        list: [action.payload, ...state.list],
      };
    case types.UPDATE_STORE_SUCCESS:
      return {
        ...state,
        list: [
          ...state.list.map((item) => {
            if (item.id === action.payload.id)
              return { ...item, ...action.payload };
            return item;
          }),
        ],
      };
    default:
      return state;
  }
};
