import moment from 'moment';

export const endOfDay = (date = new Date()) => {
  const endMomentDay = moment(date.valueOf()).endOf('day');
  return new Date(endMomentDay.valueOf());
};
