const odbc = require("odbc");

const knex = require("knex");

const validQuery = /^\s*SELECT/i;

module.exports = async function (args) {
  const connectionConfig = {
    connectionString: args["connection string"],
    connectionTimeout: args["connection timeout"],
    loginTimeout: args["login timeout"],
  }
  const connection = await odbc.connect(connectionConfig);

  if (!validQuery.test(args["sql query"])) {
    throw new Error("Invalid SQL Query: query should start with a SELECT statement.");
  }

  const results = await connection.query(
    args["sql query"],
    args["parameters"],
    {
      timeout: args["query timeout"],
    }
  );
  connection.close();

  return {
    data: {
      columns: results.columns.map((x) => x.name),
      rows: results,
    },
  };
};
