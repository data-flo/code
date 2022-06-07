function sortStagesByExecutionOrder(steps) {
  const ordered = [];
  const visited = new Set();

  let numberOfVisited = 0;
  do {
    numberOfVisited = ordered.length;
    for (const item of steps) {
      if (!visited.has(item.name)) {
        let canBeVisited = true;
        for (const binding of (item.binding || [])) {
          if (binding.type === "transformation") {
            if (!visited.has(binding.transformation)) {
              canBeVisited = false;
              break;
            }
          }
        }
        if (canBeVisited) {
          visited.add(item.name);
          ordered.push(item);
        }
      }
    }
  } while (numberOfVisited !== ordered.length);

  if (steps.length !== ordered.length) {
    throw new Error("Cyclic dependencies detected");
  }

  return ordered;
}

module.exports = {
  sortStagesByExecutionOrder,
};
