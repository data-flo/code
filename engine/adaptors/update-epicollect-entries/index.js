const getAuthorisationHeader = require("../epicollect-project/utils/get-authorisation-header");
const getProjectSlug = require("../epicollect-project/utils/get-project-slug");
const getProjectDefinition = require("./utils/get-project-definition");
const createEntry = require("./utils/create-entry");

module.exports = async function (args, context) {
  const projectSlug = getProjectSlug(args.url);

  const authorisationHeader = await getAuthorisationHeader(args.url, args["client id"], args["client secret"], context);
  const projectDefinition = await getProjectDefinition(authorisationHeader, projectSlug);

  const data = args.data.clone();

  const columnsMap = {};
  for (const column of data.columns) {
    columnsMap[column.toLowerCase()] = column;
  }

  for (const row of data.rows) {
    try {
      await createEntry(
        authorisationHeader,
        projectSlug,
        projectDefinition,
        args["form index"],
        data.getColumn(args["entry id column"]),
        row
      );
      row.status = "uploaded";
    }
    catch (error) {
      if (error.field) {
        row[columnsMap[error.field]] = `${error.message} ${row[columnsMap[error.field]]}`;
      }
      row.status = "failed";
      row["error message"] = error.message;
      row["error field"] = error.field;
    }
  }

  data.columns.unshift("status");

  return {
    data,
  };
};
