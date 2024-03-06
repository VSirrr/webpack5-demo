const path = require("path");
const Config = require("webpack-chain");

const config = new Config();

config
  .entry("main")
  .add(resolve("src/index.js"))
  .end()
  .output.clean(true)
  .path(resolve("dist"))
  .filename("js/[name].[chunkhash:8].js")
  .end();

config.module
  .rule("js")
  .test(/\.jsx?$/)
  .include(resolve("src"));

config.mode("production");

module.exports = config.toConfig();

function resolve(p) {
  return path.resolve(__dirname, "..", p);
}
