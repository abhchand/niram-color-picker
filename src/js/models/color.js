class Color {
  constructor(color) {
    this._color = color;

    this.value = this.value.bind(this);
    this.equals = this.equals.bind(this);
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
}

export default Color;
