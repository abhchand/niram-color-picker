import { expect } from 'chai';
import { shuffleArray } from 'helpers/array';

describe('shuffleArray()', () => {
  it('shuffles an array', () => {
    const array = [1, 2, 3, 4, 5];
    expect(JSON.stringify(shuffleArray(array)) !== JSON.stringify(array));
  });
});
