import axios from 'axios';
import { getAdminToken } from 'utils/tokens';

export const setStripeAccountInfo = async (data) => {
  const response = await axios({
    method: 'POST',
    url: '/stripe/setStripeAccountInfo',
    headers: {
      Authorization: getAdminToken(),
    },
    data,
  });

  return response;
};
