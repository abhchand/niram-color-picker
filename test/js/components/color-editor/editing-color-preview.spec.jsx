import {
  assertColorPicker,
  closeColorPicker,
  openColorPicker,
  setColorPicker,
  submitColorPicker
} from 'js/support/components/color-editor/color-picker';
import {
  assertPreviewColor,
  clickBrightenBtn,
  clickDarkenBtn
} from 'js/support/components/color-editor/color-preview';
import {
  getHSLInputValues,
  selectColorModel
} from 'js/support/components/color-editor/color-value';
import {
  OVERRIDE_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import ColorEditor from 'components/color-editor';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import HexColor from 'models/hex-color';
import HSLColor from 'models/hsl-color';
import { mockEventEmit } from 'js/support/mocks/event-bus';
import { mount } from 'enzyme';
import React from 'react';

jest.mock('components/color-editor/color-preview/constants', () => ({
  get NUM_SHADES() {
    return 5;
  }
}));

afterEach(() => {
  global.wrapper.unmount();
});

describe('Editing Color Preview', () => {
  let color;

  beforeEach(() => {
    renderComponent();

    color = new HSLColor(180, 0.4, 0.5);
    eventBus.emit(UPDATE_SELECTED_COLOR, color);
    global.wrapper.update();
  });

  describe('color preview', () => {
    it('renders the color preview', () => {
      assertPreviewColor(color);
    });

    describe(`${UPDATE_SELECTED_COLOR} event is emittted`, () => {
      it('updates the color preview', () => {
        assertPreviewColor(color);

        const newColor = new HSLColor(180, 0, 1);
        eventBus.emit(UPDATE_SELECTED_COLOR, newColor);
        global.wrapper.update();

        assertPreviewColor(newColor);
      });
    });
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
          global.wrapper.find('.color-editor__luminance-btn--darken')
        ).to.be.blank();
      });

      it('re-enables the button when the color is brightened', () => {
        clickBrightenBtn();

        expect(
          global.wrapper.find('.color-editor__luminance-btn--darken')
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
          global.wrapper.find('.color-editor__luminance-btn--brighten')
        ).to.be.blank();
      });

      it('re-enables the button when the color is brightened', () => {
        clickDarkenBtn();

        expect(
          global.wrapper.find('.color-editor__luminance-btn--brighten')
        ).to.not.be.blank();
      });
    });
  });

  describe('color picker', () => {
    it('has the correct color picker value', () => {
      openColorPicker();
      assertColorPicker(color);
    });

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

    describe(`${UPDATE_SELECTED_COLOR} event is emittted`, () => {
      it('updates the color picker value', () => {
        openColorPicker();
        assertColorPicker(color);
        closeColorPicker();

        const newColor = new HSLColor(180, 0, 1);
        eventBus.emit(UPDATE_SELECTED_COLOR, newColor);
        global.wrapper.update();

        openColorPicker();
        assertColorPicker(newColor);
      });
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorEditor {...props} />);
};
