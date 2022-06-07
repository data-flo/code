const Springy = require("springy");

function runForceDirectedLayout(graph, options) {
  return new Promise((resolve, reject) => {
    const layout = new Springy.Layout.ForceDirected(
      graph,
      options.stiffness,
      options.repulsion,
      options.damping,
      options.minEnergyThreshold,
      options.maxSpeed,
    );
    const output = {};
    const renderer = new Springy.Renderer(
      layout,
      () => {},
      () => {},
      (node, position) => { output[node.id] = position; },
      () => resolve(output)
    );
    try {
      renderer.start();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = async function (args) {
  const graph = new Springy.Graph();
  for (const node of args.graph.nodes) {
    graph.addNodes(node.id);
  }
  for (const edge of args.graph.edges) {
    graph.addEdges([edge.from, edge.to]);
  }
  const layout = await runForceDirectedLayout(graph, args);
  const nodes = [];
  for (const node of args.graph.nodes) {
    const position = layout[node.id];
    nodes.push({
      ...node,
      attributes: {
        ...node.attributes,
        x: position.x,
        y: position.y,
      },
    });
  }
  return {
    graph: {
      nodes,
      edges: args.graph.edges,
    },
  };
};
