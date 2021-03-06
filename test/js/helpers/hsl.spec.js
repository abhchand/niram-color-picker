import { generateHSLGradient, randomBoundedHSLColor } from 'helpers/hsl';
import { expect } from 'chai';
import HSLColor from 'models/hsl-color';

describe('generateHSLGradient()', () => {
  it('generates a gradient based off the sRange and lRange', () => {
    const hslColor = new HSLColor(130, 0.5, 0.5);

    const gradient = generateHSLGradient(hslColor, 5, 0.3, 0.4);

    /*
     * The HSL color is "rounded" by converting to Hex and then back to HSL
     * inside the `generateHSLGradient()` function.
     *
     *  - The `H` value of 130 rounds to 129.921
     *  - The `S` value of 0.5 rounds to 0.498, and other S values are offset
     *    accordingly
     */

    expect(gradient._gradient.length).to.eql(5);
    expect(gradient.valueAt(0).value()).to.eql({ h: 129.921, s: 0.198, l: 0.1 });
    expect(gradient.valueAt(1).value()).to.eql({ h: 129.921, s: 0.348, l: 0.3 });
    expect(gradient.valueAt(2).value()).to.eql({ h: 129.921, s: 0.498, l: 0.5 });
    expect(gradient.valueAt(3).value()).to.eql({ h: 129.921, s: 0.648, l: 0.7 });
    expect(gradient.valueAt(4).value()).to.eql({ h: 129.921, s: 0.798, l: 0.9 });
  });

  it('enforces lower and upper bounds on both saturation and luminance', () => {
    const hslColor = new HSLColor(130, 0.5, 0.5);

    const gradient = generateHSLGradient(hslColor, 5, 0.6, 0.6);

    /*
     * The HSL color is "rounded" by converting to Hex and then back to HSL
     * inside the `generateHSLGradient()` function.
     *
     *  - The `H` value of 130 rounds to 129.921
     *  - The `S` value of 0.5 rounds to 0.498, and other S values are offset
     *    accordingly
     */

    expect(gradient._gradient.length).to.eql(5);
    expect(gradient.valueAt(0).value()).to.eql({ h: 129.921, s: 0, l: 0 });
    expect(gradient.valueAt(1).value()).to.eql({ h: 129.921, s: 0.198, l: 0.2 });
    expect(gradient.valueAt(2).value()).to.eql({ h: 129.921, s: 0.498, l: 0.5 });
    expect(gradient.valueAt(3).value()).to.eql({ h: 129.921, s: 0.798, l: 0.8 });
    expect(gradient.valueAt(4).value()).to.eql({ h: 129.921, s: 1, l: 1 });
  });

  describe('gradient length is even', () => {
    it('throws an error', () => {
      const hslColor = new HSLColor(130, 0.5, 0.5);
      expect(() => generateHSLGradient(hslColor, 6, 0.3, 0.4)).to.throw(
        'Gradient length must be odd!'
      );
    });
  });
});

describe('randomBoundedHSLColor()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('lower bound (maximum possible value)', () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(0);
    });

    it('uses the specified lower bounds in generating a color', () => {
      const hslColor = randomBoundedHSLColor({
        h: [100, 200],
        s: [0.4, 0.6],
        l: [0.2, 0.3]
      });

      expect(hslColor.value().h).to.eql(100);
      expect(hslColor.value().s).to.eql(0.4);
      expect(hslColor.value().l).to.eql(0.2);
    });

    it('wraps the hue value if too large', () => {
      const hslColor = randomBoundedHSLColor({
        h: [360, 370]
      });

      expect(hslColor.value().h).to.eql(0);
    });

    describe('no bounds are specified', () => {
      it('uses the default lower bounds in generating a color', () => {
        const hslColor = randomBoundedHSLColor();

        expect(hslColor.value().h).to.eql(0);
        expect(hslColor.value().s).to.eql(0);
        expect(hslColor.value().l).to.eql(0);
      });
    });
  });

  describe('upper bound (maximum possible value)', () => {
    beforeEach(() => {
      jest.spyOn(global.Math, 'random').mockReturnValue(1);
    });

    it('uses the specified upper bounds in generating a color', () => {
      const hslColor = randomBoundedHSLColor({
        h: [100, 200],
        s: [0.4, 0.6],
        l: [0.2, 0.3]
      });

      expect(hslColor.value().h).to.eql(200);
      expect(hslColor.value().s).to.eql(0.6);
      expect(hslColor.value().l).to.eql(0.3);
    });

    it('wraps the hue value if too large', () => {
      const hslColor = randomBoundedHSLColor({
        h: [360, 370]
      });

      expect(hslColor.value().h).to.eql(10);
    });

    describe('no bounds are specified', () => {
      it('uses the default upper bounds in generating a color', () => {
        const hslColor = randomBoundedHSLColor();

        expect(hslColor.value().h).to.eql(359.999);
        expect(hslColor.value().s).to.eql(1);
        expect(hslColor.value().l).to.eql(1);
      });
    });

    it('The Hue value wraps around when >= 360', () => {
      const hslColor = randomBoundedHSLColor({ h: [360, 380] });
      expect(hslColor.value().h).to.eql(20);
    });
  });
});
