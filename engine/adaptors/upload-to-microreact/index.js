const createMicroreactDocument = require("microreact.js");

module.exports = async function uploadToMicroreact(args, context) {
  const match = args.api.match(/(.*)\/api/i);

  if (!match) {
    throw new Error(`Invalid Microreact API URL: ${args.api}.`);
  }

  const request = await createMicroreactDocument({
    name: args.name,

    data: args.data,
    tree: args.tree,
    network: args.network,

    settings: {
      id: args.idField,
      timeline_field: args.timelineField,
      map_latitude: args.mapLatitude,
      map_longitude: args.mapLongitude,
    },
  });

  const response = await context.request.postJson(
    `${args.api}projects/create`,
    request,
    { "access-token": args["access token"] },
  );

  if (Array.isArray(response)) {
    throw new Error(JSON.stringify(response));
  }

  return {
    id: response.id,
    url: response.url,
  };
};
