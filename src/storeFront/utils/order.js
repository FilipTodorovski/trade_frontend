import _ from 'lodash';
import * as CONSTANTS from '../../constants';

export const getOrderItemTotalPrice = (orderItem) => {
  let groupItemPrice = 0;
  if (orderItem.items && orderItem.items.length > 0)
    orderItem.items.forEach((groupItem) => {
      groupItemPrice += parseFloat(groupItem.price);
    });
  return orderItem.quantity * (parseFloat(orderItem.price) + groupItemPrice);
};

export const getOrderListTotalPrice = (storeInfo, orderList) => {
  if (!orderList) return 0;
  let totalValue = 0;
  orderList.forEach((item) => {
    totalValue += getOrderItemTotalPrice(item);
  });
  return totalValue === 0 ? '' : totalValue;
};

export const getDefaultOrderTime = (storeInfo, deliverData) => {
  if (deliverData.type === CONSTANTS.ORDER_TRANS_TYPE.DELIVERY) {
    return new Date(
      new Date().valueOf() + storeInfo.delivery_prep_time * 60 * 1000
    );
  }
  if (deliverData.type === CONSTANTS.ORDER_TRANS_TYPE.COLLECTION) {
    return new Date(
      new Date().valueOf() + storeInfo.pickup_prep_time * 60 * 1000
    );
  }
};
