module.exports = (test) => {
  /**
   * test objects with the inut, and the expected returned program and literal
   */
  test(
    `
      /** 
       * comment
       */
      "hello";
      'hello2';

      // other comment
      42;
  `,
    {
      type: "Program",
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
    }
  );
};
