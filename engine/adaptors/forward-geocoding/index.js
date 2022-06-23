const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

module.exports = async function (args, context) {
  const geocodingClient = mbxGeocoding({ accessToken: args.mapboxApiKey });
  const data = args.data.clone();
  const geocoder = (row) => {
    const query = row[args.placeColumn] || " ";
    return context.cache(
      `adaptors/forward-geocoding/${(args["feature types"] || []).join(",")}${query}`,
      360 * 24,
      () => (
        geocodingClient.forwardGeocode({
          query,
          limit: 1,
          types: args["feature types"] || undefined,
        })
          .send()
          .then((results) => (results.body.features.length ? results.body.features[0] : null))
          .then((feature) => (feature ? [feature.center, feature.place_type] : null))
      )
    );
  };
  const features = new Map();
  for (const row of data.rows) {
    const feature = await geocoder(row);
    if (feature) {
      features.set(row, feature);
    }
  }
  data.addColumn(
    args.latitudeColumn,
    (row) => {
      const feature = features.get(row);
      return feature ? feature[0][1] : "";
    }
  );
  data.addColumn(
    args.longitudeColumn,
    (row) => {
      const feature = features.get(row);
      return feature ? feature[0][0] : "";
    }
  );
  data.addColumn(
    args.typeColumn,
    (row) => {
      const feature = features.get(row);
      return feature ? feature[1][0] : "";
    }
  );

  return {
    data,
  };
};
