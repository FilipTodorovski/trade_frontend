import { ORDER_TRANS_TYPE } from 'constants/constants';
import get from 'lodash/get';

export const getOrderedGroupPrice = (orderedGroup) => {
  let groupPrice = 0;
  if (orderedGroup.items && orderedGroup.items.length > 0)
    orderedGroup.items.forEach((item) => {
      groupPrice += parseFloat(item.price) * get(item, 'qty', 1);
    });
  return groupPrice;
};

export const getOrderedProductPrice = (orderedProduct) => {
  let sumOfGroups = 0;
  get(orderedProduct, 'groups', []).forEach((groupOrder) => {
    sumOfGroups += getOrderedGroupPrice(groupOrder);
  });

  return (sumOfGroups + orderedProduct.price) * orderedProduct.qty;
};

export const getOrderListTotalPrice = (storeInfo, orderList) => {
  if (!orderList) return 0;
  let totalValue = 0;
  orderList.forEach((orderedProduct) => {
    totalValue += getOrderedProductPrice(orderedProduct);
  });
  return totalValue === 0 ? '' : totalValue;
};

export const getDefaultOrderTime = (storeInfo, deliverData) => {
  if (deliverData.type === ORDER_TRANS_TYPE.DELIVERY) {
    return new Date(
      new Date().valueOf() + storeInfo.delivery_prep_time * 60 * 1000
    );
  }
  if (deliverData.type === ORDER_TRANS_TYPE.COLLECTION) {
    return new Date(
      new Date().valueOf() + storeInfo.pickup_prep_time * 60 * 1000
    );
  }
};

export const getItemCountOfSelectedGroup = (groupOrder) => {
  if (!groupOrder) return 0;
  return groupOrder.reduce((total, obj) => (obj.qty ? obj.qty : 0) + total, 0);
};

export const renderGroupOrderItems = (items) => {
  if (!items || items.length === 0) return null;
  return items
    .map((groupItem) => {
      if (groupItem.qty && groupItem.qty > 1)
        return `${groupItem.name} x ${groupItem.qty}`;
      else return groupItem.name;
    })
    .join(', ');
};
