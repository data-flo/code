const knex = require("knex");

// const oracledb = require("oracledb");
// oracledb.initOracleClient({ libDir: "/usr/local/lib/instantclient_19_8" });

const validQuery = /^\s*SELECT/i;

module.exports = async function (args) {
  const instance = knex({
    client: "oracledb",
    connection: {
      user: args.username,
      password: args.password,
      connectString: `${args.hostname}:${args.port}/${args.service}`,
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
