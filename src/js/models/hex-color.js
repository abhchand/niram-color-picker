/* eslint-disable no-magic-numbers */
import Color from './color';
import RGBColor from './rgb-color';

class HexColor extends Color {
  constructor(hex) {
    super(hex.toUpperCase());

    this.dup = this.dup.bind(this);
    this.isValid = this.isValid.bind(this);

    this.toHex = this.toHex.bind(this);
    this.toHSL = this.toHSL.bind(this);
    this.toRGB = this.toRGB.bind(this);

    this.toString = this.toString.bind(this);
  }

  dup() {
    return new HexColor(this._color);
  }

  isValid() {
    const color = this._color;
    return color !== null && color.match(/^[0-9A-Fa-f]{6}$/u) !== null;
  }

  toHex() {
    return this;
  }

  toHSL() {
    return this.toRGB().toHSL();
  }

  toRGB() {
    const color = this._color;

    const result = /^#?(?<r>[a-f\d]{2})(?<g>[a-f\d]{2})(?<b>[a-f\d]{2})$/iu.exec(
      color
    );

    return new RGBColor(
      parseInt(result.groups.r, 16),
      parseInt(result.groups.g, 16),
      parseInt(result.groups.b, 16)
    );
  }

  toString() {
    return `#${this.value()}`;
  }
}

export default HexColor;
