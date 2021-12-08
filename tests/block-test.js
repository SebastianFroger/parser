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
              value: {
                type: "StringLiteral",
                value: "hello",
              },
            },
            {
              type: "ExpressionStatement",
              value: {
                type: "StringLiteral",
                value: "hello2",
              },
            },
            {
              type: "ExpressionStatement",
              value: {
                type: "NumericLiteral",
                value: 42,
              },
            },
          ],
        },
      ],
    }
  );
};
