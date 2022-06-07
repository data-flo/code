const knex = require("knex");

// const path = require("path");
// const oracledb = require("oracledb");
// // On Windows and macOS, you can specify the directory containing the Oracle
// // Client Libraries at runtime, or before Node.js starts.  On other platforms
// // the system library search path must always be set before Node.js is started.
// // See the node-oracledb installation documentation.
// // If the search path is not correct, you will get a DPI-1047 error.
// if (process.platform === "win32") { // Windows
//   oracledb.initOracleClient({ libDir: "C:\\oracle\\instantclient_19_11" });
// }
// else if (process.platform === "darwin") { // macOS
//   oracledb.initOracleClient({ libDir: path.join(process.env.HOME, "/Downloads/instantclient_19_8") });
// }

const validQuery = /^\s*SELECT/i;

module.exports = async function (args) {
  const instance = knex({
    client: "oracledb",
    connection: {
      user: args.username,
      password: args.password,
      connectString: args.connectionString,
    },
  });
  if (!validQuery.test(args.query)) {
    throw new Error("Invalid SQL Query: query should start with a SELECT statement.");
  }
  const result = await instance.raw(args.query);
  instance.destroy();
  const rows = result;
  const columns = Object.keys(result[0]);
  return {
    data: {
      columns,
      rows,
    },
  };
};
