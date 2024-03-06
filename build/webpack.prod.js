const TerserPlugin = require("terser-webpack-plugin");
const { resolve } = require("./_util");
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");
const { extendDefaultPlugins } = require("svgo");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  devtool: "source-map",
  // cache: {
  //   type: "filesystem",
  //   cacheDirectory: resolve("node_modules/.cache/webpack"),
  //   buildDependencies: {
  //     // This makes all dependencies of this file - build dependencies
  //     config: [__filename],
  //     // By default webpack and loaders are build dependencies
  //   },
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
        echarts: {
          test: /[\\/]node_modules[\\/]echarts[\\/]/,
          name: "echarts",
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
      // `...`,
      new TerserPlugin({
        test: /\.js$/,
        parallel: true,
      }),
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
  plugins: [
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
    }),
    // new BundleAnalyzerPlugin(),
  ],
  // externals: {
  //   vue: "Vue",
  //   lodash: "_",
  //   jquery: "jQuery",
  // },
});
