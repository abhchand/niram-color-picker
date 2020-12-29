/* eslint-disable no-magic-numbers */
import Color from './color';
import HexColor from './hex-color';
import HSLColor from './hsl-color';

class RGBColor extends Color {
  constructor(r, g, b) {
    super({ r: r, g: g, b: b });

    this.dup = this.dup.bind(this);
    this.isValid = this.isValid.bind(this);

    this.toHex = this.toHex.bind(this);
    this.toHSL = this.toHSL.bind(this);
    this.toRGB = this.toRGB.bind(this);

    this.toString = this.toString.bind(this);
  }

  dup() {
    return new RGBColor(this._color.r, this._color.g, this._color.b);
  }

  isValid() {
    const color = this._color;

    return (
      color.r !== null &&
      color.r >= 0 &&
      color.r <= 255 &&
      color.g !== null &&
      color.g >= 0 &&
      color.g <= 255 &&
      color.b !== null &&
      color.b >= 0 &&
      color.b <= 255
    );
  }

  toHex() {
    const rgb = this._color;

    const componentToHex = (c) => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    };

    return new HexColor(
      componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b)
    );
  }

  toHSL() {
    const rgb = this._color;

    const rPrime = rgb.r / 255;
    const gPrime = rgb.g / 255;
    const bPrime = rgb.b / 255;

    const cMax = Math.max(rPrime, gPrime, bPrime),
      cMin = Math.min(rPrime, gPrime, bPrime);

    const maxIdx = [rPrime, gPrime, bPrime].indexOf(cMax);
    const delta = cMax - cMin;

    let h, s;

    if (delta === 0) {
      h = 0;
    } else if (maxIdx === 0) {
      // When cMax = rPrime
      h = 60 * (((gPrime - bPrime) / delta) % 6);
    } else if (maxIdx === 1) {
      // When cMax = gPrime
      h = 60 * ((bPrime - rPrime) / delta + 2);
    } else if (maxIdx === 2) {
      // When cMax = bPrime
      h = 60 * ((rPrime - gPrime) / delta + 4);
    }

    const l = (cMax + cMin) / 2;

    if (delta === 0) {
      s = 0;
    } else {
      s = delta / (1 - Math.abs(2 * l - 1));
    }

    if (h < 0) {
      h += 360;
    }

    return new HSLColor(h, s, l);
  }

  toRGB() {
    return this;
  }

  toString() {
    const rgb = this.value();
    return `{ r: ${rgb.r}, g: ${rgb.g}, b: ${rgb.b} }`;
  }
}

export default RGBColor;
