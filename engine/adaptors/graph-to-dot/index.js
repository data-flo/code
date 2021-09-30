const Directions = {
  none: "--",
  forward: "->",
  backward: "<-",
};

module.exports = function (args) {
  const nodes = args.graph.nodes.map((node) => {
    const attributes = (
      Object.keys(node.attributes || {}).map((key) => `"${key.trim()}"="${node.attributes[key]}"`)
    );
    return `"${node.id}" [${attributes}]`;
  });
  const edges = args.graph.edges.map((edge) => {
    const direction = Directions[edge.direction || "none"];
    let edgeProps = "";
    if (edge.attributes) {
      const attributeKeys = Object.keys(edge.attributes);
      edgeProps = `[${attributeKeys.map((key) => `"${key.trim()}"="${edge.attributes[key]}"`)}]`;
    }
    return `"${edge.from}" ${direction} "${edge.to}" ${edgeProps}`;
  });
  const dot = `graph G { ${nodes.join("; ")}; ${edges.join("; ")}; }`;
  return { dot };
};
