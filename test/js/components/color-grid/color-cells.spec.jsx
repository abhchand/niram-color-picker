import {
  COLOR_GRID_UPDATED,
  OVERRIDE_SELECTED_COLOR,
  RESET_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import {
  getColorGridAsJSON,
  getOverridentColorPositions,
  getSelectedColorPosition,
  setOverrideColor,
  setSelectedColorPosition
} from 'js/support/components/color-grid/color-cells';
import ColorGrid from 'components/color-grid';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import HexColor from 'models/hex-color';
import { mockEventEmit } from 'js/support/mocks/event-bus';
import { mockRandom } from 'jest-mock-random';
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

describe('color cells', () => {
  describe('selecting colors', () => {
    it('can select different color cells', () => {
      renderComponent();

      const curSelectedColor = {
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      };

      const newSelectedColor = {
        gradientType: 'accent',
        gradientIdx: 1,
        positionIdx: 2
      };

      expect(getSelectedColorPosition()).to.eql(curSelectedColor);
      setSelectedColorPosition(newSelectedColor);
      expect(getSelectedColorPosition()).to.eql(newSelectedColor);
    });

    it(`emits ${UPDATE_SELECTED_COLOR} when a color is selected`, () => {
      const mockEmit = mockEventEmit();

      renderComponent();

      // Events are emitted on component initialization, so clear those
      mockEmit.mockClear();

      setSelectedColorPosition({
        gradientType: 'accent',
        gradientIdx: 1,
        positionIdx: 2
      });

      // Find the actual color at this position
      const expectedColor = getColorGridAsJSON().accent[1][2];

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(UPDATE_SELECTED_COLOR);
      expect(calls[0][1].toHex().value()).to.eql(expectedColor);
    });
  });

  describe(`${OVERRIDE_SELECTED_COLOR} event is emittted`, () => {
    const overrideColor = new HexColor('FAFAFA');

    const triggerEmit = () => {
      eventBus.emit(OVERRIDE_SELECTED_COLOR, overrideColor);
      global.wrapper.update();
    };

    let initialColorGridJSON, mockEmit;

    beforeEach(() => {
      mockRandom(0.4);
      renderComponent();

      initialColorGridJSON = getColorGridAsJSON();
      mockEmit = mockEventEmit();
    });

    it('overrides the color', () => {
      triggerEmit();

      const newColorGridJSON = getColorGridAsJSON();

      /*
       * The default selected color is the base color (middle color)
       * of the first row (primary gradient). Ensure it changes
       * before and after the event is emitted
       */

      const beforeValue = initialColorGridJSON.primary[0][1];
      const afterValue = newColorGridJSON.primary[0][1];

      expect(afterValue).to.equal(overrideColor.value());
      expect(afterValue).to.not.equal(beforeValue);

      /*
       * Ensure that none of the other colors changed. We do this
       * by reverting the single selected color and ensuring that
       * the before/after color grids are equal.
       */

      newColorGridJSON.primary[0][1] = beforeValue;
      expect(newColorGridJSON).to.eql(initialColorGridJSON);
    });

    it('adds the selector class for the overriden color', () => {
      /*
       * The default selected color is the base color (middle color)
       * of the first row (primary gradient). Ensure it changes
       * before and after the event is emitted
       */

      expect(getOverridentColorPositions()).to.eql([]);

      triggerEmit();

      expect(getOverridentColorPositions()).to.eql([
        {
          gradientType: 'primary',
          gradientIdx: 0,
          positionIdx: 1
        }
      ]);
    });

    it('updates the url with the new color grid state', () => {
      // Clear any calls to `replaceState` that occurred during initialization
      mockReplaceState.mockClear();

      triggerEmit();

      const calls = mockReplaceState.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][2]).to.eql('/?g=40B052-7E7A7E-B04091-40B05F&p0=,FAFAFA,');
    });

    it(`emits ${UPDATE_SELECTED_COLOR} with the new selected color`, () => {
      triggerEmit();

      /*
       * There will be 3 calls too `eventBus.emit`
       *
       *  - OVERRIDE_SELECTED_COLOR (event emit triggered above)
       *  - UPDATE_SELECTED_COLOR (tested here)
       *  - COLOR_GRID_UPDATED (tested separately)
       */

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(3);

      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);

      expect(calls[1][0]).to.equal(UPDATE_SELECTED_COLOR);
      expect(calls[1][1].value()).to.eql(overrideColor.value());
    });

    it(`emits ${COLOR_GRID_UPDATED} with the updated color grid`, () => {
      triggerEmit();

      const newColorGridJSON = getColorGridAsJSON();

      /*
       * There will be 3 calls too `eventBus.emit`
       *
       *  - OVERRIDE_SELECTED_COLOR (event emit triggered above)
       *  - UPDATE_SELECTED_COLOR (tested separately)
       *  - COLOR_GRID_UPDATED (tested here)
       */

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(3);

      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);

      expect(calls[2][0]).to.equal(COLOR_GRID_UPDATED);
      expect(transformColorGridtoHex(calls[2][1])).to.eql(newColorGridJSON);
    });
  });

  describe(`${RESET_SELECTED_COLOR} event is emittted`, () => {
    const overrideColor = new HexColor('FAFAFA');

    const triggerEmit = () => {
      eventBus.emit(RESET_SELECTED_COLOR, overrideColor);
      global.wrapper.update();
    };

    let initialColorGridJSON, mockEmit;

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

      initialColorGridJSON = getColorGridAsJSON();
      mockEmit = mockEventEmit();
    });

    it('resets the color', () => {
      triggerEmit();

      const newColorGridJSON = getColorGridAsJSON();

      /*
       * The default selected color is the base color (middle color)
       * of the first row (primary gradient). Ensure it changes (resets)
       * before and after the event is emitted
       */

      const beforeValue = initialColorGridJSON.primary[0][1];
      const afterValue = newColorGridJSON.primary[0][1];

      expect(beforeValue).to.equal(overrideColor.value());
      expect(afterValue).to.equal('40B052');

      /*
       * Ensure that none of the other colors changed. We do this
       * by reverting the single selected color and ensuring that
       * the before/after color grids are equal.
       */

      newColorGridJSON.primary[0][1] = beforeValue;
      expect(newColorGridJSON).to.eql(initialColorGridJSON);
    });

    it('updates the url with the new color grid state', () => {
      // Clear any calls to `replaceState` that occurred during initialization
      mockReplaceState.mockClear();

      triggerEmit();

      const calls = mockReplaceState.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][2]).to.eql('/?g=40B052-7E7A7E-B04091-40B05F');
    });

    it(`emits ${UPDATE_SELECTED_COLOR} with the new selected color`, () => {
      triggerEmit();

      /*
       * There will be 3 calls too `eventBus.emit`
       *
       *  - RESET_SELECTED_COLOR (event emit triggered above)
       *  - UPDATE_SELECTED_COLOR (tested here)
       *  - COLOR_GRID_UPDATED (tested separately)
       */

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(3);

      expect(calls[0][0]).to.equal(RESET_SELECTED_COLOR);

      expect(calls[1][0]).to.equal(UPDATE_SELECTED_COLOR);
      expect(calls[1][1].toHex().value()).to.eql('40B052');
    });

    it(`emits ${COLOR_GRID_UPDATED} with the updated color grid`, () => {
      triggerEmit();

      const newColorGridJSON = getColorGridAsJSON();

      /*
       * There will be 3 calls too `eventBus.emit`
       *
       *  - RESET_SELECTED_COLOR (event emit triggered above)
       *  - UPDATE_SELECTED_COLOR (tested separately)
       *  - COLOR_GRID_UPDATED (tested here)
       */

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(3);

      expect(calls[0][0]).to.equal(RESET_SELECTED_COLOR);

      expect(calls[2][0]).to.equal(COLOR_GRID_UPDATED);
      expect(transformColorGridtoHex(calls[2][1])).to.eql(newColorGridJSON);
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorGrid {...props} />);
};
