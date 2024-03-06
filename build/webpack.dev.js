const { resolve } = require("./_util");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    hot: true,
    // 告诉 dev-server 在服务器启动后打开浏览器。 将其设置为 true 以打开默认浏览器。
    // open: true,
    // 指定端口号以侦听请求
    port: 9000,
    // 告诉开发服务器禁止显示诸如 Webpack 捆绑包信息之类的消息。 错误和警告仍将显示。
    // noInfo: true,
    // 启用热模块替换，而无需页面刷新作为构建失败时的回退。设置为 true 之后，js hmr 不生效
    // hotOnly: true,
    // 为每个静态文件开启 gzip compression
    compress: true,
    // string = 'localhost' 指定要使用的 host。如果你希望服务器可从外部访问，请配置为 host: "0.0.0.0"
    host: "0.0.0.0",
    // 此选项使浏览器可以使用的本地 IP 打开
    useLocalIp: true,
    // 此选项使可以精确控制显示哪些捆绑软件信息。有关更多信息，请参见 stats documentation。
    stats: "minimal",
    // 当将此项配置设置为 true 时，将会跳过 host 检查。这是不推荐的因为不检查 host 的应用容易受到 DNS 重新绑定攻击。
    disableHostCheck: true,
    clientLogLevel: "error",
    // boolean = false object 当使用 HTML5 History API 时, 所有的 404 请求都会响应 index.html 的内容。 将 devServer.historyApiFallback 设为 true开启
    historyApiFallback: true,
    // 告诉服务器内容的来源。仅在需要提供静态文件时才进行配置。
    contentBase: resolve("public"),
    // 告诉服务器使用哪个 URL 服务 devServer.contentBase 静态内容
    contentBasePublicPath: "/",
    // 该选项将允许访问开发服务器的服务列入白名单。
    // allowedHosts: ["test.com"],
    // function (app, server, compiler) 提供自定义中间件，当 devServer 服务器内部的 所有中间件执行完成之后执行
    // after: function (app, server, compiler) {
    //   // console.log(app, server, compiler);
    // },
    // function (app, server, compiler) 提供了一个在 devServer 内部的 所有中间件执行之前的自定义执行函数
    before: function (app) {
      // console.log(app, server, compiler);
      app.get("/api/test", function (req, res) {
        console.log(req.query);
        res.send(req.query);
      });
    },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:9000",
    //     pathRewrite: { "^/api": "" },
    //   },
    // },
  },
});
