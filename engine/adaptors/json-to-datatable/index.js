module.exports = function (args) {
  let root = JSON.parse(args.json);
  if (args.path) {
    const keys = args.path.split(".");
    for (const key of keys) {
      if (Array.isArray(root)) {
        let index = parseInt(key, 10);
        if (index < 0) {
          index = root.length + index;
        }
        root = root[index];
      }
      else {
        root = root[key];
      }
    }
  }

  let columns = args.columns;
  if (!columns && root.length) {
    columns = Object.keys(root[0]);
  }

  return {
    data: {
      columns,
      rows: root,
    },
  };
};
