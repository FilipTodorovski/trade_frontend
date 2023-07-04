import _ from 'lodash';
import Geocode from 'react-geocode';
import CONFIG from '../config';

export const Radians = (degree) => {
  const pi = Math.PI;
  return degree * (pi / 180);
};

export const calcMileBetweenPostcode = (originPos, destPos) => {
  return (
    3959 *
    Math.acos(
      Math.cos(Radians(originPos.latitude)) *
        Math.cos(Radians(destPos.latitude)) *
        Math.cos(Radians(originPos.longitude) - Radians(destPos.longitude)) +
        Math.sin(Radians(originPos.latitude)) *
          Math.sin(Radians(destPos.latitude))
    )
  );
};

export const getLatLngFromPostcode = async (postcode) => {
  Geocode.setApiKey(CONFIG.GOOGLE_API_KEY);
  Geocode.setRegion('uk');
  Geocode.setLanguage('en');

  const geoValue = await Geocode.fromAddress(postcode);
  return {
    lng: geoValue.results[0].geometry.location.lng,
    lat: geoValue.results[0].geometry.location.lat,
  };
};

export const getDeliveryFee = async (storeInfo, destPos) => {
  const deliveryData = _.get(storeInfo, 'delivery_data', {});
  if (Object.keys(deliveryData).length === 0) return -1;

  const originLatLng = _.get(deliveryData, 'latLng', null);
  if (originLatLng === null) return -1;

  const deliveryZones = _.get(deliveryData, 'zones', []);
  if (deliveryZones.length === 0) return -1;

  const destPostLatLng = await getLatLngFromPostcode(destPos);

  let feeValue = -1;
  deliveryZones
    .sort((a, b) => parseInt(a, 0) - parseInt(b, 0))
    .forEach((item) => {
      const miles = calcMileBetweenPostcode(
        { latitude: originLatLng.lat, longitude: originLatLng.lng },
        { latitude: destPostLatLng.lat, longitude: destPostLatLng.lng }
      );
      if (miles <= parseInt(item.radius, 0)) feeValue = parseInt(item.fee, 0);
    });
  return feeValue;
};
