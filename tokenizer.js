const Spec = [
  /**
   * NOTE:
   * the order of the specs mater due to the way regex finds symbols
   * example: both w and s can find numbers
   */

  // whitespace
  [/^\s+/, null],

  // comments /* */ and //
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],

  // symbols and delimiters ;, {}, ()
  [/^\;/, ";"],
  [/^\{/, "{"],
  [/^\}/, "}"],
  [/^\(/, "("],
  [/^\)/, ")"],
  [/^\,/, ","],

  // variable keywords
  [/^\blet\b/, "let"],
  [/^\bif\b/, "if"],
  [/^\belse\b/, "else"],

  // literals numbers
  [/^\d+/, "NUMBER"],

  // Identifiers variableName =
  [/^\w+/, "IDENTIFIER"],

  // Assignment operators =, *=, /=, +=, -=
  [/^\=/, "SIMPLE_ASSIGNMENT"],
  [/^[\*\/\+\-]=/, "COMPLEX_ASSIGNMENT"], //

  // math operators +, -, *, /
  [/^[+\-]/, "ADDITIVE_OPERATOR"],
  [/^[*\/]/, "MULTIPLICATIVE_OPERATOR"],

  // literals strings
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],
];

class Tokenizer {
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  isEOF() {
    return this._cursor === this._string.length;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  getNextToken() {
    if (!this.hasMoreTokens()) return null;

    const subString = this._string.slice(this._cursor);

    for (const [expression, tokenType] of Spec) {
      const tokenValue = this._getMatch(expression, subString);

      if (tokenValue == null) continue;
      if (tokenType == null) return this.getNextToken();

      return {
        type: tokenType,
        value: tokenValue,
      };
    }

    throw new SyntaxError(`Tokenizer: unexpected token "${subString[0]}"`);
  }

  _getMatch(expression, subString) {
    const match = expression.exec(subString);
    if (match == null) return null;
    this._cursor += match[0].length;
    return match[0];
  }
}

module.exports = { Tokenizer };
