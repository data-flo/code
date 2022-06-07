/* eslint "no-throw-literal": 0 */

const axios = require("axios");

const axiosClient = axios.create({
  baseURL: "https://five.epicollect.net/api",
  headers: {
    "Content-Type": "application/vnd.api+json",
  },
});

async function makeApiRequest(project, method, url, data) {
  try {
    const response = await axiosClient.request({
      headers: await createAuthorizationHeader(project),
      method,
      url,
      data,
    });
    return response;
  }
  catch (error) {
    if (error) {
      return axiosClient.request({
        headers: await createAuthorizationHeader(project, false /* do not use cache */),
        method,
        url,
        data,
      });
    }
    else {
      throw error;
    }
  }
}

module.exports.getProjectDefinition = async function (project) {
  const response = await makeApiRequest(project, "GET", `/export/project/${project.id}`);
  return response.data;
};

module.exports.createEntry = async function (project, data) {
  const response = await makeApiRequest(
    project,
    "POST",
    `/import/entries/${project.id}`,
    { data }
  );
  return response.data;
};
