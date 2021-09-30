/* eslint "no-throw-literal": 0 */

const axios = require("axios");

module.exports = async function makeApiRequest(authorisationHeader, method, url, data) {
  const axiosClient = axios.create({
    baseURL: "https://five.epicollect.net/api",
    headers: {
      "Content-Type": "application/vnd.api+json",
    },
  });
  return (
    axiosClient.request({
      headers: authorisationHeader,
      method,
      url,
      data,
    })
      .then((response) => response.data)
  );
};
