import axios from 'axios';
import CONFIG from '../../config';

const elasticBasicToken = Buffer.from(
  `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
).toString('base64');

export const getAddresses = async (postcode) => {
  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/lookup_address/_search`);
  const params = {
    source: JSON.stringify({
      query: {
        match_phrase: { postcode: postcode },
      },
    }),
    source_content_type: 'application/json',
  };
  Object.keys(params).forEach((key) =>
    url.searchParams.append(key, params[key])
  );

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Basic ${elasticBasicToken}`,
      'Content-Type': 'application/json',
    },
  });

  const elasticJSON = await response.json();
  return elasticJSON;
};

export const addAddress = (addressInfo) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `${CONFIG.ELASTIC_SEARCH_LINK}/lookup_address/_doc`,
        {
          ...addressInfo,
        },
        {
          headers: {
            Authorization: `Basic ${elasticBasicToken}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => {
        resolve(true);
      })
      .catch((err) => {
        reject(true);
      });
  });
};
