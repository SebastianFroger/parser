// recursive descent parser

const { Tokenizer } = require("./tokenizer");

class Parser {
  constructor() {
    this._string = "";
    this._tokenizer = new Tokenizer();
  }

  parse(string) {
    this._string = string;
    this._tokenizer.init(string);
    this._lookahead = this._tokenizer.getNextToken();

    return this.Program();
  }

  Program() {
    return {
      type: "Program",
      body: this.StatementList(),
    };
  }

  /**
   * Create a list of statements from the input program
   */
  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()];
    while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement. Define what type of statement we are dealing with
   */
  Statement() {
    switch (this._lookahead.type) {
      case ";":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  EmptyStatement() {
    this._eat(";");
    return {
      type: "EmptyStatement",
    };
  }

  /**
   * BlockStatement. get a list of objects in a block
   * ex. {"some string"};
   */
  BlockStatement() {
    this._eat("{"); // ignore the backet and move the lookahead forward to next token
    const body = this._lookahead.type !== "}" ? this.StatementList("}") : [];
    this._eat("}");
    return {
      type: "BlockStatement",
      body: body,
    };
  }

  /**
   * ExpressionStatement. handles the object that contains the literals
   * ex. "some string";
   */
  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(";");

    return {
      type: "ExpressionStatement",
      value: expression,
    };
  }

  Expression() {
    return this.AdditiveExpression();
  }

  /**
   * AdditiveExpression
   * if all tokens are additive return the binaryexpression
   * else see if it's a multiplication
   */
  AdditiveExpression() {
    return this._BinaryExpression(
      "MultiplicativeExpression",
      "ADDITIVE_OPERATOR"
    );
  }

  /**
   * MultiplicativeExpression
   * if all tokens are multiplication return the binaryexpression
   * else see if it's a primary expression
   */
  MultiplicativeExpression() {
    return this._BinaryExpression(
      "PrimaryExpression",
      "MULTIPLICATIVE_OPERATOR"
    );
  }

  /**
   * Generic _BinaryExpression
   * if all tokens are operatorToken return the binaryexpression
   * else call the next expressiontype to check
   */
  _BinaryExpression(builderName, operatorToken) {
    let left = this[builderName](); // call a function by name

    while (this._lookahead.type === operatorToken) {
      const operator = this._eat(operatorToken).value;
      const right = this[builderName]();

      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }

    return left;
  }

  /**
   * Primary Expression in () or the literal
   * define what type of expression
   */
  PrimaryExpression() {
    switch (this._lookahead.type) {
      case "(":
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }

  /**
   * ParenthesizedExpression
   * ignore the () and get the expression inside the ()
   */
  ParenthesizedExpression() {
    this._eat("(");
    const expression = this.Expression();
    this._eat(")");
    return expression;
  }

  /**
   * Literal. define what type of literal we are dealing with
   * ex. "string" or 42
   */
  Literal() {
    switch (this._lookahead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();

      default:
        throw new SyntaxError(
          `Literal: unexpected literal production. got: ${this._lookahead.type}`
        );
    }
  }

  StringLiteral() {
    const token = this._eat("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1), // avoid ""
    };
  }

  NumericLiteral() {
    const token = this._eat("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value),
    };
  }

  /**
   * validate the lookahead token and move lookahead to the next token.
   */
  _eat(tokentype) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokentype}"`
      );
    }

    if (token.type !== tokentype) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokentype}"`
      );
    }

    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = { Parser };
