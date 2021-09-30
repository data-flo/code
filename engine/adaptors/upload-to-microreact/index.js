module.exports = async function uploadToMicroreact(args, context) {
  const request = {
    name: args.name,
    data: args.data,
    tree: args.tree,
    network: args.network,
    id: args.idField,
    timeline_field: args.timelineField,
    timeline_format: args.timelineFormat,
    map_latitude: args.mapLatitude,
    map_longitude: args.mapLongitude,
  };

  const match = args.api.match(/(.*)\/api/i);

  if (!match) {
    throw new Error(`Invalid Microreact API URL: ${args.api}.`);
  }

  const response = await context.request.postJson(
    `${args.api}/project/create`,
    request,
    args["access token"] ? { "access-token": args["access token"] } : undefined
  );

  if (Array.isArray(response)) {
    throw new Error(JSON.stringify(response));
  }

  return {
    id: response.shortId,
    url: `${match[1]}/project/${response.shortId}`,
  };
};
