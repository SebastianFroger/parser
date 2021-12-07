const { Parser } = require("../parser.js");
const assert = require("assert");
const tests = [require("./literals-tests.js")];

const parser = new Parser();

// test all literals in file literals-tests
function test(program, expected) {
  const ast = parser.parse(program);
  assert.deepEqual(ast, expected);
}

tests.forEach((testRun) => testRun(test));

// this will run when file is called manually in terminal
function exec() {
  const program = `
        /** 
         * comment
         */
        "hello";
        'hello';

        // other comment
        42;
    `;

  const ast = parser.parse(program);
  console.log(JSON.stringify(ast, null, 2));
}
// exec();

console.log("- All tests passed successfully -");
