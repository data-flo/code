const updateManifest = require("../../engine/manifest");

module.exports = {
  async up(db) {
    const cursor = db.collection("dataflows").find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      console.log("Updating doc %s", doc._id);
      const migratedManifest = updateManifest(doc.manifest);
      await db.collection("dataflows").updateOne(
        { _id: doc._id },
        {
          $set: {
            manifest: migratedManifest,
          },
        },
      );
    }
    return Promise.resolve();
  },

  async down() {
    return Promise.resolve();
  },
};
