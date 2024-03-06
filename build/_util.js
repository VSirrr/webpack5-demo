const path = require("path");

module.exports.resolve = function resolve(p) {
  return path.resolve(__dirname, "..", p);
};
