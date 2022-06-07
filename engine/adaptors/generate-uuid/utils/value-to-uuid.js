const crypto = require("crypto");

module.exports = function (value) {
  const h = crypto.createHash("sha1").update(value || "").digest("hex");
  const y = ["8", "9", "a", "b"][parseInt(h[16], 16) % 4];
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-${y}${h.slice(17, 20)}-${h.slice(20, 32)}`;
};
