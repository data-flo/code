module.exports = {
  async up(db) {
    return db.collection("caches").deleteMany({
      key: { $regex: "^adaptors\/forward-geocoding\/" },
    });
  },

  async down() {
    return Promise.resolve();
  },
};
