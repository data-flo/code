module.exports = function (args) {
  if (!args.data.hasColumn(args.from)) {
    throw new Error(`datatable does not include a column named '${args.from}'`);
  }
  if (!args.data.hasColumn(args.to)) {
    throw new Error(`datatable does not include a column named '${args.to}'`);
  }

  const attributeColumns = args.data.columns.filter((x) => x !== args.from && x !== args.to);

  const nodeIds = new Set();
  const edges = args.data.map((row, index) => {
    const attributes = {};
    for (const col of attributeColumns) {
      attributes[col] = row[col];
    }
    nodeIds.add(row[args.from]);
    nodeIds.add(row[args.to]);
    return {
      id: `edge-${index + 1}`,
      from: row[args.from],
      to: row[args.to],
      direction: args.direction,
      attributes,
    };
  });

  const nodes = Array
    .from(nodeIds)
    .map((nodeId) => ({ id: nodeId }));

  return {
    graph: {
      nodes,
      edges,
    },
  };
};
