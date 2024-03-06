module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: {
          version: "3.15.2",
        },
        // 关闭 Babel 的模块转换功能，保留原本的 ES6 模块化语法。
        modules: false,
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
