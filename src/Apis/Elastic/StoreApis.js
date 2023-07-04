import get from 'lodash/get';
import CONFIG from '../../config';

// get store with postcode
export const getNearbyStores = async (postcode) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/store/_search?size=1000`);
  const params = {
    source: JSON.stringify({
      query: {
        match_phrase: {
          postcode: postcode,
        },
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
  const hits = get(elasticJSON, 'hits.hits', []);

  return hits.map((item) => item._source);
};

// get all store ids of the user
export const getStoreIds = async (userId) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/store/_search?size=1000`);

  const params = {
    _source: ['id'],
    source: JSON.stringify({
      query: {
        match_phrase: {
          user_id: userId,
        },
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
  const hits = get(elasticJSON, 'hits.hits', []);
  const storeIds = hits.map((item) => item._source.id);

  return [...new Set(storeIds)];
};

// get storelist for the store select menu
export const getStores = async (userId) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/store/_search?size=1000`);

  const params = {
    _source: ['id', 'name'],
    source: JSON.stringify({
      query: {
        match_phrase: {
          user_id: userId,
        },
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
  })
  .catch(e=> {
    console.log(e)
  });

  const elasticJSON = await response.json();
  const hits = get(elasticJSON, 'hits.hits', []);

  return hits.map((item) => {
    return { id: item._source.id, name: item._source.name };
  });
};
