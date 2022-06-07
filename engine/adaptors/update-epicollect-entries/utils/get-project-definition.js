/* eslint "no-throw-literal": 0 */
const makeApiRequest = require("./make-api-request");

module.exports = function (authorisationHeader, projectSlug) {
  return makeApiRequest(
    authorisationHeader,
    "GET",
    `/export/project/${projectSlug}`
  );
};
