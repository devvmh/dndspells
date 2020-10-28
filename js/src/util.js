/* global window */
/* eslint-disable import/prefer-default-export */

// valid characters are letters, numbers, and whitespace
const sanitize = (string) => string.replace(/[^\s\w]+/g, '');

export const getQueryParamByName = (name) => {
  // get query params
  const queryParams = {};
  window.location.search.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'),
    // eslint-disable-next-line immutable/no-mutation
    ($0, $1, $2, $3) => { queryParams[$1] = $3; },
  );

  const result = queryParams[name];
  if (typeof result === 'string') {
    return sanitize(decodeURIComponent(result));
  }
  return null;
};
