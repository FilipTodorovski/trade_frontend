import moment from 'moment';

export const LIMIT_VIEW_INFO_COUNT = 10;
export const FULLFILLMENT_DELIVERY = 'Delivery';
export const FULLFILLMENT_PICKUP = 'Pickup';

export const ChangeHoursTo12 = (hourValue, minValue) => {
  const AmOrPm = parseInt(hourValue) >= 12 ? 'pm' : 'am';
  const hour = parseInt(hourValue) % 12 || 12;
  return `${`0${hour}`.slice(-2)}:${`0${minValue}`.slice(-2)} ${AmOrPm}`;
};

export const GetNextOpenTime = (openingHours, dayIndex) => {
  for (let i = dayIndex + 1; i < dayIndex + 1 + 7; i++) {
    if (openingHours[i > 7 ? i - 7 : i][4]) {
      const momentOne = moment();
      momentOne.hours(openingHours[i][0] ? parseInt(openingHours[i][0]) : 0);
      momentOne.minutes(openingHours[i][1] ? parseInt(openingHours[i][1]) : 0);
      if (i - dayIndex === 1) return `${momentOne.format('hh:mm a')} tomorrow`;

      return `${momentOne.format('hh:mm a')} after ${i - dayIndex}days `;
    }
  }
  return 'Closed';
};
