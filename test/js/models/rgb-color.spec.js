import { expect } from 'chai';
import HSLColor from 'models/hsl-color';
import RGBColor from 'models/rgb-color';

describe('RGBColor', () => {
  describe('isValid()', () => {
    it('validates the r, g, and b components', () => {
      [
        [[100, 100, 100], true],

        [[-1, 100, 100], false],
        [[0, 100, 100], true],
        [[255, 100, 100], true],
        [[256, 100, 100], false],
        [[null, 100, 100], false],
        [[undefined, 100, 100], false],

        [[100, -1, 100], false],
        [[100, 0, 100], true],
        [[100, 255, 100], true],
        [[100, 256, 100], false],
        [[100, null, 100], false],
        [[100, undefined, 100], false],

        [[100, 100, -1], false],
        [[100, 100, 0], true],
        [[100, 100, 255], true],
        [[100, 100, 256], false],
        [[100, 100, null], false],
        [[100, 100, undefined], false]
      ].forEach((data) => {
        const rgb = data[0];
        const result = data[1];
        expect(new RGBColor(...rgb).isValid()).to.eql(result);
      });
    });
  });

  describe('toHex()', () => {
    it('converts the rgb value to hex value', () => {
      [
        [[0, 0, 0], '000000'],
        [[0, 128, 0], '008000'],
        [[128, 128, 128], '808080'],
        [[200, 190, 180], 'C8BEB4'],
        [[255, 255, 255], 'FFFFFF'],
        [[128.4, 128.4, 128.4], '808080'],
        [[128.6, 128.6, 128.6], '818181']
      ].forEach((data) => {
        const hex = data[1];
        const rgb = data[0];
        expect(new RGBColor(...rgb).toHex().value()).to.eql(hex);
      });
    });
  });

  describe('toHSL()', () => {
    it('converts the rgb value to hsl value', () => {
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
          [255, 255, 255],
          [0, 0, 1]
        ],

        [
          [128, 128, 128],
          [0, 0, 0.502]
        ],

        [
          [150, 140, 130],
          [30, 0.087, 0.549]
        ],
        [
          [150, 130, 140],
          [330, 0.087, 0.549]
        ],

        [
          [140, 150, 130],
          [90, 0.087, 0.549]
        ],
        [
          [130, 150, 140],
          [150, 0.087, 0.549]
        ],

        [
          [140, 130, 150],
          [270, 0.087, 0.549]
        ],
        [
          [130, 140, 150],
          [210, 0.087, 0.549]
        ]
      ].forEach((data) => {
        const rgb = new RGBColor(...data[0]);
        const hsl = new HSLColor(...data[1]);
        expect(rgb.toHSL().value()).to.eql(hsl.value());
      });
    });
  });

  describe('toRGB()', () => {
    it('returns a copy of itself', () => {
      const rgb = new RGBColor(128, 128, 128);
      const otherRgb = rgb.toRGB();

      expect(otherRgb.value()).to.eql(rgb.value());
    });
  });
});
