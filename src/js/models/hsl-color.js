/* eslint-disable no-magic-numbers */
import Color from './color';
import RGBColor from './rgb-color';

class HSLColor extends Color {
  constructor(h, s, l) {
    /* eslint-disable no-eq-null */
    super({
      h: h == null ? h : parseFloat(h.toFixed(3)),
      s: s == null ? s : parseFloat(s.toFixed(3)),
      l: l == null ? l : parseFloat(l.toFixed(3))
    });
    /* eslint-enable no-eq-null */

    this.dup = this.dup.bind(this);
    this.isValid = this.isValid.bind(this);

    this.shiftBy = this.shiftBy.bind(this);
    this.toHex = this.toHex.bind(this);
    this.toHSL = this.toHSL.bind(this);
    this.toRGB = this.toRGB.bind(this);

    this.toString = this.toString.bind(this);
  }

  dup() {
    return new HSLColor(this._color.h, this._color.s, this._color.l);
  }

  isValid() {
    const color = this._color;

    return (
      color.h !== null &&
      color.h >= 0 &&
      color.h < 360 &&
      color.s !== null &&
      color.s >= 0 &&
      color.s <= 1 &&
      color.l !== null &&
      color.l >= 0 &&
      color.l <= 1
    );
  }

  shiftBy(hDiff, sDiff, lDiff) {
    const color = this._color;

    return new HSLColor(
      Math.max(0, Math.min(360, color.h + hDiff)) % 360,
      Math.max(0, Math.min(1, color.s + sDiff)),
      Math.max(0, Math.min(1, color.l + lDiff))
    );
  }

  toHex() {
    return this.toRGB().toHex();
  }

  toHSL() {
    return this;
  }

  toRGB() {
    const color = this._color;

    const c = (1 - Math.abs(2 * color.l - 1)) * color.s;
    const x = c * (1 - Math.abs(((color.h / 60) % 2) - 1));
    const m = color.l - c / 2;

    let bPrime, gPrime, rPrime;

    if (color.h < 60) {
      rPrime = c;
      gPrime = x;
      bPrime = 0;
    } else if (color.h < 120) {
      rPrime = x;
      gPrime = c;
      bPrime = 0;
    } else if (color.h < 180) {
      rPrime = 0;
      gPrime = c;
      bPrime = x;
    } else if (color.h < 240) {
      rPrime = 0;
      gPrime = x;
      bPrime = c;
    } else if (color.h < 300) {
      rPrime = x;
      gPrime = 0;
      bPrime = c;
    } else {
      // Color.h < 360
      rPrime = c;
      gPrime = 0;
      bPrime = x;
    }

    return new RGBColor(
      Math.round((rPrime + m) * 255),
      Math.round((gPrime + m) * 255),
      Math.round((bPrime + m) * 255)
    );
  }

  toString() {
    const hsl = this.value();
    return `{ h: ${hsl.h}, s: ${hsl.s}, l: ${hsl.l} }`;
  }
}

export default HSLColor;
