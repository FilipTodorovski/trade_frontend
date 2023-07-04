import CONFIG from '../../config';
import { get } from 'lodash';

export const getItems = async (userId) => {
  if (!userId || userId < 0) return [];
  const elasticBasicToken = Buffer.from(
    `${CONFIG.ELASTIC_USERNAME}:${CONFIG.ELASTIC_PASSWORD}`
  ).toString('base64');

  const url = new URL(`${CONFIG.ELASTIC_SEARCH_LINK}/item/_search`);

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
  });

  const elasticJSON = await response.json();
  const hits = get(elasticJSON, 'hits.hits', []);
  return hits.map((item) => {
    return { id: item._source.id, name: item._source.name };
  });
};
