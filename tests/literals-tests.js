module.exports = (test) => {
  /**
   * test objects with the inut, and the expected returned program and literal
   */
  test("42;", {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "NumericLiteral",
          value: 42,
        },
      },
    ],
  });

  test('"hello";', {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  });

  test("'hello';", {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "StringLiteral",
          value: "hello",
        },
      },
    ],
  });
};
