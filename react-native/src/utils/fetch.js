const parseJSON = (response) => response.json();

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  return response.json().then((json) => {
    error.response = json;
    throw error;
  });
};

export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}
