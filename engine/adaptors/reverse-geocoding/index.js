const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

module.exports = async function (args, context) {
  const geocodingClient = mbxGeocoding({ accessToken: args.mapboxApiKey });
  const data = args.data.clone();
  const geocoder = (row) => {
    if (row[args.longitudeColumn] && row[args.latitudeColumn]) {
      const latitude = Number.parseFloat(row[args.latitudeColumn]);
      const longitude = Number.parseFloat(row[args.longitudeColumn]);
      if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
        const query = [longitude, latitude];
        return context.cache(
          `adaptors/reverse-geocoding/${longitude},${latitude}`,
          360 * 24,
          () => geocodingClient.reverseGeocode({ query }).send()
            .then((results) => (results.body.features.length ? results.body.features : undefined))
        );
      }
    }
    return Promise.resolve(undefined);
  };
  const locations = new Map();
  for (const row of data.rows) {
    const location = await geocoder(row);
    if (location) {
      locations.set(row, location);
    }
  }
  data.addColumn(
    args.resultColumn,
    (row) => {
      const location = locations.get(row);
      if (location) {
        const feature = location.find((x) => x.place_type.includes(args.placeType));
        if (feature && feature.text) {
          return feature.text;
        }
      }
      return "";
    }
  );

  return {
    data,
  };
};
