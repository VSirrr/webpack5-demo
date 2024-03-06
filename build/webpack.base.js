const { resolve } = require("./_util");
const Dotenv = require("dotenv-webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const contextPath = resolve("src");

const isProductionMode = process.env.NODE_ENV === "production";

module.exports = {
  target: "web",
  entry: {
    main: resolve("src/index.js"),
    test: resolve("src/test.js"),
  },
  resolve: {
    // 如果是 true，将不允许无扩展名文件。
    enforceExtension: false,
    // [string] = ['.js', '.json', '.wasm']
    // 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
    extensions: ["...", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": contextPath,
      vue: "vue/dist/vue.min",
      lib: resolve("src/lib"),
      assets: resolve("src/assets"),
    },
    // 解析目录时要使用的文件名。 只采用 main 字段作为入口文件描述字段，以减少搜索步骤
    // mainFiles: ["main"],
    // 当启用此选项时，webpack 更倾向于将模块请求解析为相对请求，而不使用来自 node_modules 目录下的模块。
    // preferRelative: true,
    // 解析时，首选的绝对路径为 resolve.roots。
    preferAbsolute: true,
    // [string] = ['node_modules'] 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
    // modules: [resolve("node_modules")],
  },
  module: {
    noParse: /jquery/,
    rules: [
      {
        test: /\.jsx?$/,
        include: contextPath,
        // exclude: /node_modules/,
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
                localIdentContext: contextPath,
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
  plugins: [
    new Dotenv(),
    new ESLintPlugin(),
    new StylelintPlugin(),
    new HtmlWebpackPlugin({
      inject: "body",
      title: "webpack-demo",
      favicon: resolve("public/favicon.ico"),
      filename: "index.html",
      scriptLoading: "blocking",
      template: resolve("public/index.html"),
      meta: {
        keywords: {
          name: "keywords",
          content: "webpack demo",
        },
        description: {
          name: "description",
          content: "this is webpack demo describtion",
        },
      },
    }),
  ],
};
