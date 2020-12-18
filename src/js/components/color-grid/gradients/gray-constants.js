/*
 * It's easier to generate gray-ish colors in the
 * RGB color space and then convert them to HSL.
 */

/*
 * Generate values for the base color in the middle of the
 * RGB color space so we have room above and below to generate
 * a gradient of darker and lighter colors.
 */

const COLOR_LOWER = Math.round(0.4 * 255);
const COLOR_UPPER = Math.round(0.6 * 255);

// R, G, and B values will be selected within `DELTA` distance of each other
const DELTA = 10;

/*
 * We convert the RGB to HSL below before generating the gradient, so
 * these values still need to be specified as HSL color space values.
 * Grays in the HSL space correspond to values near the center of
 * the cylinder, so we keep the Saturation range small (so it doesn't
 * get too far from the center) and we keep the luminance small as
 * well (so it doesn't get too dark or light near the edges).
 */
const S_GRADIENT_RANGE = 0.05;
const L_GRADIENT_RANGE = 0.2;

export { COLOR_LOWER, COLOR_UPPER, DELTA, S_GRADIENT_RANGE, L_GRADIENT_RANGE };
