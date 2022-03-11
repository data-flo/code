const createMicroreactDocument = require("microreact.js");

function findFile(files, types) {
  for (const fileId of Object.keys(files)) {
    const file = files[fileId];
    if (types.includes(file.format)) {
      return fileId;
    }
  }
  return undefined;
}

module.exports = async function createMicroreactProject(args, context) {
  let projectId = args.project;

  {
    const match = args.api.match(/.*\/project\/([123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ]{22})/i);
    if (match) {
      projectId = match[1];
    }
  }

  {
    const match = args.api.match(/(.*)\/api/i);
    if (!match) {
      throw new Error(`Invalid Microreact API URL: ${args.api}.`);
    }
  }

  const apiUrl = args.api.endsWith("/") ? args.api.substr(0, args.api.length - 1) : args.api;

  const oldDocument = await context.request.postJson(
    `${apiUrl}/projects/json?project=${projectId}`,
    {},
    { "access-token": args["access token"] },
  );

  const dataFileId = findFile(
    oldDocument.files,
    [
      "text/csv",
      "application/x-speadsheet",
    ],
  );

  const newDocument = await createMicroreactDocument({
    name: args.name,
    description: args.description,
    data: args.data ?? dataFileId.url,
    tree: args.tree,
    network: args.network,
  });

  oldDocument.meta.name = newDocument.meta.name ?? oldDocument.meta.name;
  oldDocument.meta.description = newDocument.meta.description ?? oldDocument.meta.description;

  if (args.data) {
    if (dataFileId) {
      oldDocument.files[dataFileId] = newDocument.files["data-file-1"];
    }
  }

  if (args.tree) {
    const treeFileId = findFile(
      oldDocument.files,
      [
        "text/x-nh",
      ],
    );
    if (treeFileId) {
      oldDocument.files[treeFileId] = newDocument.files["tree-file-1"];
    }
    else {
      oldDocument.files["tree-file-1"] = newDocument.files["tree-file-1"];
    }
  }

  if (args.network) {
    const networkFileId = findFile(
      oldDocument.files,
      [
        "text/vnd.graphviz",
      ],
    );
    if (networkFileId) {
      oldDocument.files[networkFileId] = newDocument.files["network-file-1"];
    }
    else {
      oldDocument.files["network-file-1"] = newDocument.files["network-file-1"];
    }
  }

  const response = await context.request.postJson(
    `${apiUrl}/projects/update?project=${projectId}`,
    oldDocument,
    { "access-token": args["access token"].trim() },
  );

  return {
    id: response.id,
    url: response.url,
  };
};
