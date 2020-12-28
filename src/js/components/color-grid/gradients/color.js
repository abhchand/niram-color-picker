import { generateHSLGradient, randomBoundedHSLColor } from 'helpers/hsl';
import {
  L_GRADIENT_RANGE,
  L_LOWER,
  L_UPPER,
  S_GRADIENT_RANGE,
  S_LOWER,
  S_UPPER
} from './color-constants';
import { GRADIENT_LEN } from '../constants';

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
  const hStep = 360 / count;
  const hStart = 360 * Math.random();

  const gradients = [];

  for (let i = 1; i <= count; i++) {
    /*
     * We don't hues to be *perfectly* evenly spaced,
     * so we introduce some small randomness. Define
     * the upper and lower bound for any hue as a small
     * range around each step.
     */
    const hLower = hStart + hStep * (i - 0.2),
      hUpper = hStart + hStep * (i + 0.2);
    /*
     * Generate the base color, specifying the H, S, and L
     * bounds.
     */
    const baseColor = randomBoundedHSLColor({
      h: [hLower, hUpper],
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
