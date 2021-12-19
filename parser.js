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
    this._nextToken = this._tokenizer.getNextToken();

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
    while (this._nextToken != null && this._nextToken.type !== stopLookahead) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  /**
   * Statement. Define what type of statement we are dealing with
   */
  Statement() {
    switch (this._nextToken.type) {
      case ";":
        return this.EmptyStatement();
      case "if":
        return this.IfStatement();
      case "{":
        return this.BlockStatement();
      case "let":
        return this.VariableStatement();
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

  IfStatement() {
    this._eat("if");

    this._eat("(");
    const test = this.Expression();
    this._eat(")");

    const consequent = this.Statement();
    const alternate =
      this._nextToken != null && this._nextToken.type === "else"
        ? this._eat("else") && this.Statement()
        : null;

    return {
      type: "IfStatement",
      test,
      consequent,
      alternate,
    };
  }

  /**
   * BlockStatement. get a list of objects in a block
   * ex. {"some string"};
   */
  BlockStatement() {
    this._eat("{"); // ignore the backet and move the lookahead forward to next token
    const body = this._nextToken.type !== "}" ? this.StatementList("}") : [];
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
      expression,
    };
  }

  /**
   * Variable statement
   */
  VariableStatement() {
    this._eat("let");
    const declarations = this.VariableDeclarationList();
    this._eat(";");

    return {
      type: "VariableStatement",
      declarations,
    };
  }

  VariableDeclarationList() {
    const declarations = [];
    do {
      declarations.push(this.VariableDeclaration());
    } while (this._nextToken.type === "," && this._eat(","));

    return declarations;
  }

  /**
   * variable declarations
   */
  VariableDeclaration() {
    const id = this.Identifier();

    const init =
      this._nextToken.type !== ";" && this._nextToken.type !== ","
        ? this.VariableInitializer()
        : null;

    return {
      type: "VariableDeclaration",
      id,
      init,
    };
  }

  /**
   * VariableInitializer
   */
  VariableInitializer() {
    this._eat("SIMPLE_ASSIGNMENT");
    return this.AssignmentExpression();
  }

  Expression() {
    return this.AssignmentExpression();
  }

  AssignmentExpression() {
    const left = this.AdditiveExpression();

    if (!this._isAssignmentOperator(this._nextToken.type)) {
      return left;
    }

    return {
      type: "AssignmentExpression",
      operator: this.AssignmentOperator().value,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  LeftHandSideExpression() {
    return this.Identifier();
  }

  // Identifier
  Identifier() {
    const name = this._eat("IDENTIFIER").value;
    return {
      type: "Identifier",
      name,
    };
  }

  // check the assignment target
  _checkValidAssignmentTarget(node) {
    if (node.type === "Identifier") return node;
    throw new SyntaxError("Invalid left-hand side in assignment expression");
  }

  // check that the token is an assigment operator
  _isAssignmentOperator(tokenType) {
    return (
      tokenType === "SIMPLE_ASSIGNMENT" || tokenType === "COMPLEX_ASSIGNMENT"
    );
  }

  // AssignmentOperator
  AssignmentOperator() {
    if (this._nextToken.type === "SIMPLE_ASSIGNMENT") {
      return this._eat("SIMPLE_ASSIGNMENT");
    }

    return this._eat("COMPLEX_ASSIGNMENT");
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

    while (this._nextToken.type === operatorToken) {
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
    if (this._isLiteral(this._nextToken.type)) {
      return this.Literal();
    }
    switch (this._nextToken.type) {
      case "(":
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  _isLiteral(tokenType) {
    return tokenType === "NUMBER" || tokenType === "STRING";
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
    switch (this._nextToken.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();

      default:
        throw new SyntaxError(
          `Literal: unexpected literal production. got: ${this._nextToken.type}`
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
    const token = this._nextToken;

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

    this._nextToken = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = { Parser };
