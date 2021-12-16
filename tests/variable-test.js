module.exports = (test) => {
  // simple variable statement

  test("let x = 10;", {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        ],
      },
    ],
  });

  // variable decleration, no init
  test("let x;", {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: null,
          },
        ],
      },
    ],
  });

  // multiple variable declerations, no init
  test("let x, y;", {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: null,
          },
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: null,
          },
        ],
      },
    ],
  });

  // multiple variable declerations
  test("let x, y = 10;", {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "x",
            },
            init: null,
          },
          {
            type: "VariableDeclaration",
            id: {
              type: "Identifier",
              name: "y",
            },
            init: {
              type: "NumericLiteral",
              value: 10,
            },
          },
        ],
      },
    ],
  });
};
