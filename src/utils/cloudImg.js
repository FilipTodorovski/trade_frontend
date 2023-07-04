import CONFIG from '../config';

export const getStoreCloudImg = (
  strUrl,
  searchStr,
  width = 0,
  height = 0,
  func = ''
) => {
  if (!strUrl || strUrl.length === 0) return null;
  const firstThreeLetter = strUrl.substr(0, 4);
  if (firstThreeLetter === 'http') {
    const storeIndex = strUrl.indexOf(searchStr);
    let optionStr = '';
    if (width !== 0 || height !== 0) optionStr = '?';
    optionStr += width !== 0 ? `w=${width}&` : '';
    optionStr += height !== 0 ? `h=${height}&` : '';
    if (func !== '') optionStr += `func=${func}`;
    return (
      CONFIG.CLOUDIMG_BASE_URL +
      '/' +
      strUrl.substring(storeIndex, strUrl.length) +
      optionStr
    );
  } else return strUrl;
};

const ChineseFoodType = 'Chinese-FoodType.png';
const ItalianFoodType = 'italian-food.jpg';
const MexicanFoodTYpe = 'mexican.jpg';

const IndianCurry = 'indian-curry.jpg';
const Chicken = 'chicken.jpg';
const Kebab = 'kebab.jpg';
const Pizza = 'pizza.jpg';

export const getBackImageOfFoodType = (nType) => {
  let returnUrl = CONFIG.CLOUDIMG_BASE_URL + '/assets/';
  let fileName = ChineseFoodType;
  switch (nType.toLowerCase()) {
    case 'chinese':
      fileName = ChineseFoodType;
      break;
    case 'mexican':
      fileName = MexicanFoodTYpe;
      break;
    case 'italian':
      fileName = ItalianFoodType;
      break;
    case 'kebab':
      fileName = Kebab;
      break;
    case 'pizza':
      fileName = Pizza;
      break;
    case 'chicken':
      fileName = Chicken;
      break;
    case 'indian':
      fileName = IndianCurry;
      break;
    default:
      fileName = ChineseFoodType;
  }
  return returnUrl + fileName;
};

export const getAssetsCloudImage = (fileName) => {
  return CONFIG.CLOUDIMG_BASE_URL + '/assets/' + fileName;
};
