import { expect } from 'chai';
import HexColor from 'models/hex-color';
import HSLColor from 'models/hsl-color';
import RGBColor from 'models/rgb-color';

describe('Color', () => {
  describe('equals()', () => {
    it('evaluates equality of hex colors', () => {
      const a = new HexColor('AABBCC'),
        b = new HexColor('AABBCC'),
        c = new HexColor('EEEEEE');
      expect(a.equals(b)).to.eql(true);
      expect(a.equals(c)).to.eql(false);
    });

    it('evaluates equality of hsl colors', () => {
      const a = new HSLColor(120, 0.5, 0.1),
        b = new HSLColor(120, 0.5, 0.1),
        c = new HSLColor(220, 0.5, 0.1);
      expect(a.equals(b)).to.eql(true);
      expect(a.equals(c)).to.eql(false);
    });

    it('evaluates equality of rgb colors', () => {
      const a = new RGBColor(100, 150, 200),
        b = new RGBColor(100, 150, 200),
        c = new RGBColor(101, 150, 200);
      expect(a.equals(b)).to.eql(true);
      expect(a.equals(c)).to.eql(false);
    });
  });
});
