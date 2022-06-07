module.exports = function (args) {
  if (args.columns.length < 2) {
    throw new Error("At least two columns are required");
  }

  const equal = [];
  const notequal = [];

  for (const row of args.data.rows) {
    let allTheSame = true;
    for (let index = 1; index < args.columns.length; index++) {
      if (args.columns[0] !== args.columns[index]) {
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
    equal: {
      columns: args.data.columns,
      rows: equal,
    },
    "not equal": {
      columns: args.data.columns,
      rows: notequal,
    },
  };
};
