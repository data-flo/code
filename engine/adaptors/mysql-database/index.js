const knex = require("knex");

const validQuery = /^\s*SELECT/i;

module.exports = async function (args) {
  const instance = knex({
    client: "mysql",
    connection: {
      host: args.hostname,
      port: args.port,
      user: args.username,
      password: args.password,
      database: args.database,
    },
  });
  if (!validQuery.test(args.query)) {
    throw new Error("Invalid SQL Query: query should start with a SELECT statement.");
  }
  const result = await instance.raw(args.query);
  instance.destroy();
  const rows = result[0];
  const columns = result[1].map((c) => c.name);
  return {
    data: {
      columns,
      rows,
    },
  };
};
