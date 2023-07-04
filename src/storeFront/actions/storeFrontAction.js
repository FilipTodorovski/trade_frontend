import * as types from './actionTypes';

export const getStoreFrontMenuListAction = (listOne) => (dispatch) => {
  dispatch({
    type: types.STORE_FRONT_MENU_LIST,
    payload: listOne,
  });
};

export const getStoreInfoAction = (storeInfo) => (dispatch) => {
  dispatch({
    type: types.STORE_FRONT_STORE_INFO,
    payload: storeInfo,
  });
};

export const addProductCartAction = (newOrder) => (dispatch) => {
  dispatch({
    type: types.ADD_PRODUCT_TO_CART,
    payload: newOrder,
  });
};

export const emptyProductCardAction = () => (dispatch) => {
  dispatch({
    type: types.EMPTY_PRODUCT_TO_CART,
    payload: [],
  });
};

export const updateDeliveryInfoAction = (newOne) => (dispatch) => {
  dispatch({
    type: types.UPDAGTE_DELIVERY_INFO,
    payload: newOne,
  });
};

export const getGeoStoreListAction = (newList) => (dispatch) => {
  dispatch({
    type: types.GET_LOCATION_STORE_LIST,
    payload: newList,
  });
};
