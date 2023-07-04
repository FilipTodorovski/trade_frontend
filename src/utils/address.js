import get from 'lodash/get';

export const getAddressList = (addressInfo) => {
  if (!addressInfo || Object.keys(addressInfo).length === 0) return [];
  const postcode = get(addressInfo, 'postcode', '');
  const city = get(addressInfo, 'city', '');
  const numbers = get(addressInfo, 'numbers', []);
  let addressList = [];
  if (numbers.length > 0)
    addressList = numbers.map((item) => {
      let valueStr = '';

      const number = get(item, 'number', '');
      const building = get(item, 'building', '');
      const street = get(item, 'street', '');

      if (number.length > 0) valueStr += number;
      if (building.length > 0) {
        if (valueStr.length > 0) valueStr += ', ';
        valueStr += building;
      }
      if (street.length > 0) {
        if (valueStr.length > 0) valueStr += ', ';
        valueStr += street;
      }

      valueStr += `, ${city}, ${postcode}`;
      valueStr = valueStr.split(',, ').join(', ');
      valueStr = valueStr.split(', ,').join(', ');
      return { label: valueStr, value: number, street };
    });
  else {
    const value = `${city}, ${postcode}`;
    addressList.push({ label: value, value });
  }
  return addressList;
};

export const getRegularPostCodeStr = (str) => {
  const spaceIndexOf = str.indexOf(' ');
  if (spaceIndexOf > 0) return str;
  return str.replace(/^(.*)(\d)/, '$1 $2');
};
