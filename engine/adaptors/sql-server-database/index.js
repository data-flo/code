const knex = require("knex");

const validQuery = /^\s*SELECT/i;

module.exports = async function (args) {
  const instance = knex({
    client: "mssql",
    connection: {
      host: args.hostname,
      port: args.port,
      user: args.username,
      password: args.password,
      database: args.database,
      options: {
        encrypt: true,
      },
    },
  });

  if (!validQuery.test(args.query)) {
    throw new Error("Invalid SQL Query: query should start with a SELECT statement.");
  }

  const results = await instance.raw(args.query);
  instance.destroy();

  const columns = new Set();
  for (const row of results) {
    for (const column of Object.keys(row)) {
      columns.add(column);
    }
  }

  return {
    data: {
      columns: Array.from(columns),
      rows: results,
    },
  };
};
