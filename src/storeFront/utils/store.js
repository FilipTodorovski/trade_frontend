import _ from 'lodash';
import moment from 'moment';

export const checkStoreOpenNow = (storeInfo) => {
  const curDate = new Date();
  const dayIndex = curDate.getDay();

  const acceptOrder = _.get(storeInfo, 'accept_order', false);
  if (acceptOrder === false) return false;

  const openingHours = _.get(storeInfo, 'opening_hours', []);
  if (openingHours.length <= 0) {
    return false;
  }

  const hh1 = openingHours[dayIndex][0]
    ? parseInt(openingHours[dayIndex][0])
    : 0;
  const mm1 = openingHours[dayIndex][1]
    ? parseInt(openingHours[dayIndex][1])
    : 0;
  const hh2 = openingHours[dayIndex][2]
    ? parseInt(openingHours[dayIndex][2])
    : 23;
  const mm2 = openingHours[dayIndex][3]
    ? parseInt(openingHours[dayIndex][3])
    : 59;

  if (openingHours[dayIndex][4]) {
    const moment1 = moment(new Date());
    moment1.hours(hh1);
    moment1.minutes(mm1);

    const moment2 = moment(new Date());
    moment2.hours(hh2);
    moment2.minutes(mm2);

    if (
      curDate.valueOf() >= moment1.valueOf() &&
      curDate.valueOf() < moment2.valueOf()
    ) {
      return true;
    }
  }
  return false;
};
