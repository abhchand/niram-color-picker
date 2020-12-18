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

export {
  S_LOWER,
  S_UPPER,
  S_GRADIENT_RANGE,
  L_LOWER,
  L_UPPER,
  L_GRADIENT_RANGE
};
