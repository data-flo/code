class Graph {
  constructor(nodes, edges) {
    this.nodes = nodes;
    this.edges = edges;
  }

  size() {
    return this.nodes.length;
  }

  forEachNode(callback) {
    return this.nodes.forEach(callback);
  }

  forEachEdge(callback) {
    return this.edges.forEach(callback);
  }
}

module.exports = function createGraph(value) {
  if (value instanceof Graph) {
    return value;
  }

  if (!value.nodes) {
    throw new Error(`Cannot convert value '${value}' to graph: missing nodes.`);
  }

  if (!value.edges) {
    throw new Error(`Cannot convert value '${value}' to graph: missing edges.`);
  }

  return new Graph(value.nodes, value.edges);
};
