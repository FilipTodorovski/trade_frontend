import * as types from '../actions/actionTypes';
import initialState from '../../reducers/initialState';

export default (state = initialState.storeFront, action) => {
  switch (action.type) {
    case types.STORE_FRONT_MENU_LIST:
      return {
        ...state,
        menu: { ...action.payload },
      };
    case types.STORE_FRONT_STORE_INFO:
      return {
        ...state,
        store: { ...action.payload },
      };
    case types.ADD_PRODUCT_TO_CART:
      return {
        ...state,
        orderList: [action.payload, ...state.orderList],
      };
    case types.UPDATE_PRODUCT_TO_CART:
      const updatedProduct = action.payload;
      let newOrderList = [];
      if (action.payload.qty === 0)
        newOrderList = state.orderList.filter(
          (item) => item.id !== updatedProduct.id
        );
      else
        newOrderList = state.orderList.map((item) => {
          if (item.id === updatedProduct.id) return updatedProduct;
          return item;
        });
      return {
        ...state,
        orderList: [...newOrderList],
      };
    case types.EMPTY_PRODUCT_TO_CART:
      return {
        ...state,
        orderList: [],
      };
    case types.UPDAGTE_DELIVERY_INFO:
      localStorage.setItem(
        'fullFillmentType',
        JSON.stringify({
          ...state.deliveryData,
          ...action.payload,
        })
      );
      return {
        ...state,
        deliveryData: {
          ...state.deliveryData,
          ...action.payload,
        },
      };
    case types.GET_LOCATION_STORE_LIST:
      return {
        ...state,
        storeList: [...action.payload],
      };
    case types.SET_POSTCODE_FOR_CHECKOUT:
      return {
        ...state,
        postcode: action.payload,
      };
    case types.ADYEN_GET_CONFIG:
      return {
        ...state,
        payment: {
          ...state.payment,
          config: {
            ...state.payment.config,
            ...action.payload,
          },
        },
      };
    case types.ADYEN_GET_PAYMENTMETHODS: {
      const [res, status] = action.payload;
      if (status >= 300) {
        return {
          ...state,
          payment: {
            ...state.payment,
            error: res,
          },
        };
      }
      return {
        ...state,
        payment: {
          ...state.payment,
          paymentMethodsRes: res,
        },
      };
    }
    case types.ADYTEN_INIT_PAYMENT: {
      const [res, status] = action.payload;
      if (status > 300) {
        return {
          ...state,
          payment: {
            ...state.payment,
            error: res,
          },
        };
      }
      return {
        ...state,
        payment: {
          ...state.payment,
          paymentRes: res,
        },
      };
    }
    case types.ADYEN_UPDATE_AMOUNT: {
      const { payment } = state;
      payment.config.paymentMethodsConfiguration.card.amount.value =
        action.payload;
      return {
        ...state,
        payment: {
          ...payment,
        },
      };
    }
    case types.SET_CUSTOMER_USER: {
      localStorage.setItem('customer-token', action.payload.token);
      return {
        ...state,
        user: {
          ...action.payload.user,
        },
      };
    }
    case types.CUSTOMER_LOGOUT: {
      localStorage.setItem('customer-token', '');
      return {
        ...state,
        user: {},
      };
    }
    default:
      return state;
  }
};
