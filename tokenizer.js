class Tokenizer {
  init(string) {
    this._string = new String(string);
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

    // numbers
    let match = subString.match(/^\d+/);
    if (match !== null) {
      this._cursor += match[0].lenght;

      return {
        type: "NUMBER",
        value: match[0],
      };
    }

    // strings
    match = subString.match(/^"\D+"/);
    if (match !== null) {
      this._cursor += match[0].lenght;

      return {
        type: "STRING",
        value: match[0],
      };
    }

    // strings
    match = subString.match(/^'\D+'/);
    if (match !== null) {
      this._cursor += match[0].lenght;

      return {
        type: "STRING",
        value: match[0],
      };
    }

    return null;
  }
}

module.exports = { Tokenizer };
