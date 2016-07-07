const sanitize = string => {
  // valid characters are letters, numbers, and whitespace
  return string.replace(/[^\s\w]+/g, '')
}

export const getQueryParamByName = name => {
  //get query params
  const queryParams = {}
  window.location.search.replace(
    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
    function($0, $1, $2, $3) { queryParams[$1] = $3 }
  )
  
  const result = queryParams[name]
  if (typeof result === "string") {
    return sanitize(decodeURIComponent(result))
  } else {
    return null
  }
}
