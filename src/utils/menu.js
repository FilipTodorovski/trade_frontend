import _ from 'lodash';
import moment from 'moment';

export const checkStoreOpenNow = (storeInfo) => {
  const menu = _.get(storeInfo, 'menu', undefined);
  if (!menu) return false;

  let openHours = _.get(menu, 'open_hours', []);
  if (openHours.length === 0) return false;

  openHours = openHours.map((item) => {
    const dayArray = item[0].map((dayItem) => {
      if (dayItem === 6) return 0;
      else return dayItem + 1;
    });
    return [dayArray, item[1]];
  });

  const curDate = new Date();
  const dayIndex = curDate.getDay();

  const acceptOrder = parseInt(_.get(storeInfo, 'online_status', 1));
  if (acceptOrder !== 0) return false;

  const dayAvailable = [];
  openHours.forEach((openHourItem) => {
    openHourItem[0].forEach((item) => {
      if (item === dayIndex) {
        openHourItem[1].forEach((availableItem) => {
          const startDate = moment(new Date());
          const endDate = moment(new Date());
          startDate.set({
            hour: availableItem.start[0],
            minute: availableItem.start[1],
            second: 0,
            millisecond: 0,
          });
          endDate.set({
            hour: availableItem.end[0],
            minute: availableItem.end[1],
            second: 59,
            millisecond: 999,
          });
          dayAvailable.push({
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf(),
          });
        });
      }
    });
  });

  if (dayAvailable.length === 0) return false;

  const curDateValue = new Date().valueOf();

  let isOpen = false;
  dayAvailable.forEach((item) => {
    if (item.startDate <= curDateValue && curDateValue <= item.endDate)
      isOpen = true;
  });
  return isOpen;
};

export const getOpeningTime = (storeInfo) => {
  const acceptOrder = _.get(storeInfo, 'online_status', 1);
  if (acceptOrder !== 0) return 'Closed';

  const menu = _.get(storeInfo, 'menu', undefined);
  if (!menu) return 'Closed';

  let openHours = _.get(menu, 'open_hours', []);
  if (openHours.length === 0) return 'Closed';

  openHours = openHours.map((item) => {
    const dayArray = item[0].map((dayItem) => {
      if (dayItem === 6) return 0;
      else return dayItem + 1;
    });
    return [dayArray, item[1]];
  });

  const curDayIndex = new Date().getDay();

  let dayAvailable = [];
  openHours.forEach((openHourItem) => {
    openHourItem[0].forEach((item) => {
      dayAvailable.push({
        dayIndex: item,
        values: openHourItem[1],
      });
    });
  });

  dayAvailable = [...dayAvailable.sort((a, b) => a.dayIndex - b.dayIndex)];

  if (Object.keys(dayAvailable).length === 0) return 'Closed';

  const curDateValue = new Date().valueOf();

  let returnStr = '';

  for (let i = curDayIndex; i < curDayIndex + 7; i++) {
    if (returnStr.length > 0) return returnStr;

    const dayIndexTemp = i > 6 ? i - 6 : i;
    const curDayAvailable = dayAvailable.filter(
      (item) => item.dayIndex === dayIndexTemp
    );
    if (curDayAvailable.length === 0) continue;

    curDayAvailable[0].values.forEach((item) => {
      if (returnStr.length !== 0) return;
      const startDate = moment(new Date());
      const endDate = moment(new Date());
      startDate.set({
        hour: item.start[0],
        minute: item.start[1],
        second: 0,
        millisecond: 0,
      });
      endDate.set({
        hour: item.end[0],
        minute: item.end[1],
        second: 59,
        millisecond: 999,
      });
      if (curDateValue < startDate.valueOf())
        returnStr = `Closed until ${startDate.format('hh:mm a')}`;
      else if (curDateValue < endDate.valueOf())
        returnStr = `Opened until ${endDate.format('hh:mm a')}`;
    });
  }
  if (returnStr.length === 0) return 'Closed';
};

export const getSelectedDayHours = (storeInfo, dayIndex) => {
  const menu = _.get(storeInfo, 'menu', undefined);
  if (!menu) return [];

  let openHours = _.get(menu, 'open_hours', []);
  if (openHours.length === 0) return [];

  openHours = openHours.map((item) => {
    const dayArray = item[0].map((dayItem) => {
      if (dayItem === 6) return 0;
      else return dayItem + 1;
    });
    return [dayArray, item[1]];
  });

  let filteredOne = [];
  openHours.forEach((item) => {
    if (_.includes(item[0], dayIndex)) filteredOne = [...item[1]];
  });
  return filteredOne;
};

export const checkIsInDayHours = (storeInfo, dayIndex, selectedTime) => {
  const curDate = new Date().valueOf();
  const openHours = getSelectedDayHours(storeInfo, dayIndex);
  if (!openHours || openHours.length === 0) return false;

  const startDate = moment(new Date(selectedTime)).startOf('day');
  const endDate = moment(new Date(selectedTime)).endOf('day');
  for (let i = 0; i < openHours.length; i++) {
    const item = openHours[i];
    startDate.set({ hour: item.start[0], minute: item.start[1] });
    endDate.set({ hour: item.end[0], minute: item.end[1] });
    if (
      startDate.valueOf() <= selectedTime &&
      selectedTime + 30 * 60 * 1000 <= endDate.valueOf() &&
      selectedTime >= curDate
    ) {
      return true;
    }
  }

  return false;
};

// return status 0: closed, 1: open, 2: will open
export const checkDayStoreStatus = (storeInfo, selectedDate) => {
  const menu = _.get(storeInfo, 'menu', undefined);
  if (!menu) return { status: 0, openTime: '' };

  let openHours = _.get(menu, 'open_hours', []);
  if (openHours.length === 0) return { status: 0, openTime: '' };

  const acceptOrder = _.get(storeInfo, 'online_status', 1);
  if (acceptOrder !== 0) return { status: 0, openTime: '' };

  const dayIndex = selectedDate.getDay();

  openHours = openHours.map((item) => {
    const dayArray = item[0].map((dayItem) => {
      if (dayItem === 6) return 0;
      else return dayItem + 1;
    });
    return [dayArray, item[1]];
  });

  const dayAvailable = [];
  openHours.forEach((openHourItem) => {
    openHourItem[0].forEach((item) => {
      if (item === dayIndex) {
        openHourItem[1].forEach((availableItem) => {
          const startDate = moment(new Date());
          const endDate = moment(new Date());
          startDate.set({
            hour: availableItem.start[0],
            minute: availableItem.start[1],
            second: 0,
            millisecond: 0,
          });
          endDate.set({
            hour: availableItem.end[0],
            minute: availableItem.end[1],
            second: 59,
            millisecond: 999,
          });
          dayAvailable.push({
            startDate: startDate.valueOf(),
            endDate: endDate.valueOf(),
          });
        });
      }
    });
  });

  if (dayAvailable.length === 0) return { status: 0, openTime: '' };

  // check store opened in selected time
  const dateValue = selectedDate.valueOf();
  let isOpen = false;
  dayAvailable.forEach((item) => {
    if (item.startDate <= dateValue && dateValue <= item.endDate) isOpen = true;
  });

  if (isOpen) return { status: 1, openTime: '' };

  // check store can be open within selected day
  const filteredDuration = dayAvailable.filter(
    (item) => item.startDate >= dateValue
  );
  if (filteredDuration.length === 0) return { status: 0, openTime: '' };
  return {
    status: 2,
    openTime: moment(filteredDuration[0].startDate).format('hh:mm a'),
  };
};
