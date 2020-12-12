import { expect } from 'chai';
import HexColor from 'models/hex-color';
import HSLColor from 'models/hsl-color';
import RGBColor from 'models/rgb-color';

describe('HexColor', () => {
  describe('isValid()', () => {
    it('validates the hex string', () => {
      [
        ['000000', true],
        ['999999', true],

        ['AAAAAA', true],
        ['FFFFFF', true],

        ['aaaaaa', true],
        ['ffffff', true],

        ['a1A1a1', true],
        ['abC312', true],

        ['AAAGAA', false],
        ['aaagaa', false]
      ].forEach((data) => {
        const hex = data[0],
          result = data[1];
        expect(new HexColor(hex).isValid()).to.eql(result);
      });
    });
  });

  describe('toHex()', () => {
    it('returns a copy of itself', () => {
      const hex = new HexColor('B12DC5');
      const otherHex = hex.toHex();

      expect(otherHex.value()).to.eql(hex.value());
    });
  });

  describe('toHSL()', () => {
    it('converts the hex value to hsl value', () => {
      /*
       * The model converts to RGB and then to HSL, so
       * no need to test every combination. Just ensure
       * that a single conversion works
       */
      const hex = new HexColor('FF00FF');
      const hsl = new HSLColor(300, 1.0, 0.5);
      expect(hex.toHSL().value()).to.eql(hsl.value());
    });
  });

  describe('toRGB()', () => {
    it('converts the hex value to rgb value', () => {
      [
        ['000000', [0, 0, 0]],
        ['008000', [0, 128, 0]],
        ['808080', [128, 128, 128]],
        ['C8BEB4', [200, 190, 180]],
        ['FFFFFF', [255, 255, 255]]
      ].forEach((data) => {
        const hex = new HexColor(data[0]),
          rgb = new RGBColor(...data[1]);
        expect(hex.toRGB().value()).to.eql(rgb.value());
      });
    });
  });
});
