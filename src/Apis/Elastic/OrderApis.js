import CONFIG from '../../config';
import { get } from 'lodash';

import { getStoreIds } from './StoreApis';

export const filterOrders = async (filterOption) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/order/_search`);

  let query = {
    bool: {
      must: [],
    },
  };

  // For store ids
  const storeId = get(filterOption, 'store_id', -1);
  if (storeId === 'all') {
  
    const storeIds = await getStoreIds(get(filterOption, 'user_id', -1));
    if (storeIds.length === 0) return [];
    query['bool']['must'].push({
      terms: { store_id: storeIds },
    });
  } else if (storeId >= 0)
    query['bool']['must'].push({
      term: { store_id: storeId },
    });

  // For status
  if (typeof filterOption.status === 'object') {
    query['bool']['must'].push({
      terms: { status: filterOption.status },
    });
  } else {
    if (get(filterOption, 'status', -1) >= 0)
      query['bool']['must'].push({
        term: { status: filterOption.status },
      });
  }

  if (filterOption.start) {
    query['bool']['must'].push({
      range: { updatedAt: { gte: filterOption.start } },
    });
  }
  if (filterOption.end) {
    query['bool']['must'].push({
      range: { updatedAt: { lte: filterOption.end } },
    });
  }

  let params = {
    source: JSON.stringify({
      query: query,
      sort: [{ updatedAt: { order: 'desc' } }],
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

export const getNewOrderCount = async (userId) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/order/_count`);

  const storeIds = await getStoreIds(userId);
  let query = {
    bool: {
      must: [],
    },
  };
  query.bool.must = [
    { terms: { store_id: storeIds } },
    { term: { status: 0 } },
  ];

  let params = {
    source: JSON.stringify({ query: query }),
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

  return get(elasticJSON, 'count', 0);
};

export const getOrderCount = async (storeId = [], status = []) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/order/_count`);

  if (storeId.length === 0 || status.length === 0) return 0;

  let query = {
    bool: {
      must: [],
    },
  };
  query.bool.must = [{ terms: { store_id: storeId } }, { term: { status: 0 } }];

  let params = {
    source: JSON.stringify({ query: query }),
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

  return get(elasticJSON, 'count', 0);
};

export const getOrderStatuses = async (storeId) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/order/_search`);

  const params = {
    _source: ['status'],
    source: JSON.stringify({
      query: {
        terms: {
          store_id: storeId,
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

  return hits.map((item) => item._source.status);
};
