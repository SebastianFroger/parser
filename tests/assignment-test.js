module.exports = (test) => {
  // simple assignment
  test("x = 2;", {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      },
    ],
  });

  // chained assignment
  test("x = y = 2;", {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "y",
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      },
    ],
  });
};
