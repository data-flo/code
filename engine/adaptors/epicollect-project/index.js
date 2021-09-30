const getProjectSlug = require("./utils/get-project-slug");
const sleep = require("./utils/sleep");
const getBaseUrl = require("./utils/get-base-url");
const buildOptions = require("./utils/build-options");

async function fetchEntries(baseUrl, options, pageSize, context) {

  let downloadComplete = false;
  let page = 0;
  const data = {
    rows: [],
  };
  while (!downloadComplete) {
    if (page !== 0) {
      await sleep(1001);
    }
    page += 1;
    options.url = `${baseUrl}&page=${page}`;

    const tablePage = await context.request.getHttp(options);
    if (tablePage.includes("\"code\":\"ec5_256\"")) {
      throw new Error("Cannot access private projects without a valid client ID and Secret.");
    }
    const rows = context.utils.data.parseCsv(tablePage, { delimiter: ",", newline: "\n" });

    if (rows.length < pageSize) {
      downloadComplete = true;
      data.columns = rows.fields;
    }
    data.rows = data.rows.concat(rows);
  }
  return data;
}

module.exports = async function (args, context) {
  const slug = getProjectSlug(args.url);
  const pageSize = 1000;
  const options = await buildOptions(args, context);
  return {
    slug,
    data: await fetchEntries(getBaseUrl(slug, args["map index"], "csv", pageSize), options, pageSize, context),
  };
};
