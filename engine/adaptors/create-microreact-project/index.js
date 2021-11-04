const createMicroreactDocument = require("microreact.js");

module.exports = async function createMicroreactProject(args, context) {
  const match = args.api.match(/(.*)\/api/i);

  if (!match) {
    throw new Error(`Invalid Microreact API URL: ${args.api}.`);
  }

  const request = await createMicroreactDocument({
    name: args.name,
    description: args.description,

    data: args.data,
    tree: args.tree,
    network: args.network,

    settings: {
      id: args["id column"],
      timeline_field: args["timeline column"],
      map_latitude: args["latitude column"],
      map_longitude: args["longitude column"],
    },
  });

  const response = await context.request.postJson(
    `${args.api}projects/create`,
    request,
    { "access-token": args["access token"].trim() },
  );

  return {
    id: response.id,
    url: response.url,
  };
};
