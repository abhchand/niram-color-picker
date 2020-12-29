import {
  COLOR_GRID_UPDATED,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import {
  getColorGridAsJSON,
  setOverrideColor
} from 'js/support/components/color-grid/color-cells';
import { mockRandom, resetMockRandom } from 'jest-mock-random';
import { clickGradientRefreshBtn } from 'js/support/components/color-grid/refresh';
import ColorGrid from 'components/color-grid';
import { expect } from 'chai';
import HexColor from 'models/hex-color';
import { mockEventEmit } from 'js/support/mocks/event-bus';
import { mockWindowForReactComponent } from 'js/support/mocks/react/window';
import { mount } from 'enzyme';
import React from 'react';
import { transformColorGridtoHex } from 'js/support/components/color-grid/transform';

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

let mockReplaceState;

beforeEach(() => {
  mockReplaceState = jest.fn();

  mockWindowForReactComponent({
    location: {
      search: ''
    },
    history: {
      replaceState: mockReplaceState
    }
  });
});

afterEach(() => {
  global.wrapper.unmount();
});

describe('refreshing a gradient', () => {
  it('refreshes the row', () => {
    mockRandom(0.4);
    renderComponent();

    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', '40B052', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    /*
     * Click the refresh button for the 1st primary row
     * and verify it updates the row
     */

    resetMockRandom();
    mockRandom(0.75);
    clickGradientRefreshBtn('primary', 0);

    expect(getColorGridAsJSON()).to.eql({
      primary: [['602C5B', 'D154C4', 'F8C6F3']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });
  });

  it(`emits the ${UPDATE_SELECTED_COLOR} event`, () => {
    mockRandom(0.4);
    renderComponent();

    const mockEmit = mockEventEmit();

    resetMockRandom();
    mockRandom(0.75);
    clickGradientRefreshBtn('primary', 0);

    /*
     * Both `UPDATE_SELECTED_COLOR` and `COLOR_GRID_UPDATED` are
     * emitted, so there will be 2 calls
     */
    const calls = mockEmit.mock.calls;
    expect(calls.length).to.equal(2);
    expect(calls[0][0]).to.equal(UPDATE_SELECTED_COLOR);
    /*
     * The default selected color is the base color (middle color)
     * of the first row (primary gradient). Ensure it is the color
     * emitted after clicking the above button
     */
    expect(calls[0][1].toHex().value()).to.eql('D154C4');
  });

  it(`emits the ${COLOR_GRID_UPDATED} event`, () => {
    mockRandom(0.4);
    renderComponent();

    const mockEmit = mockEventEmit();

    resetMockRandom();
    mockRandom(0.75);
    clickGradientRefreshBtn('primary', 0);

    /*
     * Both `UPDATE_SELECTED_COLOR` and `COLOR_GRID_UPDATED` are
     * emitted, so there will be 2 calls
     */
    const calls = mockEmit.mock.calls;
    expect(calls.length).to.equal(2);
    expect(calls[1][0]).to.equal(COLOR_GRID_UPDATED);
    /*
     * The default selected color is the base color (middle color)
     * of the first row (primary gradient). Ensure it is the color
     * emitted after clicking the above button
     */
    expect(transformColorGridtoHex(calls[1][1])).to.eql(getColorGridAsJSON());
  });

  describe('an override is present', () => {
    const overrideColor = new HexColor('FAFAFA');

    beforeEach(() => {
      mockRandom(0.4);
      renderComponent();

      /*
       * Manually update the state to override the current
       * selected color. The default selected color is the
       * base color (middle color) of the first row (primary gradient)
       */
      setOverrideColor(overrideColor, {
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      });
    });

    it('resets the override', () => {
      expect(getColorGridAsJSON()).to.eql({
        primary: [['203724', overrideColor.value(), '9EECAA']],
        neutral: [['494949', '7E7A7E', 'B4AAB4']],
        accent: [
          ['372031', 'B04091', 'EC9ED6'],
          ['203726', '40B05F', '9EECB3']
        ]
      });

      /*
       * Click the refresh button for the 1st primary row
       * and verify it clears the override
       */

      resetMockRandom();
      mockRandom(0.75);
      clickGradientRefreshBtn('primary', 0);

      expect(getColorGridAsJSON()).to.eql({
        primary: [['602C5B', 'D154C4', 'F8C6F3']],
        neutral: [['494949', '7E7A7E', 'B4AAB4']],
        accent: [
          ['372031', 'B04091', 'EC9ED6'],
          ['203726', '40B05F', '9EECB3']
        ]
      });
    });
  });

  describe('refreshing a gradient that is not currently selected', () => {
    beforeEach(() => {
      mockRandom(0.4);
      renderComponent();
    });

    it('refreshes the row', () => {
      /*
       * Click the refresh button for the another row
       * (e.g. 2nd accent row)
       */

      resetMockRandom();
      mockRandom(0.75);
      clickGradientRefreshBtn('accent', 1);

      expect(getColorGridAsJSON()).to.eql({
        primary: [['203724', '40B052', '9EECAA']],
        neutral: [['494949', '7E7A7E', 'B4AAB4']],
        accent: [
          ['372031', 'B04091', 'EC9ED6'],
          ['602C5B', 'D154C4', 'F8C6F3']
        ]
      });
    });

    it(`emits the ${UPDATE_SELECTED_COLOR} event`, () => {
      const mockEmit = mockEventEmit();

      resetMockRandom();
      mockRandom(0.75);
      clickGradientRefreshBtn('accent', 1);

      /*
       * Both `UPDATE_SELECTED_COLOR` and `COLOR_GRID_UPDATED` are
       * emitted, so there will be 2 calls
       */
      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(2);
      expect(calls[0][0]).to.equal(UPDATE_SELECTED_COLOR);
      /*
       * The default selected color is the base color (middle color)
       * of the first row (primary gradient). Ensure it is the color
       * emitted after clicking the above button
       */
      expect(calls[0][1].toHex().value()).to.eql('40B052');
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorGrid {...props} />);
};
