import {
  OVERRIDE_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import { act } from 'react-dom/test-utils';
import ColorEditor from 'components/color-editor';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import HexColor from 'models/hex-color';
import HSLColor from 'models/hsl-color';
import { mockEventEmit } from 'js/support/mocks/event-bus';
import { mount } from 'enzyme';
import React from 'react';

let wrapper;

jest.mock('components/color-editor/color-preview/constants', () => ({
  get NUM_SHADES() {
    return 5;
  }
}));

afterEach(() => {
  wrapper.unmount();
});

describe('Editing Color Preview', () => {
  let color;

  beforeEach(() => {
    renderComponent();

    color = new HSLColor(180, 0.4, 0.5);
    eventBus.emit(UPDATE_SELECTED_COLOR, color);
    wrapper.update();
  });

  it('renders the color preview', () => {
    assertPreviewColor(color);
  });

  describe('clicking the darken button', () => {
    /*
     * NOTE: 5 shades means each brighten / darken changes
     * luminances by 1/5 = 0.2
     */

    it('darkens the color in fixed increments', () => {
      clickDarkenBtn();
      assertPreviewColor(new HSLColor(180, 0.4, 0.3));
    });

    it('updates the color value components', () => {
      // No need to check all color models, just settle for testing HSL
      selectColorModel('hsl');

      clickDarkenBtn();
      expect(getHSLInputValues()).to.eql({ h: 180, s: 0.4, l: 0.3 });
    });

    it(`emits the ${OVERRIDE_SELECTED_COLOR} event when the color is updated`, () => {
      // No need to check all color models, just settle for testing HSL
      selectColorModel('hsl');

      const mockEmit = mockEventEmit();

      clickDarkenBtn();

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);
      expect(calls[0][1].value()).to.eql(new HSLColor(180, 0.4, 0.3).value());
    });

    describe('color cannot be darkened further', () => {
      beforeEach(() => {
        /*
         * With a step size of 1 / 5 = 0.2 and starting from luminance
         * of 0.5, we can darken twice
         */
        clickDarkenBtn();
        clickDarkenBtn();
        assertPreviewColor(new HSLColor(180, 0.4, 0.1));
      });

      it('disables the button', () => {
        /*
         * "Disable" in this context means we don't render the button and instead
         * replace it with a placeholder
         */
        expect(
          wrapper.find('.color-editor__luminance-btn--darken')
        ).to.be.blank();
      });

      it('re-enables the button when the color is brightened', () => {
        clickBrightenBtn();

        expect(
          wrapper.find('.color-editor__luminance-btn--darken')
        ).to.not.be.blank();
      });
    });
  });

  describe('clicking the brighten button', () => {
    /*
     * NOTE: 5 shades means each brighten / darken changes
     * luminances by 1/5 = 0.2
     */

    it('brightens the color in fixed increments', () => {
      clickBrightenBtn();
      assertPreviewColor(new HSLColor(180, 0.4, 0.7));
    });

    it('updates the color value components', () => {
      // No need to check all color models, just settle for testing HSL
      selectColorModel('hsl');

      clickBrightenBtn();
      expect(getHSLInputValues()).to.eql({ h: 180, s: 0.4, l: 0.7 });
    });

    it(`emits the ${OVERRIDE_SELECTED_COLOR} event when the color is updated`, () => {
      // No need to check all color models, just settle for testing HSL
      selectColorModel('hsl');

      const mockEmit = mockEventEmit();

      clickBrightenBtn();

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);
      expect(calls[0][1].value()).to.eql(new HSLColor(180, 0.4, 0.7).value());
    });

    describe('color cannot be brightened further', () => {
      beforeEach(() => {
        /*
         * With a step size of 1 / 5 = 0.2 and starting from luminance
         * of 0.5, we can brighten twice
         */
        clickBrightenBtn();
        clickBrightenBtn();
        assertPreviewColor(new HSLColor(180, 0.4, 0.9));
      });

      it('disables the button', () => {
        /*
         * "Disable" in this context means we don't render the button and instead
         * replace it with a placeholder
         */
        expect(
          wrapper.find('.color-editor__luminance-btn--brighten')
        ).to.be.blank();
      });

      it('re-enables the button when the color is brightened', () => {
        clickDarkenBtn();

        expect(
          wrapper.find('.color-editor__luminance-btn--brighten')
        ).to.not.be.blank();
      });
    });
  });

  describe('opening the color picker', () => {
    it('user can select a new color', async () => {
      const newColor = new HSLColor(22, 0.1, 0.9);

      openColorPicker();
      await setColorPicker(newColor);
      submitColorPicker();

      assertPreviewColor(newColor);
    });

    it(`emits the ${OVERRIDE_SELECTED_COLOR} event when the color is updated`, async () => {
      const newColor = new HexColor('AA12FC');
      const mockEmit = mockEventEmit();

      openColorPicker();
      await setColorPicker(newColor);
      submitColorPicker();

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);
      expect(calls[0][1].value()).to.eql(
        new HexColor('AA12FC').toHSL().value()
      );
    });

    it('user can cancel and keep this color', async () => {
      const newColor = new HSLColor(22, 0.1, 0.9);

      openColorPicker();
      await setColorPicker(newColor);
      closeColorPicker();

      assertPreviewColor(color);
    });
  });
});

const clickBrightenBtn = () => {
  wrapper.find('.color-editor__luminance-btn--brighten').simulate('click');
};

const clickDarkenBtn = () => {
  wrapper.find('.color-editor__luminance-btn--darken').simulate('click');
};

const getHSLInputValues = () => {
  return {
    h: parseFloat(getInputValue('h')),
    s: parseFloat(getInputValue('s')),
    l: parseFloat(getInputValue('l'))
  };
};

const getInputValue = (channel) => {
  return wrapper.find(`#color_component_${channel}`).at(0).prop('value');
};

const assertPreviewColor = (color) => {
  const colorCell = wrapper.find('.color-editor__color-cell');

  // Use substring to remove `#` prefix on hex color code
  const hexColorStr = colorCell.prop('style').backgroundColor.substring(1);

  expect(hexColorStr).to.equal(color.toHex().value());
};

const openColorPicker = () => {
  wrapper.find('.color-editor__color-cell').at(0).simulate('click');
};

const setColorPicker = async (color) => {
  /*
   * The `react-color` library which provides the color picker
   * adds a 100ms debounce on the input to prevent duplicate
   * changes in a short time period.
   *
   * To account for that, we add in a 100ms delay, which also needs
   * to be wrapped in `act()` since it asynchronously completes
   * and updates the Color Picker modal DOM with the newly selected color.
   */
  await act(async () => {
    /*
     * The `id` for this input (generated by `react-color`) seems to change across
     * NodeJS and the browser. Instead, just look for what shouldb be the only
     * `<input />` rendered.
     */
    const input = wrapper.find('.chrome-picker input').at(0);
    input.getDOMNode().value = `#${color.toHex().value()}`;
    input.simulate('change');

    await new Promise((r) => setTimeout(r, 100));
  });
};

const submitColorPicker = () => {
  wrapper.find('.color-editor__modal-btns > button').at(0).simulate('click');
};

const closeColorPicker = () => {
  wrapper
    .find('.color-editor__modal-btns .button--hollow')
    .at(0)
    .simulate('click');
};

const selectColorModel = (colorModel) => {
  const input = wrapper
    .find(`input[name='color_model[name]'][value='${colorModel}']`)
    .at(0);
  input.simulate('change');
};

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  wrapper = mount(<ColorEditor {...props} />);
};
