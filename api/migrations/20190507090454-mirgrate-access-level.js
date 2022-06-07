module.exports = {
  async up(db) {
    const cursor = db.collection("dataflows").find({});
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      console.log("Updating doc %s", doc._id);
      await db.collection("dataflows").updateOne(
        { _id: doc._id },
        {
          $set: {
            access: (doc.isPublic) ? "public" : "private",
          },
          $unset: {
            isPublic: 1,
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
