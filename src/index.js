import "./chart";
import "./test.less";
import "./lib/jquery";
import Vue from "vue";
import _ from "lodash";
import hello from "./hello";
import world from "./world";
import { cube } from "./treeShaking";
import styles from "./test.module.less";

console.log(styles);

const lazy = () => import(/* webpackChunkName: 'lazy' */ "./lazy");

lazy();

console.log(`${hello} ${world}!`);

console.log("test");
console.log("test21");
console.log("test3");

const div = document.createElement("div");
div.className = `${styles.test}`;
document.body.appendChild(div);

new Vue({
  el: "#app",
  template: `<div id="app">{{msg}}</div>`,
  data: {
    msg: "hello vue",
  },
});

// tree shaking
console.log(cube(5));
// console.log(VERSION);
console.log(process.env.NODE_ENV);
console.log(process.env.BASE_URL);
