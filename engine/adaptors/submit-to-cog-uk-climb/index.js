/* eslint-disable dot-notation */

const coguk = require("cog-uk.js");

module.exports = async function (args) {
  const client = coguk(args.username, args.token);

  const rows = [];
  const columns = new Set([
    "Status",
    "Error",
    ...args.data.columns,
  ]);
  const updated = [];
  const created = [];
  const ignored = [];
  for (const sample of args.data.rows) {
    const { status, error, messages } = await client.submit(sample);

    if (status === "updated") {
      updated.push(sample["central_sample_id"]);
    }
    else if (status === "created") {
      created.push(sample["central_sample_id"]);
    }
    else if (status === "ignored") {
      ignored.push(sample["central_sample_id"]);
    }

    const row = {
      Status: status,
      Error: error,
      ...sample,
    };

    for (const key of Object.keys(messages)) {
      columns.add(key);
      row[key] = `${(row[key] || "")}⚠️${messages[key]}`;
    }
    rows.push(row);
  }


  return {
    updated,
    created,
    ignored,
    data: {
      columns: Array.from(columns),
      rows,
    },
  };
};
