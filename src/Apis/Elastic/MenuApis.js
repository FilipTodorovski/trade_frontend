import CONFIG from '../../config';
import { get } from 'lodash';

export const getMenus = async (userId) => {
  if (!userId || userId < 0) return [];
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/menu/_search`);

  const params = {
    _source: ['id', 'name'],
    source: JSON.stringify({
      query: {
        term: {
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

  return hits.map((item) => {
    return { id: item._source.id, name: item._source.name };
  });
};

export const getAllMenus = async ({
  userId = -1,
  returnParams = [],
  menuIDs = [],
}) => {
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/menu/_search`);

  let params = { source_content_type: 'application/json' };
  let query = {
    bool: {
      must: [],
    },
  };

  query.bool.must = [];
  if (userId > -1) query.bool.must.push({ terms: { user_id: userId } });
  if (menuIDs) query.bool.must.push({ terms: { id: menuIDs } });

  if (returnParams.length > 0)
    params = {
      _source: returnParams,
      ...params,
    };

  params = {
    ...params,
    source: JSON.stringify({ query: query }),
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
