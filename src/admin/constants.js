import moment from 'moment';

export const SLOTS_VALUE_ARRAY = [5, 10, 15, 20, 30];
export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const LAST_28_DAYS = 'Last 28 Days';
export const LAST_7_DAYS = 'Last 7 Days';
export const YESTERDAY = 'Yesterday';
export const TODAY = 'Today';

export const ORDER_TRANS_TYPE = {
  VIEW: 0,
  DELIVERY: 1,
  PICKUP: 2,
};
export const ORDER_STATUS = {
  PENDING: 0,
  ACCEPTED: 1,
  REJECTED: 2,
  PREPARIING: 3,
  READY: 4,
  DELIVERY_PICKUP: 5,
  COMPLETED: 6,
};
export const ORDER_PAYMENT_METHOD = {
  CARD: 'Card',
  CASH: 'Cash on Delivery',
};

export const getToken = () => {
  return {
    headers: {
      Authorization: localStorage.token,
    },
  };
};

export const STORE_INFORMATION_SECTION = 'Information';
export const STORE_AREAFEES_SECTION = 'Area & Fees';

export const MENU_OVERVIEW_SECTION = 'Overview';
export const MENU_MENUS_SECTION = 'Catalogues';
export const MENU_CATEGORIES_SECTION = 'Categories';
export const MENU_ITEMS_SECTION = 'Products';
export const MENU_GROUP_OPTIONS = 'Variations';

export const ORDER_NEW = 'New order';
export const ORDER_PREPARING = 'Preparing';
export const ORDER_READY = 'Ready';
export const ORDER_DELIVERY_PICKUP = 'Delivery/Pickup';
export const ORDER_COMPLETED = 'Completed';

export const ORDER_STATUS_NEW = 0;
export const ORDER_STATUS_ACCEPT = 1;
export const ORDER_STATUS_READY = 2;
export const ORDER_STATUS_DELIVERY_PICKUP = 3;
export const ORDER_STATUS_COMPLETED = 4;
export const ORDER_STATUS_REJECTED = 9;

export const getOrderStatus = (curSection) => {
  switch (curSection) {
    case ORDER_NEW:
      return 0;
    case ORDER_PREPARING:
      return 1;
    case ORDER_READY:
      return 2;
    case ORDER_DELIVERY_PICKUP:
      return 3;
    case ORDER_COMPLETED:
      return [4, 9];
    default:
      return 0;
  }
};

export const PRIMARY_DARK_COLOR = '#272848';
export const PRIMARY_GREY_COLOR = '#8e93a2';
export const PRIMARY_RED_COLOR = '#e85757';
export const PRIMARY_ACTIVE_COLOR = '#213f5e';
export const PRIMARY_ACTIVE_BACK_COLOR = 'rgba(241, 246, 255, 1)';
export const SECOND_GREY_COLOR = '#66657e';
export const BORDER_GREY_COLOR = '#c7c7c7';
export const BACKGROUND_GREY_COLOR = '#e9e9e9';
export const LIGHTEST_PURPLE_COLOR = '#F1F6FF';
export const ACTIVE_GREEN_COLOR = '#27ae60';

export const ADYEN_PAYMENT_TYPE = 'card';

export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getTwoIntString = (nNumber) => {
  return nNumber.toString().padStart(2, '0');
};

export const getLastUpdateHours = (updated) => {
  const curMoment = moment(new Date());
  const diffMoment = moment(new Date(updated));
  const diffValue = curMoment.diff(diffMoment);

  const diffDays = parseInt(diffValue / (1000 * 60 * 60 * 24));
  if (diffDays > 0)
    return `Last Updated ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  const diffHours = parseInt(
    (diffValue % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  if (diffHours > 0)
    return `Last Updated ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffMinutes = parseInt((diffValue % (1000 * 60 * 60)) / (60 * 1000));
  if (diffMinutes > 0)
    return `Last Update ${diffMinutes} minute ${
      diffMinutes > 1 ? 's' : ''
    } ago`;
  return 'Just Updated';
};

export const getTimeDiffInMinutes = (end) => {
  const startTime = moment(new Date());
  const endTime = moment(new Date(end));
  const duration = moment.duration(endTime.diff(startTime));
  const diffMinutes = parseInt(duration.asMinutes());
  if (diffMinutes <= 0) return 0;
  return diffMinutes;
};

export const DEFAULT_DELIVERY_IN_MINUTES = 45;
