import { generateHSLGradient, randomBoundedHSLColor } from 'helpers/hsl';
import Gradient from 'models/gradient';
import { GRADIENT_LEN } from '../constants';

/*
 * Define the bounds that the base color's Saturation
 * and Luminance values will be selected from, and range of allowable
 * Saturation and Luminance values for other colors in the gradient.
 *
 * We want to generate base colors in the "center" of
 * the HSL color space so that there's enough room on
 * either side to generate a full gradient, from dark
 * to light.
 *
 * Additionally we want to select range values that don't
 * exceed the bounds of the HSL space.
 *
 *  * S_UPPER + S_GRADIENT_RANGE <= 1
 *  * S_LOWER - S_GRADIENT_RANGE >= 0
 *
 *  * L_UPPER + L_GRADIENT_RANGE <= 1
 *  * L_LOWER - L_GRADIENT_RANGE >= 0
 *
 */

const S_LOWER = 0.35;
const S_UPPER = 0.65;
const S_GRADIENT_RANGE = 0.2;

const L_LOWER = 0.35;
const L_UPPER = 0.65;
const L_GRADIENT_RANGE = 0.3;

/*
 * Generates a series of `Gradient`s in the HSL
 * color space.
 *
 * Gradients are generated such that their
 * base colors are somewhat (but not prefectly) spaced
 * around the HSL color space to avoid two similar colors.
 *
 * Generates a total of `count` `Gradient` objects.
 */
const generateColorGradients = (count) => {
  /*
   * The Hue defines the color itself. To ensure we
   * don't generate two similar colors, we want to
   * select hues that are somewhat evenly spaces around
   * the HSL space (0 - 360 deg).
   *
   * We do this by defining a fixed step between each
   * Hue as well as starting at a random non-zero point.
   */
  const h_step = 360 / count;
  const h_start = 360 * Math.random();

  const gradients = [];

  for (let i = 1; i <= count; i++) {
    /*
     * We don't hues to be *perfectly* evenly spaced,
     * so we introduce some small randomness. Define
     * the upper and lower bound for any hue as a small
     * range around each step.
     */
    const h_lower = (h_start + h_step * (i - 0.2)) % 360,
      h_upper = (h_start + h_step * (i + 0.2)) % 360;
    /*
     * Generate the base color, specifying the H, S, and L
     * bounds.
     */
    const baseColor = randomBoundedHSLColor({
      h: [h_lower, h_upper],
      s: [S_LOWER, S_UPPER],
      l: [L_LOWER, L_UPPER]
    });

    // Generate the gradient around the base color
    gradients.push(
      generateHSLGradient(
        baseColor,
        GRADIENT_LEN,
        S_GRADIENT_RANGE,
        L_GRADIENT_RANGE
      )
    );
  }

  return gradients;
};

/*
 * Generates a series of `Gradient`s in the HSL color space
 * given a list of base colors
 */
const generateColorGradientsFromBaseColors = (baseColors) => {
  return baseColors.map((baseColor) => {
    return generateHSLGradient(
      baseColor.toHSL(),
      GRADIENT_LEN,
      S_GRADIENT_RANGE,
      L_GRADIENT_RANGE
    );
  });
};

export { generateColorGradients, generateColorGradientsFromBaseColors };
