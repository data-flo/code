const csv = require("fast-csv");
const util = require("util");

module.exports = async function (args, context) {
  const rows = []
  const columns = new Set();

  for await (const file of args["files list"]) {
    let isFirstRow = true;
    const dataStream = file.pipe(csv.parse({ headers: true }));

    for await (const row of dataStream) {
      rows.push(row);
      if (isFirstRow) {
        for (const field of Object.keys(row)) {
          columns.add(field);
        }
        isFirstRow = false;
      }
    }

    await file.destroy();
  }

  return {
    data: {
      rows,
      columns: Array.from(columns),
    },
  };
};
