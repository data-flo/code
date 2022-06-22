module.exports = function (args) {
  if (args.columns.length < 2) {
    throw new Error("At least two columns are required");
  }

  const equal = [];
  const notequal = [];

  const sensitivity = (!args["case sensitive"]) ? "base" : undefined;

  for (const row of args.data.rows) {
    let allTheSame = true;
    for (let index = 1; index < args.columns.length; index++) {
      const same = (
        row[args.columns[0]] === row[args.columns[index]]
        ||
        (
          row[args.columns[0]].toString
          &&
          row[args.columns[0]].toString().localeCompare(row[args.columns[index]], undefined, { sensitivity }) === 0
        )
      );
      if (!same)
      {
        allTheSame = false;
        break;
      }
    }

    if (allTheSame) {
      equal.push(row);
    }
    else {
      notequal.push(row);
    }
  }

  return {
    same: {
      columns: args.data.columns,
      rows: equal,
    },
    different: {
      columns: args.data.columns,
      rows: notequal,
    },
  };
};
