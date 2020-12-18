class Color {
  constructor(color) {
    this._color = color;

    this.value = this.value.bind(this);
    this.equals = this.equals.bind(this);
    this.toJSON = this.toJSON.bind(this);
  }

  value() {
    return this._color;
  }

  equals(otherColor) {
    if (otherColor === null) {
      return false;
    }
    return JSON.stringify(this._color) === JSON.stringify(otherColor.value());
  }

  toJSON() {
    return this._color;
  }
}

export default Color;
