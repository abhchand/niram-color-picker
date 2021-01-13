import { getStateFromUrl, setUrlFromState } from 'components/color-grid/url';
import { expect } from 'chai';
import { generateNullGradients } from 'components/color-grid/gradients/null';
import Gradient from 'models/gradient';
import HexColor from 'models/hex-color';

jest.mock('components/color-grid/constants', () => ({
  get GRADIENT_LEN() {
    return 3;
  },
  get NUM_PRIMARY_GRADIENTS() {
    return 1;
  },
  get NUM_NEUTRAL_GRADIENTS() {
    return 1;
  },
  get NUM_ACCENT_GRADIENTS() {
    return 2;
  }
}));

describe('translating between state and url', () => {
  describe('setUrlFromState()', () => {
    let mockReplaceState, mockWindow, state;

    beforeEach(() => {
      state = {
        primaryGradients: [
          new Gradient([
            new HexColor('00AA00'),
            new HexColor('11AA11'),
            new HexColor('22AA22')
          ])
        ],
        primaryOverrides: generateNullGradients(1),
        neutralGradients: [
          new Gradient([
            new HexColor('00BB00'),
            new HexColor('11BB11'),
            new HexColor('22BB22')
          ])
        ],
        neutralOverrides: generateNullGradients(1),
        accentGradients: [
          new Gradient([
            new HexColor('00CC00'),
            new HexColor('11CC11'),
            new HexColor('22CC22')
          ]),
          new Gradient([
            new HexColor('00DD00'),
            new HexColor('11DD11'),
            new HexColor('22DD22')
          ])
        ],
        accentOverrides: generateNullGradients(2)
      };

      mockReplaceState = jest.fn();
      mockWindow = {
        location: { pathname: '/' },
        history: { replaceState: mockReplaceState }
      };
      jest.spyOn(window, 'window', 'get').mockImplementation(() => mockWindow);
    });

    describe('gradients', () => {
      it('serializes the state into the URL', () => {
        setUrlFromState(state);

        const calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql('/?g=11AA11-11BB11-11CC11-11DD11');
      });

      it('preserves any existing path, modifying only the state (params)', () => {
        mockWindow.location.pathname = '/foo';

        setUrlFromState(state);

        const calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql('/foo?g=11AA11-11BB11-11CC11-11DD11');
      });

      it('handles non-Hex colors', () => {
        // Replace one of the Hex colors with its HSL equivalent
        const color = state.primaryGradients[0].valueAt(1);
        state.primaryGradients[0].set(1, color.toHSL());

        setUrlFromState(state);

        const calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql('/?g=11AA11-11BB11-11CC11-11DD11');
      });
    });

    describe('overrides', () => {
      let overrides;

      beforeEach(() => {
        overrides = [
          new Gradient([new HexColor('33AA33'), null, new HexColor('44AA44')])
        ];
      });

      it('serializes the state into the URL', () => {
        /*
         * Test serialization against each combination of gradient type
         * and index
         */

        // Primary

        Object.assign(state, {
          primaryOverrides: overrides,
          neutralOverrides: generateNullGradients(1),
          accentOverrides: generateNullGradients(2)
        });

        setUrlFromState(state);

        let calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql(
          '/?g=11AA11-11BB11-11CC11-11DD11&p0=33AA33,,44AA44'
        );

        // Neutral

        mockReplaceState.mockClear();

        Object.assign(state, {
          primaryOverrides: generateNullGradients(1),
          neutralOverrides: overrides,
          accentOverrides: generateNullGradients(2)
        });

        setUrlFromState(state);

        calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql(
          '/?g=11AA11-11BB11-11CC11-11DD11&n0=33AA33,,44AA44'
        );

        // Accent [0]

        mockReplaceState.mockClear();

        Object.assign(state, {
          primaryOverrides: generateNullGradients(1),
          neutralOverrides: generateNullGradients(1),
          accentOverrides: overrides.concat(generateNullGradients(1))
        });

        setUrlFromState(state);

        calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql(
          '/?g=11AA11-11BB11-11CC11-11DD11&a0=33AA33,,44AA44'
        );

        // Accent [1]

        mockReplaceState.mockClear();

        Object.assign(state, {
          primaryOverrides: generateNullGradients(1),
          neutralOverrides: generateNullGradients(1),
          accentOverrides: generateNullGradients(1).concat(overrides)
        });

        setUrlFromState(state);

        calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql(
          '/?g=11AA11-11BB11-11CC11-11DD11&a1=33AA33,,44AA44'
        );
      });

      it('handles non-Hex colors', () => {
        // Replace one of the Hex colors with its HSL equivalent
        const color = overrides[0].valueAt(0);
        overrides[0].set(0, color.toHSL());

        Object.assign(state, {
          primaryOverrides: overrides,
          neutralOverrides: generateNullGradients(1),
          accentOverrides: generateNullGradients(2)
        });

        setUrlFromState(state);

        const calls = mockReplaceState.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][2]).to.eql(
          '/?g=11AA11-11BB11-11CC11-11DD11&p0=33AA33,,44AA44'
        );
      });
    });
  });

  describe('getStateFromUrl()', () => {
    describe('gradients', () => {
      it('deserializes state from the url', () => {
        mockSearchAs('?g=11AA11-11BB11-11CC11-11DD11');

        const state = getStateFromUrl();

        expect(JSON.parse(JSON.stringify(state))).to.eql({
          primaryGradients: [
            [
              { h: 120, l: 0.067, s: 0.618 },
              { h: 120, l: 0.367, s: 0.818 },
              { h: 120, l: 0.667, s: 1 }
            ]
          ],
          primaryOverrides: [[null, null, null]],
          neutralGradients: [
            [
              { h: 120, l: 0.2, s: 0.783 },
              { h: 120, l: 0.4, s: 0.833 },
              { h: 120, l: 0.6, s: 0.883 }
            ]
          ],
          neutralOverrides: [[null, null, null]],
          accentGradients: [
            [
              { h: 120, l: 0.133, s: 0.646 },
              { h: 120, l: 0.433, s: 0.846 },
              { h: 120, l: 0.733, s: 1 }
            ],
            [
              { h: 120, l: 0.167, s: 0.657 },
              { h: 120, l: 0.467, s: 0.857 },
              { h: 120, l: 0.767, s: 1 }
            ]
          ],
          accentOverrides: [
            [null, null, null],
            [null, null, null]
          ]
        });
      });

      describe('invalid url', () => {
        it('returns null when params string is blank', () => {
          mockSearchAs('');
          // eslint-disable-next-line
          expect(getStateFromUrl()).to.be.null;
        });

        it('returns null when `g` is blank', () => {
          mockSearchAs('?badParam=11AA11-11BB11-11CC11-11DD11');
          // eslint-disable-next-line
          expect(getStateFromUrl()).to.be.null;
        });

        it('returns null when any hex is invalid', () => {
          mockSearchAs('?g=11AA11-XXXXX-11CC11-11DD11');
          // eslint-disable-next-line
          expect(getStateFromUrl()).to.be.null;
        });

        it('returns null when gradient length is incorrect', () => {
          mockSearchAs('?g=11AA11-11BB11-11CC11');
          // eslint-disable-next-line
          expect(getStateFromUrl()).to.be.null;
        });
      });
    });

    describe('overrides', () => {
      it('deserializes the overrides', () => {
        mockSearchAs(
          [
            '?g=11AA11-11BB11-11CC11-11DD11',
            'p0=FFFFFE,FFFFFF,',
            'n0=,000000,',
            'a0=,00FF00,',
            'a1=,FF0000,'
          ].join('&')
        );

        const state = getStateFromUrl();

        /*
         * NOTE: gradients are returned as HSL colors, overrides
         * are returned as Hex colors.
         */
        expect(JSON.parse(JSON.stringify(state))).to.eql({
          primaryGradients: [
            [
              { h: 120, l: 0.067, s: 0.618 },
              { h: 120, l: 0.367, s: 0.818 },
              { h: 120, l: 0.667, s: 1 }
            ]
          ],
          primaryOverrides: [['FFFFFE', 'FFFFFF', null]],
          neutralGradients: [
            [
              { h: 120, l: 0.2, s: 0.783 },
              { h: 120, l: 0.4, s: 0.833 },
              { h: 120, l: 0.6, s: 0.883 }
            ]
          ],
          neutralOverrides: [[null, '000000', null]],
          accentGradients: [
            [
              { h: 120, l: 0.133, s: 0.646 },
              { h: 120, l: 0.433, s: 0.846 },
              { h: 120, l: 0.733, s: 1 }
            ],
            [
              { h: 120, l: 0.167, s: 0.657 },
              { h: 120, l: 0.467, s: 0.857 },
              { h: 120, l: 0.767, s: 1 }
            ]
          ],
          accentOverrides: [
            [null, '00FF00', null],
            [null, 'FF0000', null]
          ]
        });
      });

      it('marks the color object as an override', () => {
        mockSearchAs('?g=11AA11-11BB11-11CC11-11DD11&p0=,FFFFFF,');

        const state = getStateFromUrl();

        const overridenColor = state.primaryOverrides[0].valueAt(1);
        expect(overridenColor.isOverride()).to.eql(true);
      });

      describe('invalid url', () => {
        it('ignores blank values', () => {
          mockSearchAs(['?g=11AA11-11BB11-11CC11-11DD11', 'p0='].join('&'));

          const state = getStateFromUrl();
          expect(JSON.parse(JSON.stringify(state.primaryOverrides))).to.eql([
            [null, null, null]
          ]);
        });

        it('ignores all-null values', () => {
          mockSearchAs(['?g=11AA11-11BB11-11CC11-11DD11', 'p0=,,'].join('&'));

          const state = getStateFromUrl();
          expect(JSON.parse(JSON.stringify(state.primaryOverrides))).to.eql([
            [null, null, null]
          ]);
        });

        it('ignores all invalid indexes in the key names', () => {
          mockSearchAs(['?g=11AA11-11BB11-11CC11-11DD11', 'p9='].join('&'));

          const state = getStateFromUrl();
          expect(JSON.parse(JSON.stringify(state.primaryOverrides))).to.eql([
            [null, null, null]
          ]);
        });

        it('ignores invalid hex values', () => {
          mockSearchAs(
            ['?g=11AA11-11BB11-11CC11-11DD11', 'p0=XFXFXF,FFFFFF,'].join('&')
          );

          const state = getStateFromUrl();
          expect(JSON.parse(JSON.stringify(state.primaryOverrides))).to.eql([
            [null, 'FFFFFF', null]
          ]);
        });

        it('handles shorter gradients', () => {
          mockSearchAs(
            ['?g=11AA11-11BB11-11CC11-11DD11', 'p0=FFFFFE,'].join('&')
          );

          const state = getStateFromUrl();
          expect(JSON.parse(JSON.stringify(state.primaryOverrides))).to.eql([
            ['FFFFFE', null, null]
          ]);
        });

        it('ignores extra values in longer gradients', () => {
          mockSearchAs(
            ['?g=11AA11-11BB11-11CC11-11DD11', 'p0=FFFFFE,,,,,AAAAAA,'].join(
              '&'
            )
          );

          const state = getStateFromUrl();
          expect(JSON.parse(JSON.stringify(state.primaryOverrides))).to.eql([
            ['FFFFFE', null, null]
          ]);
        });
      });
    });
  });

  const mockSearchAs = (search) => {
    const mockWindow = { location: { search: search } };
    jest.spyOn(window, 'window', 'get').mockImplementation(() => mockWindow);
  };
});
