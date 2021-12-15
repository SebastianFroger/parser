module.exports = (test) => {
  test(
    `
        {
            "hello";
            'hello2';
            42;
        }
    `,
    {
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello",
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello2",
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    }
  );

  // empty block
  test(
    `
        {}
    `,
    {
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [],
        },
      ],
    }
  );

  // nested blocks
  test(
    `
        {
            "hello";
            'hello2';
            {
              42;
            }
        }
    `,
    {
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello",
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello2",
              },
            },
            {
              type: "BlockStatement",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "NumericLiteral",
                    value: 42,
                  },
                },
              ],
            },
          ],
        },
      ],
    }
  );
};
