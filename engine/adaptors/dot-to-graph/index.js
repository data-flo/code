/* eslint prefer-destructuring: 0 */
/* eslint no-plusplus: 0 */

const dotparser = require("vis/lib/network/dotparser");

const Directions = {
  [undefined]: "none",
  to: "forward",
  from: "backward",
};

module.exports = function (args) {
  const parsedData = dotparser.DOTToGraph(args.dot);

  for (const node of parsedData.nodes) {
    node.id = node.id.toString();
    if (node.pos) {
      const pos = node.pos.split(",");
      if (pos.length === 2) {
        node.x = pos[0];
        node.y = pos[1];
      }
    }
    if (node.x && node.y) {
      node.x = parseFloat(node.x);
      node.y = parseFloat(node.y);
    }
  }

  let index = 0;
  const edges = [];
  for (const edge of parsedData.edges) {
    const { id, from, to, arrows, ...attributes } = edge;
    edges.push({
      id: edge.id || `edge-${index++}`,
      from: edge.from.toString(),
      to: edge.to.toString(),
      direction: Directions[edge.arrows],
      attributes: attributes || {},
    });
  }

  return {
    graph: {
      nodes: parsedData.nodes,
      edges,
    },
  };
};
