import { expect } from 'chai';
import HSLColor from 'models/hsl-color';
import RGBColor from 'models/rgb-color';

describe('HSLColor', () => {
  describe('isValid()', () => {
    it('validates the h, s, and l components', () => {
      [
        [[180, 0.5, 0.5], true],

        [[-1, 0.5, 0.5], false],
        [[0, 0.5, 0.5], true],
        [[359, 0.5, 0.5], true],
        [[360, 0.5, 0.5], false],
        [[null, 0.5, 0.5], false],
        [[undefined, 0.5, 0.5], false],

        [[180, -1, 0.5], false],
        [[180, 0, 0.5], true],
        [[180, 1, 0.5], true],
        [[180, 1.1, 0.5], false],
        [[180, null, 0.5], false],
        [[180, undefined, 0.5], false],

        [[180, 0.5, -1], false],
        [[180, 0.5, 0], true],
        [[180, 0.5, 1], true],
        [[180, 0.5, 1.1], false],
        [[180, 0.5, null], false],
        [[180, 0.5, undefined], false]
      ].forEach((data) => {
        const hsl = data[0],
          result = data[1];
        expect(new HSLColor(...hsl).isValid()).to.eql(result);
      });
    });
  });

  describe('toHex()', () => {
    it('converts the hsl value to hex value', () => {
      /*
       * The model converts to RGB and then to Hex, so
       * no need to test every combination. Just ensure
       * that a single conversion works
       */
      const hsl = new HSLColor(300, 1.0, 0.5);
      expect(hsl.toHex().value()).to.eql('FF00FF');
    });
  });

  describe('toHSL()', () => {
    it('returns a copy of itself', () => {
      const hsl = new HSLColor(300, 1.0, 0.5);
      const otherRgb = hsl.toHSL();

      expect(otherRgb.value()).to.eql(hsl.value());
    });
  });

  describe('toRGB()', () => {
    it('converts the hsl value to rgb value', () => {
      /*
       * The below data set covers
       *  - Extreme cases (white, black)
       *  - Equal cases where R, G, and B are same magnitude
       *  - Colors where R, G, and B are the greatest value
       *    (dominant color)
       *  - Each combination of the non-dominant color differential
       *    being positive and negative
       */
      [
        [
          [0, 0, 0],
          [0, 0, 0]
        ],
        [
          [0, 0, 1],
          [255, 255, 255]
        ],

        [
          [0, 0, 0.502],
          [128, 128, 128]
        ],

        [
          [30, 0.087, 0.549],
          [150, 140, 130]
        ],
        [
          [330, 0.087, 0.549],
          [150, 130, 140]
        ],

        [
          [90, 0.087, 0.549],
          [140, 150, 130]
        ],
        [
          [150, 0.087, 0.549],
          [130, 150, 140]
        ],

        [
          [270, 0.087, 0.549],
          [140, 130, 150]
        ],
        [
          [210, 0.087, 0.549],
          [130, 140, 150]
        ]
      ].forEach((data) => {
        const hsl = new HSLColor(...data[0]);
        const rgb = new RGBColor(...data[1]);

        expect(hsl.toRGB().value()).to.eql(rgb.value());
      });
    });
  });
});
