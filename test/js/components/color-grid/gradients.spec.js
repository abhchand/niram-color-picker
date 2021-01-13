import * as ArrayHelpers from 'js/helpers/array';
import {
  generateColorGradients,
  generateColorGradientsFromBaseColors,
  generateGrayGradients,
  generateGrayGradientsFromBaseColors,
  generateNullGradients
} from 'components/color-grid/gradients';
import { mockRandom, resetMockRandom } from 'jest-mock-random';
import { expect } from 'chai';
import HSLColor from 'models/hsl-color';

jest.mock('components/color-grid/constants', () => ({
  get GRADIENT_LEN() {
    return 5;
  }
}));

jest.mock('components/color-grid/gradients/color-constants', () => ({
  get S_LOWER() {
    return 0.4;
  },
  get S_UPPER() {
    return 0.6;
  },
  get S_GRADIENT_RANGE() {
    return 0.3;
  },
  get L_LOWER() {
    return 0.4;
  },
  get L_UPPER() {
    return 0.6;
  },
  get L_GRADIENT_RANGE() {
    return 0.3;
  }
}));

jest.mock('components/color-grid/gradients/gray-constants', () => ({
  get COLOR_LOWER() {
    return 100;
  },
  get COLOR_UPPER() {
    return 200;
  },
  get DELTA() {
    return 10;
  },
  get S_GRADIENT_RANGE() {
    return 0.3;
  },
  get L_GRADIENT_RANGE() {
    return 0.3;
  }
}));

