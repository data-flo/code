const DBFFile = require("dbffile");

module.exports = async function (args) {
  const dbf = await DBFFile.open(args.dbf.path);

  const columns = dbf.fields.map((x) => x.name);

  const rows = [];
  for (let index = 0; index < dbf.recordCount; index++) {
    const records = await dbf.readRecords(1);
    const row = {};
    for (const column of columns) {
      row[column] = records[0][column];
    }
    rows.push(row);
  }

  return {
    data: {
      columns,
      rows,
    },
  };
};
