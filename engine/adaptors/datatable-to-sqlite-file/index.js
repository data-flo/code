const knex = require("knex");

module.exports = async function (args, context) {
  const db = knex({
    client: "sqlite3",
    connection: {
      filename: args.sqlite.path,
    },
    useNullAsDefault: true,
  });

  const fields = await db.raw(
    "pragma table_info(??)",
    [ args["table name"] ],
  );
  const dbColumns = new Set();
  for (const field of fields) {
    dbColumns.add(field.name);
  }

  for (const column of args.data.columns) {
    if (!dbColumns.has(column)) {
      throw new Error(`SQLite DB table ${args["table name"]} has no column named ${column}`);
    }
  }

  const idColumnName = args["id column name"];
  const createdIds = [];
  const updatedIds = [];
  for (const row of args.data.rows) {
    let update = false;
    if (idColumnName && row[idColumnName] !== undefined) {
      const rows = await db(args["table name"]).select(idColumnName).where({ [idColumnName]: row[idColumnName] });
      if (rows.length) {
        update = true;
      }
    }
    if (update) {
      await db(args["table name"]).where({ [idColumnName]: row[idColumnName] }).update(row);
      updatedIds.push(row[idColumnName]);
    }
    else {
      const result = await db(args["table name"]).insert(row);
      createdIds.push(row[idColumnName] || result[0]);
    }
  }

  db.destroy();

  const outputFile = context.utils.file.from(args.sqlite, args.sqlite.name, "application/x-sqlite3");

  return {
    sqlite: outputFile,
    ids: [ ...createdIds, ...updatedIds ],
    "created ids": createdIds,
    "updated ids": updatedIds,
  };
};
