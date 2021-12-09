const { Parser } = require("../parser");
const assert = require("assert");
const tests = [
  require("./literals-tests"),
  require("./statement-list-test"),
  require("./block-test"),
  require("./empty-statement-test"),
  // require("./math-test"),
];

const parser = new Parser();

// this will run when file is called manually in terminal
function exec() {
  const program = `
  42 + 13 + 12;
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

console.log("\n---- Running files tests \n");
tests.forEach((testObject) => testObject(testFunc));
console.log("\n---- All tests passed successfully \n");
