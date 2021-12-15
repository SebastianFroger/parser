const { Parser } = require("../parser");
const assert = require("assert");
const tests = [
  require("./literals-tests"),
  require("./statement-list-test"),
  require("./block-test"),
  require("./empty-statement-test"),
  require("./assignment-test"),
  // require("./math-test"),
];

const parser = new Parser();

// this will run when file is called manually in terminal
function exec() {
  const program = `
  x = 2;
  `;

  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
}

console.log("\n---- Running manual tests \n");
exec();
console.log("\n---- Manual tests passed successfully \n");

// test all literals in file literals-tests
function testFunc(program, expected, id) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

console.log("---- Running files tests");
tests.forEach((testObject) => testObject(testFunc));
console.log("---- All tests passed successfully");
