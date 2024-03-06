const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const { extendDefaultPlugins } = require("svgo");
// const CopyPlugin = require("copy-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
// const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// const Log = require("./plugins/log");
/* const threadLoader = require("thread-loader");


threadLoader.warmup(
  {
    // 池选项，例如传递给 loader 选项
    // 必须匹配 loader 选项才能启动正确的池
  },
  [
    // 加载模块
    // 可以是任意模块，例如
    "babel-loader",
  ]
); */

const isProductionMode = process.env.NODE_ENV === "production";

const plugins = [
  // new FriendlyErrorsWebpackPlugin(),
  new ESLintPlugin(),
  new StylelintPlugin(),
  new HtmlWebpackPlugin({
    // If true then append a unique webpack compilation hash to all included scripts and CSS files. This is useful for cache busting
    // hash: true,
    // true || 'head' || 'body' || false Inject all assets into the given template or templateContent. When passing 'body' all javascript resources will be placed at the bottom of the body element. 'head' will place the scripts in the head element. Passing true will add it to the head/body depending on the scriptLoading option. Passing false will disable automatic injections.
    inject: "body",
    // The title to use for the generated HTML document
    title: "webpack-demo",
    favicon: resolve("public/favicon.ico"),
    // The file to write the HTML to. Defaults to index.html.
    filename: "index.html",
    // Modern browsers support non blocking javascript loading ('defer') to improve the page startup performance.
    scriptLoading: "blocking",
    // webpack relative or absolute path to the template. By default it will use src/index.ejs if it exists.
    template: resolve("public/index.html"),
  }),
  // new Log(),
  new webpack.DefinePlugin({
    VERSION: JSON.stringify("5fa3b9"),
  }),
  new Dotenv({
    // path: `./.env.${process.env.NODE_ENV}`,
  }),
];

if (isProductionMode) {
  plugins.unshift(
    new MiniCssExtractPlugin({
      // Type: String|Function Default: [name].css This option determines the name of each output CSS file.
      filename: "css/[name].[contenthash].css",
      // Type: String|Function Default: based on filename
      chunkFilename: "css/[name].[contenthash].css",
      // Type: Boolean Default: false Remove Order Warnings.
      ignoreOrder: true,
    }),
    new CompressionPlugin({
      // exclude: /\.map$/,
      // algorithm: "gzip",
      test: /\.css$|\.js$/,
      // number = 0 Only assets bigger than this size are processed (in bytes)
      threshold: 1024 * 8,
      // number = 0.8 Only assets that compress better than this ratio are processed (minRatio = Compressed Size / Original Size)
      // minRatio: 0.8,
      // Compression options for algorithm, maximum available compression level, for gzip: { level: 9 }
      // compressionOptions: { level: 9 },
      // Whether to delete the original assets or not
      // deleteOriginalAssets: "keep-source-map",
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        // Lossless optimization with custom option
        // Feel free to experiment with options for better result for you
        plugins: [
          ["gifsicle", { interlaced: true }],
          ["jpegtran", { progressive: true }],
          ["optipng", { optimizationLevel: 5 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            "svgo",
            {
              plugins: extendDefaultPlugins([
                {
                  name: "removeViewBox",
                  active: false,
                },
                {
                  name: "addAttributesToSVGElement",
                  params: {
                    attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                  },
                },
              ]),
            },
          ],
        ],
      },
    })
    // new webpack.PrefetchPlugin([resolve("dist")])
    // new webpack.DllPlugin({
    //   // 输出内容是否格式化
    //   // format: true,
    //   // 是否只显示入口文件
    //   // entryOnly: false,
    //   // 文件上下文路径
    //   // context: __dirname,
    //   // 导出暴露的名称
    //   name: "[name]-[fullhash]",
    //   path: path.join(__dirname, "manifest.json"),
    // })
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: resolve("public"),
    //       to: resolve("dist"),
    //       toType: "dir",
    //       noErrorOnMissing: true,
    //       globOptions: {
    //         ignore: ["index.html"],
    //       },
    //     },
    //   ],
    // })
  );
}

// externals 配置
// const externalsConfig = isProductionMode
//   ? {
//       externals: {
//         vue: "Vue",
//         lodash: "_",
//         jquery: "jQuery",
//       },
//     }
//   : {};