describe('generating gradients', () => {
  beforeEach(() => {
    // Keep it simple - have Math.random() always return a single value
    mockRandom([0.4]);
  });

  describe('generateColorGradients', () => {
    it('generates color gradients', () => {
      /*
       * # GENERATING BASE COLORS
       *
       * Saturation and Luminance ranges will be fixed for each color.
       *
       * For Hue, the calculation will be as follows:
       *  * Hue starts at 360 * 0.4 = 144 degrees
       *  * Hue steps in 360 / 3 = 120 degree increments
       *  * Hue variance will be 0.2 * 120 = 24 degrees
       *
       * With that we have:
       *
       * Base Color of 1st Gradient:
       *  - H: 0.4 distance of [144 + 120 - 24, 144 + 120 + 24]  = 259.2
       *  - S: 0.4 distance of [0.4, 0.6] = 0.48
       *  - S: 0.4 distance of [0.4, 0.6] = 0.48
       *  - The color is then "rounded" by converting to Hex and then back to HSL
       *  => { h: 258.974, s: 0.478, l: 0.48 }
       *
       * Base Color of 2nd Gradient:
       *  - H: 0.4 distance of [144 + 240 - 24, 144 + 240 + 24]  = 379.2 % 360 = 19.2
       *  - S: 0.4 distance of [0.4, 0.6] = 0.48
       *  - S: 0.4 distance of [0.4, 0.6] = 0.48
       *  - The color is then "rounded" by converting to Hex and then back to HSL
       *  => { h: 18.974, s: 0.478, l: 0.48 }
       *
       * Base Color of 3rd Gradient:
       *  - H: 0.4 distance of [144 + 360 - 24, 144 + 360 + 24]  = 379.2 % 360 = 139.2
       *  - S: 0.4 distance of [0.4, 0.6] = 0.48
       *  - S: 0.4 distance of [0.4, 0.6] = 0.48
       *  - The color is then "rounded" by converting to Hex and then back to HSL
       *  => { h: 138.974, s: 0.478, l: 0.48 }
       *
       * # GENERATING GRADIENTS
       *
       * The Saturation and Luminance ranges will be 0.3 in either direction.
       *
       * Since there are 2 colors below and 2 above the base color, the step size
       * will be 0.3 / 2 = 0.15 in either direction.
       */

      const gradients = generateColorGradients(3);

      expect(JSON.parse(JSON.stringify(gradients))).to.eql([
        [
          { h: 258.974, l: 0.18, s: 0.178 },
          { h: 258.974, l: 0.33, s: 0.328 },
          { h: 258.974, l: 0.48, s: 0.478 },
          { h: 258.974, l: 0.63, s: 0.628 },
          { h: 258.974, l: 0.78, s: 0.778 }
        ],
        [
          { h: 18.974, l: 0.18, s: 0.178 },
          { h: 18.974, l: 0.33, s: 0.328 },
          { h: 18.974, l: 0.48, s: 0.478 },
          { h: 18.974, l: 0.63, s: 0.628 },
          { h: 18.974, l: 0.78, s: 0.778 }
        ],
        [
          { h: 138.974, l: 0.18, s: 0.178 },
          { h: 138.974, l: 0.33, s: 0.328 },
          { h: 138.974, l: 0.48, s: 0.478 },
          { h: 138.974, l: 0.63, s: 0.628 },
          { h: 138.974, l: 0.78, s: 0.778 }
        ]
      ]);
    });
  });

  describe('generateColorGradientsFromBaseColors', () => {
    it.only('generates color gradients from an array of base colors', () => {
      // See above explanation of how these gradients are derived

      const gradients = generateColorGradientsFromBaseColors([
        new HSLColor(259.2, 0.48, 0.48),
        new HSLColor(19.2, 0.48, 0.48),
        new HSLColor(139.2, 0.48, 0.48)
      ]);

      expect(JSON.parse(JSON.stringify(gradients))).to.eql([
        [
          { h: 258.974, l: 0.18, s: 0.178 },
          { h: 258.974, l: 0.33, s: 0.328 },
          { h: 258.974, l: 0.48, s: 0.478 },
          { h: 258.974, l: 0.63, s: 0.628 },
          { h: 258.974, l: 0.78, s: 0.778 }
        ],
        [
          { h: 18.974, l: 0.18, s: 0.178 },
          { h: 18.974, l: 0.33, s: 0.328 },
          { h: 18.974, l: 0.48, s: 0.478 },
          { h: 18.974, l: 0.63, s: 0.628 },
          { h: 18.974, l: 0.78, s: 0.778 }
        ],
        [
          { h: 138.974, l: 0.18, s: 0.178 },
          { h: 138.974, l: 0.33, s: 0.328 },
          { h: 138.974, l: 0.48, s: 0.478 },
          { h: 138.974, l: 0.63, s: 0.628 },
          { h: 138.974, l: 0.78, s: 0.778 }
        ]
      ]);
    });
  });

  describe('generateGrayGradients', () => {
    beforeEach(() => {
      // Ensure array shuffling returns a predictable result for testing
      jest
        .spyOn(ArrayHelpers, 'shuffleArray')
        .mockImplementation((array) => array);
    });

    it('generates gray gradients', () => {
      /*
       * If the random value and the `shuffleArray` method return fixed
       * values, then each gradient will be the same.
       *
       * To get around this, mock a series of result values for
       * `Math.random()` calls. Each gradient makes 3 of these
       * calls, so our gradients will use 0.4 and 0.6, respectively.
       */
      resetMockRandom();
      mockRandom([0.4, 0.4, 0.4, 0.6, 0.6, 0.6]);

      /*
       * # GENERATING BASE COLORS
       * R, G, and B will be selected as 0.4 of the proprtional distance
       * between the low (100) and high (200) color values: 140
       *
       * A delta factor of 10 * 0.4 = 4 will be added to 2 of the colors.
       *
       * Since we mock `shuffleArray` and return the same array, we will
       * always return
       *
       *   { r: 140, b: 140 + 4, g: 140 + 4 }
       *
       * for the first base color.
       *
       * For the second base color, the same logic applies but with fixed
       * "random" value of 0.6, to produce:
       *
       *   { r: 160, b: 160 + 6, g: 160 + 6 }
       *
       * # GENERATING GRADIENTS
       *
       * The Saturation and Luminance ranges will be 0.3 in either direction (which
       * will be capped at 0 or 1 as boundaries)
       *
       * Since there are 2 colors below and 2 above the base color, the step size
       * will be 0.3 / 2 = 0.15 in either direction.
       */

      const gradients = generateGrayGradients(2);

      expect(JSON.parse(JSON.stringify(gradients))).to.eql([
        [
          { h: 180, s: 0, l: 0.257 },
          { h: 180, s: 0, l: 0.407 },
          { h: 180, s: 0.018, l: 0.557 },
          { h: 180, s: 0.168, l: 0.707 },
          { h: 180, s: 0.318, l: 0.857 }
        ],
        [
          { h: 180, s: 0, l: 0.339 },
          { h: 180, s: 0, l: 0.489 },
          { h: 180, s: 0.033, l: 0.639 },
          { h: 180, s: 0.183, l: 0.789 },
          { h: 180, s: 0.333, l: 0.939 }
        ]
      ]);
    });
  });

  describe('generateGrayGradientsFromBaseColors', () => {
    beforeEach(() => {
      // Ensure array shuffling returns a predictable result for testing
      jest
        .spyOn(ArrayHelpers, 'shuffleArray')
        .mockImplementation((array) => array);
    });

    it('geneates gray gradients from an array of base colors', () => {
      /*
       * If the random value and the `shuffleArray` method return fixed
       * values, then each gradient will be the same.
       *
       * To get around this, mock a series of result values for
       * `Math.random()` calls. Each gradient makes 3 of these
       * calls, so our gradients will use 0.4 and 0.6, respectively.
       */
      resetMockRandom();
      mockRandom([0.4, 0.4, 0.4, 0.6, 0.6, 0.6]);

      // See above explanation of how these gradients are derived

      const gradients = generateGrayGradientsFromBaseColors([
        new HSLColor(180, 0.018, 0.557),
        new HSLColor(180, 0.033, 0.639)
      ]);

      expect(JSON.parse(JSON.stringify(gradients))).to.eql([
        [
          { h: 180, s: 0, l: 0.257 },
          { h: 180, s: 0, l: 0.407 },
          { h: 180, s: 0.018, l: 0.557 },
          { h: 180, s: 0.168, l: 0.707 },
          { h: 180, s: 0.318, l: 0.857 }
        ],
        [
          { h: 180, s: 0, l: 0.339 },
          { h: 180, s: 0, l: 0.489 },
          { h: 180, s: 0.033, l: 0.639 },
          { h: 180, s: 0.183, l: 0.789 },
          { h: 180, s: 0.333, l: 0.939 }
        ]
      ]);
    });
  });

  describe('generateNullGradients', () => {
    it('generates null gradients', () => {
      const gradients = generateNullGradients(2);

      expect(JSON.parse(JSON.stringify(gradients))).to.eql([
        [null, null, null, null, null],
        [null, null, null, null, null]
      ]);
    });
  });
});
