import defaultExport from "../text-to-file";

module.exports = async function (args) {

  let files = null;
  if (args.list && args.names) {
    files = args.list.map((contents, i) => defaultExport({
      text: contents,
      name: args.names[i],
      encoding: args.encoding,
      "media type": args["media type"],
    }));
  }
  return { files };
};
