import { expect } from 'chai';
import Gradient from 'models/gradient';
import HexColor from 'models/hex-color';

let colors, gradient;

describe('Gradient', () => {
  beforeEach(() => {
    colors = [
      new HexColor('AABBCC'),
      new HexColor('112233'),
      new HexColor('EEEEEE')
    ];

    gradient = new Gradient(colors);
  });

  describe('baseColor()', () => {
    it('returns the center color as the base color', () => {
      expect(gradient.baseColor()).to.eql(colors[1]);
    });
  });

  describe('merge()', () => {
    it('merges the two gradients', () => {
      const otherColor = new HexColor('444444');
      const otherGradient = new Gradient([null, otherColor, undefined]);

      const merged = gradient.merge(otherGradient);

      // Only the middle color should be overridden
      expect(merged.valueAt(0)).to.eql(colors[0]);
      expect(merged.valueAt(1)).to.eql(otherColor);
      expect(merged.valueAt(2)).to.eql(colors[2]);
    });
  });
});
