/* eslint no-unused-vars: 0 */

const Organisation = require("../models/organisation");
const User = require("../models/user");

module.exports = {
  serialize(user, done) {
    done(null, user.id);
  },
  deserialize(id, done) {
    User.findById(id)
      .populate("organisation")
      .exec((err, user) => done(err, user));
  },
  save(profile, done) {
    User.findOneOrCreate(
      {
        providerType: profile.type,
        providerIdentifier: profile.id,
      },
      {
        providerType: profile.type,
        providerIdentifier: profile.id,
        name: profile.name,
        email: profile.email,
        photo: profile.photo,
      }
    )
      .then((user) => done(null, user))
      .catch((err) => done(err));
  },
};
