const newickParser = require("biojs-io-newick");

module.exports = function (args) {
  const rootNode = newickParser.parse_newick(args.newick);
  const queue = [ rootNode ];
  const labels = [];
  while (queue.length) {
    const node = queue.shift();
    if (node.children) {
      Array.prototype.push.apply(queue, node.children);
    }
    else {
      labels.push(node.name);
    }
  }
  return {
    labels,
  };
};
