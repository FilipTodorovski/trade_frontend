import {
  NEW_ORDER_COME,
  ORDER_STORE_ID,
  ADD_UNREAD_ORDER,
  SET_UNREAD_ORDER,
  DELETE_UNREAD_ORDER,
} from '../actions/actionTypes';
import initialState from '../../reducers/initialState';

export default (state = initialState.order, action) => {
  switch (action.type) {
    case NEW_ORDER_COME:
      return {
        ...state,
        newOrderCount: state.newOrderCount + action.payload,
      };
    case ORDER_STORE_ID:
      return {
        ...state,
        storeId: action.payload,
      };
    case ADD_UNREAD_ORDER:
      return {
        ...state,
        unreadOrder: [...state.unreadOrder, action.payload],
      };
    case SET_UNREAD_ORDER:
      return {
        ...state,
        unreadOrder: action.payload,
      };
    case DELETE_UNREAD_ORDER:
      return {
        ...state,
        unreadOrder: [
          ...state.unreadOrder.filter(
            (item) => item.store_id !== action.payload
          ),
        ],
      };
    default:
      return state;
  }
};
