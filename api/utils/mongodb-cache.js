const CacheModel = require("../models/cache");

module.exports = async function (key, expiryHours, valueGetter, ...args) {
  const cachedDoc = await CacheModel.findOne({ key });
  if (cachedDoc) {
    const now = new Date();
    const expiryTime = (cachedDoc.timestamp || now).getTime() + (expiryHours * 60 * 60 * 1000);
    if (expiryTime > now.getTime()) {
      return cachedDoc.value;
    }
  }

  const value = await Promise.resolve(valueGetter.apply(this, args));
  if (value !== undefined) {
    await CacheModel.updateOne(
      { key },
      {
        value,
        timestamp: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  }

  return value;
};
