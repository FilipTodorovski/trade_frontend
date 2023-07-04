export const removeSpecialCharacter = (str) => {
  const regExpr = /[^a-zA-Z0-9-. ]/g;
  const regSpace = /\s/g;
  return str.replace(regExpr, '').replace(regSpace, '-');
};

export const makeCapitalCase = (str) => {
  if (!str || str.length === 0) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const twoNumberString = (value) => {
  return ('0' + value).slice(-2);
};
