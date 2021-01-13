class Color {
  constructor(color) {
    this._color = color;
    this._isOverride = false;

    this.value = this.value.bind(this);
    this.equals = this.equals.bind(this);
    this.toJSON = this.toJSON.bind(this);
    this.isOverride = this.isOverride.bind(this);
    this.markAsOverride = this.markAsOverride.bind(this);
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

  isOverride() {
    return this._isOverride;
  }

  markAsOverride() {
    this._isOverride = true;
  }
}

export default Color;
