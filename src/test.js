import "./lib/jquery";
import _ from "lodash";

console.log("module test");

Promise.resolve(5).then((n) => console.log(n));

Array.isArray([]);

const obj = {
  a: 1,
  b: 2,
};

console.log(Object.entries(obj));
console.log(Object.keys(obj));
console.log(Object.values(obj));
