const { Parser } = require("../parser.js");
const parser = new Parser();
const program = "123abc";
// const program = `'hello'`;
// const program = `"hello"`;
console.log("Parsing program:", program);
const ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));
