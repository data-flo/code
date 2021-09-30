const toString = require("stream-to-string");

module.exports = async function (args, context) {
  const data = await toString(args.file, args.encoding);
  const rows = context.utils.data.parseCsv(
    data,
    {
      delimiter: ",",
      newline: "\n",
    }
  );

  const geneNames = [];
  for (const field of rows.fields) {
    const match = /(.*)\.assembled$/.exec(field);
    if (match && match[1]) {
      geneNames.push(match[1]);
    }
  }

  const list = [];
  for (const row of rows) {
    for (const gene of geneNames) {
      list.push({
        sample: row.name,
        gene,
        assembled: row[`${gene}.assembled`],
        "percent identity": row[`${gene}.pct_id`],
        "contig cov": row[`${gene}.ctg_cov`],
        "reference sequence": row[`${gene}.ref_seq`],
      });
    }
  }

  return {
    data: {
      rows: list,
      columns: [
        "sample",
        "gene",
        "assembled",
        "percent identity",
        "contig cov",
        "reference sequence",
      ],
    },
  };
};