module.exports = {
  // 启用 Watch 模式。这意味着在初始构建之后，webpack 将继续监听任何已解析文件的更改。webpack-dev-server 和 webpack-dev-middleware 里 Watch 模式默认开启。
  /* watch: true,
  // 一组用来定制 watch 模式的选项：
  watchOptions: {
    // number = 200 当第一个文件更改，会在重新构建前增加延迟。这个选项允许 webpack 将这段时间内进行的任何其他更改都聚合到一次重新构建里。以毫秒为单位：
    aggregateTimeout: 600,
    // RegExp string [string] 对于某些系统，监听大量文件会导致大量的 CPU 或内存占用。可以使用正则排除像 node_modules 如此庞大的文件夹：
    ignored: /node_modules/,
    // boolean = false number 通过传递 true 开启 polling，或者指定毫秒为单位进行轮询。
    poll: 1000, // 每秒检查一次变动
  }, */
  // 告知 webpack 为目标(target)指定一个环境。如果能够找到 browserslist 的配置，默认值为 browserslist，否则默认为 web
  // 设置为 web ， hmr 才能生效
  target: "web",
  mode: process.env.NODE_ENV,
  entry: {
    main: resolve("src/index.js"),
    test: resolve("src/test.js"),
  },
  // experiments: {
  //   outputModule: true,
  // },
  output: {
    // 添加 IIFE 外层包裹生成的代码，默认值为 true
    // iife: true,
    clean: true,
    // 告诉 webpack 在写入输出文件系统之前检查要发出的文件是否已经存在并且具有相同的内容。
    // compareBeforeEmit: true,
    // module: true,
    // scriptType: "text/javascript",
    // 告诉 webpack 为 HTML 的 <script> 标签添加 charset="utf-8" 标识
    // charset: true,
    publicPath: "/",
    // 告知 webpack 在 bundle 中引入「所包含模块信息」的相关注释。此选项在 development 模式时的默认值为 true，而在 production 模式时的默认值为 false。当值为 'verbose' 时，会显示更多信息，如 export，运行时依赖以及 bailouts。
    // pathinfo: "verbose",
    // 当输出为 library 时，尤其是当 libraryTarget 为 'umd'时，此选项将决定使用哪个全局对象来挂载 library。为了使 UMD 构建在浏览器和 Node.js 上均可用，应将 output.globalObject 选项设置为 'this'。对于类似 web 的目标，默认为 self。
    globalObject: "window",
    // 在生成 hash 时使用的编码方式，默认值为 hex
    // hashDigest: "hex",
    // 统一设置所有 hash 的长度
    hashDigestLength: 8,
    path: resolve("dist"),
    // crossOriginLoading: "anonymous",
    // chunk 的格式（formats 默认值为 'array-push' (web/WebWorker)，可选值 'commonjs' (node.js)，还有其他情况可由插件添加）
    // chunkFormat: "array-push",
    // 加载 chunk 的方法（默认值为 'jsonp' (web)，可选值 'importScripts' (WebWorker)，'require' (sync node.js)，'async-node' (async node.js)，还有其他值可由插件添加)。
    // chunkLoading: "jsonp",
    // 为入口启用 chunk 加载类型列表。将由 webpack 自动填充。只有在使用函数作为入口选项并返回 chunkLoading 选项时才需要。
    // enabledChunkLoadingTypes: ["jsonp", "require"],
    // webpack 用于加载 chunk 的全局变量。
    chunkLoadingGlobal: "webpackJsonp",
    // 在全局环境下为防止多个 webpack 运行时 冲突所使用的唯一名称。默认使用 output.library 名称或者上下文中的 package.json 的 包名称(package name)， 如果两者都不存在，值为 ''。
    // uniqueName: "uniqueName",
    // auxiliaryComment: "Test Comment",
    // initial chunk 文件
    filename: "js/[name].[chunkhash].js",
    // 此选项决定了非初始（non-initial）chunk 文件的名称
    chunkFilename: "js/chunk-[name].[chunkhash].js",
  },
  resolve: {
    // 如果是 true，将不允许无扩展名文件。
    enforceExtension: false,
    // [string] = ['.js', '.json', '.wasm']
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ["...", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": resolve("src"),
      vue: "vue/dist/vue.min",
      lib: resolve("src/lib"),
      assets: resolve("src/assets"),
    },
    // 解析目录时要使用的文件名。
    mainFiles: ["index"],
    // 当启用此选项时，webpack 更倾向于将模块请求解析为相对请求，而不使用来自 node_modules 目录下的模块。
    // preferRelative: true,
    // 解析时，首选的绝对路径为 resolve.roots。
    preferAbsolute: true,
  },
  // 此选项控制是否生成，以及如何生成 source map。生产环境建议配置成 false 或者 source-map
  devtool: isProductionMode ? "source-map" : "inline-source-map",
  // devtool: "eval",
  // devtool: "eval-source-map",
  // devtool: "cheap-source-map",
  // devtool: "inline-source-map",
  // devtool: "eval-cheap-module-source-map",
  module: {
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
            options: {
              // 产生的 worker 的数量，默认是 (cpu 核心数 - 1)，或者，
              // 在 require('os').cpus() 是 undefined 时回退至 1
              // workers: 2,
              // 一个 worker 进程中并行执行工作的数量
              // 默认为 20
              workerParallelJobs: 50,
            },
          },
          {
            loader: "babel-loader",
            options: {
              // 默认值为 false，当有设置时，指定的目录将用来缓存 loader 的执行结果。之后的 webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程(recompilation process)。
              cacheDirectory: true,
              // 默认值为 true。当设置此值时，会使用 Gzip 压缩每个 Babel transform 输出。如果你想要退出缓存压缩，将它设置为 false -- 如果你的项目中有数千个文件需要压缩转译，那么设置此选项可能会从中收益。
              cacheCompression: false,
            },
          },
        ],
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          {
            loader: isProductionMode
              ? MiniCssExtractPlugin.loader
              : "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                // 类型：Boolean|RegExp|Function 默认：'true' 即开启 css-modules，允许基于文件名自动启用 CSS 模块。
                auto: /\.module(s)?\.\w+$/i,
                localIdentName: "[path][name]__[local]--[hash:base64:8]",
                localIdentContext: path.resolve(__dirname, "src"),
                exportLocalsConvention: "camelCaseOnly",
              },
            },
          },
          {
            loader: "postcss-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpe?g|gif)$/i,
        // webpack 将按照默认条件，自动地在 resource 和 inline 之间进行选择：小于 8kb 的文件，将会视为 inline 模块类型，否则会被视为 resource 模块类型
        type: "asset",
        generator: {
          filename: "img/[hash][ext]",
          // publicPath: "assets/",
        },
        parser: {
          // 将判定条件修改为 4kb
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext]",
        },
      },
    ],
  },
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
    // 提供一个选项，当 webpack-dev-server 开始监听端口上的连接时，执行自定义功能。
    // onListening: function (server) {
    //   const port = server.listeningApp.address().port;
    //   console.log("Listening on port:", port);
    // },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:9000",
    //     pathRewrite: { "^/api": "" },
    //   },
    // },
    // 控制监听文件的选项。webpack 使用文件系统来通知文件更改。 在某些情况下，这不起作用。 例如，使用网络文件系统（NFS）时。 Vagrant 也有很多问题。 在这些情况下，请使用轮询：
    // 如果这对文件系统负荷太重，可以将其设置为整数用以调整轮询间隔（以毫秒为单位）。
    // watchOptions: {
    //   poll: true,
    // },
    // 告诉 devServer 将产生的文件写入硬盘。 写入位置为 output.path 配置的目录。
    // writeToDisk: true,
  },
  plugins,
  optimization: {
    // 告知 webpack 当选择模块 id 时需要使用哪种算法。
    // 如果环境是开发环境，那么 optimization.chunkIds 会被设置成 'named', 但当在生产环境中时，它会被设置成 'deterministic'
    // 如果上述的条件都不符合, optimization.chunkIds 会被默认设置为 'natural'
    chunkIds: "deterministic",
    // 告知 webpack 当选择模块 id 时需要使用哪种算法。
    // natural	按使用顺序的数字 id。
    // named	对调试更友好的可读的 id。
    // deterministic	被哈希转化成的小位数值模块名。deterministic 选项有益于长期缓存，但对比于 hashed 来说，它会更小的文件 bundles。
    // size	专注于让初始下载包大小更小的数字 id。
    moduleIds: "deterministic",
    // 值 "single" 会创建一个在所有生成 chunk 之间共享的运行时文件。设置为 true 或 'multiple'，会为每个入口添加一个只含有 runtime 的额外 chunk。
    runtimeChunk: "single",
    splitChunks: {
      // string = '~' 默认情况下，webpack 将使用 chunk 的来源和名称生成名称（例如 vendors~main.js）。此选项使你可以指定用于生成名称的分隔符。
      automaticNameDelimiter: "~",
      // string = 'async' function (chunk) 这表明将选择哪些 chunk 进行优化。当提供一个字符串，有效值为 all，async 和 initial。设置为 all 可能特别强大，因为这意味着 chunk 可以在异步和非异步 chunk 之间共享。
      chunks: "all",
      // number = 30 按需加载时的最大并行请求数。
      maxAsyncRequests: 30,
      // number = 30 入口点的最大并行请求数。
      maxInitialRequests: 30,
      // number = 1 拆分前必须共享模块的最小 chunks 数。
      minChunks: 1,
      // number = 20000 生成 chunk 的最小体积（以 bytes 为单位）。
      minSize: 20000,
      // number = 0 全局使用 告诉 webpack 尝试将大于 maxSize 个字节的 chunk 分割成较小的部分
      // maxSize: 0,
      // 仅会影响按需加载 chunk
      // maxAsyncSize: 100000,
      // 仅会影响初始加载 chunks
      // maxInitialSize: 100000,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          // filename
          name: "vendors",
          // 有效值为 all，async 和 initial。
          chunks: "initial",
          // number = -20 一个模块可以属于多个缓存组。优化将优先考虑具有更高 priority（优先级）的缓存组。默认组的优先级为负，以允许自定义组获得更高的优先级（自定义组的默认值为 0）。
          priority: 20,
        },
        vue: {
          test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
          name: "vue",
          // 优先级，控制将 vue 单独打包
          priority: 30,
        },
        jquery: {
          test: /[\\/]node_modules[\\/]jquery[\\/]/,
          name: "jquery",
          priority: 30,
        },
        lodash: {
          test: /[\\/]node_modules[\\/]lodash[\\/]/,
          name: "lodash",
          priority: 30,
        },
        common: {
          test: resolve("src/lib"),
          name: "common",
          minChunks: 2,
          // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响 chunk 的结果文件名。
          reuseExistingChunk: true,
          // boolean = false 告诉 webpack 忽略 splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests 和 splitChunks.maxInitialRequests 选项，并始终为此缓存组创建 chunk。
          enforce: true,
        },
      },
    },
    // 告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer 定义的插件压缩 bundle。默认值为 true
    // minimize: true,
    // 提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
    minimizer: [
      // 在 webpack@5 中，可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`）
      `...`,
      new CssMinimizerPlugin({
        exclude: /node_modules/,
      }),
    ],
    // 在编译时每当有错误时，就会 emit asset。这样可以确保出错的 asset 被 emit 出来。关键错误会被 emit 到生成的代码中，并会在运行时报错。
    emitOnErrors: true,
    // 如果模块已经包含在所有父级模块中，告知 webpack 从 chunk 中检测出这些模块，或移除这些模块。将 optimization.removeAvailableModules 设置为 true 以启用这项优化。在 生产模式 中默认会被开启。
    // removeAvailableModules: false,
    // 如果 chunk 为空，告知 webpack 检测或移除这些 chunk。
    // removeEmptyChunks: false,
    // 告知 webpack 合并含有相同模块的 chunk。
    // mergeDuplicateChunks: false,
  },
  // ...externalsConfig,
  // stats 选项让你更精确地控制 bundle 信息该怎么显示。如果你不希望使用 quiet 或 noInfo 这样的不显示信息，而是又不想得到全部的信息，只是想要获取某部分 bundle 的信息，使用 stats 选项是比较好的折衷方式。
  // stats: "errors-only",
};

function resolve(p) {
  return path.resolve(__dirname, p);
}
