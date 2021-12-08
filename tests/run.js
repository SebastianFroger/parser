const { Parser } = require("../parser");
const assert = require("assert");
const tests = [
  require("./literals-tests"),
  require("./statement-list-test"),
  require("./block-test"),
];

const parser = new Parser();

console.log("\n---- Running tests \n");

// test all literals in file literals-tests
function testFunc(program, expected, id) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}
tests.forEach((testObject) => testObject(testFunc));

// this will run when file is called manually in terminal
function exec() {
  const program = `
      /** 
       * comment
       */
      "hello";
      'hello2';

      // other comment
      42;
  `;

  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
}
// exec();

console.log("\n---- All tests passed successfully \n");
