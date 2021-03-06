/* eslint-disable no-magic-numbers, max-params */
import Gradient from 'models/gradient';
import HSLColor from 'models/hsl-color';

/*
 * Generate a `Gradient` based on a given `color`.
 *
 * Generates an equal number of darker and lighter
 * shades, for a total of `gradientLen` colors.
 *
 * The shades are generated by raising or lowering
 * the Saturation and Luminance in either direction.
 *
 * The range in either direction can be specified
 * by `sRange` and `lRange`, accordingly.
 *
 * The darkest and lightest shades will be `sRange` or
 * `lRange` distnace away from the original color's
 * Saturation/Lumination. All colors in between will
 * be linearly spaced in between.
 *
 * Returns a `Gradient` object (which is a list of
 * `HSLColor` objects, from darkest to lightest)
 */
const generateHSLGradient = (color, gradientLen, sRange, lRange) => {
  /*
   * Convert to Hex and then HSL. The intermediate Hex conversion
   * solves any rounding issues that occur when generating gradients
   * (via HSL) versus building gradients from the URL (Hex).
   */
  const hslColor = color.toHex().toHSL();

  if (gradientLen % 2 === 0) {
    throw 'Gradient length must be odd!';
  }

  // Assumption is that the Gradient is an odd number
  const radius = (gradientLen - 1) / 2;
  const gradient = new Gradient();

  // Generate the darker shades, starting from the darkest
  for (let i = radius; i >= 1; i--) {
    gradient.add(
      hslColor.shiftBy(
        0,
        (-1 * sRange * i) / radius,
        (-1 * lRange * i) / radius
      )
    );
  }

  // Add the original color as the middle color of the gradient
  gradient.add(hslColor);

  // Generate the lighter shades
  for (let i = 1; i <= radius; i++) {
    gradient.add(
      hslColor.shiftBy(0, (sRange * i) / radius, (lRange * i) / radius)
    );
  }

  return gradient;
};

/*
 * Generate a random HSL color within a given set of bounds
 * for H, S, and L
 */
const randomBoundedHSLColor = (bounds = { h: [], s: [], l: [] }) => {
  /*
   * Define upper and lower bounds, defaulting any values
   * not specified in the args.
   *
   * Hue is an exception because it's max value is exclusive
   * (H < 360), so we can't specify an exact default. A value of
   * 360 would "wrap" around to 0. We approximate it below.
   */
  const hL = (bounds.h || [])[0] || 0,
    hU = (bounds.h || [])[1] || 359.999;
  const sL = (bounds.s || [])[0] || 0,
    sU = (bounds.s || [])[1] || 1;
  const lL = (bounds.l || [])[0] || 0,
    lU = (bounds.l || [])[1] || 1;
  // Generate a random H, S, and L value between the specified bounds
  const h = (hL + (hU - hL) * Math.random()) % 360;
  const s = sL + (sU - sL) * Math.random();
  const l = lL + (lU - lL) * Math.random();
  return new HSLColor(h % 360, s, l);
};

export { generateHSLGradient, randomBoundedHSLColor };
