const lodash = require("lodash");

module.exports = function (args) {
  const columns = [...args.columns.keys() ];
  const orders = [...args.columns.values() ];
  const missingColumns = columns.filter((column) => (!args.data.hasColumn(column)));
  if (missingColumns.length) {
    throw new Error(`Data is missing columns '${missingColumns}'`);
  }

  const incorrectOrders = orders.filter((order) => (order !== "asc" && order !== "desc"));
  if (incorrectOrders.length) {
    throw new Error(`The following are incorrect ordering: '${incorrectOrders}'. Should be 'asc' or 'desc'`);
  }

  const data = args.data.clone();


  data.rows = lodash.orderBy(data.rows, columns, orders);
  return {
    data,
  };
};
