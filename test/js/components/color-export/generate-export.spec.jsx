import * as ClipboardHelpers from 'helpers/clipboard';
import {
  clickCopyToClipboardBtn,
  exportedSCSSText,
  selectColorModel
} from 'js/support/components/color-export/export';
import {
  generateColorGradients,
  generateGrayGradients
} from 'components/color-grid/gradients';
import { COLOR_GRID_UPDATED } from 'components/event-bus/events';
import ColorExport from 'components/color-export';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import HexColor from 'models/hex-color';
import HSLColor from 'models/hsl-color';
import { mount } from 'enzyme';
import { openExportModal } from 'js/support/components/color-export/modal';
import React from 'react';
import RGBColor from 'models/rgb-color';

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

afterEach(() => {
  global.wrapper.unmount();
});

describe('Export Modal', () => {
  let color, colorGrid, mockCopyTextToClipboard;

  beforeEach(() => {
    renderComponent();

    colorGrid = {
      primary: generateColorGradients(1),
      neutral: generateGrayGradients(1),
      accent: generateColorGradients(2)
    };

    eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
    global.wrapper.update();

    // Mock the "copy to clipboard" button functionality
    mockCopyTextToClipboard = jest.fn();
    jest
      .spyOn(ClipboardHelpers, 'copyTextToClipboard')
      .mockImplementation(mockCopyTextToClipboard);
  });

  describe('RGB is selected', () => {
    beforeEach(() => {
      // Manually set a single color for testing
      color = new RGBColor(20, 30, 40);
      colorGrid.primary[0].set(1, color);

      // Update the component (again)
      eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
      global.wrapper.update();

      openExportModal();
      selectColorModel('rgb');
    });

    it('generates the SCSS output', () => {
      /*
       * There are separate tests to validate the content
       * of the exported SCSS. Just check that our single
       * entry is included here.
       *
       * Since we updated the primary set's 1st gradient and set the value
       * for the 2nd (index: 1) gradient element, it should
       * appear as the `primary_0_200` color.
       */
      expect(exportedSCSSText()).to.match(
        /\$primary_0_200: rgb\(20, 30, 40\)/u
      );
    });

    it('user can copy the SCSS content', () => {
      clickCopyToClipboardBtn();

      const calls = mockCopyTextToClipboard.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.match(/\$primary_0_200: rgb\(20, 30, 40\)/u);
    });
  });

  describe('Hex is selected', () => {
    beforeEach(() => {
      // Manually set a single color for testing
      color = new HexColor('AB1299');
      colorGrid.primary[0].set(1, color);

      // Update the component (again)
      eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
      global.wrapper.update();

      openExportModal();
      selectColorModel('hex');
    });

    it('generates the SCSS output', () => {
      /*
       * There are separate tests to validate the content
       * of the exported SCSS. Just check that our single
       * entry is included here.
       *
       * Since we updated the primary set's 1st gradient and set the value
       * for the 2nd (index: 1) gradient element, it should
       * appear as the `primary_0_200` color.
       */
      expect(exportedSCSSText()).to.match(/\$primary_0_200: #AB1299/u);
    });

    it('user can copy the SCSS content', () => {
      clickCopyToClipboardBtn();

      const calls = mockCopyTextToClipboard.mock.calls;
      expect(calls.length).to.equal(1);
      expect(exportedSCSSText()).to.match(/\$primary_0_200: #AB1299/u);
    });
  });

  describe('HSL is selected', () => {
    beforeEach(() => {
      // Manually set a single color for testing
      color = new HSLColor(113, 0.4, 0.6);
      colorGrid.primary[0].set(1, color);

      // Update the component (again)
      eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
      global.wrapper.update();

      openExportModal();
      selectColorModel('hsl');
    });

    it('generates the SCSS output', () => {
      /*
       * There are separate tests to validate the content
       * of the exported SCSS. Just check that our single
       * entry is included here.
       *
       * Since we updated the primary set's 1st gradient and set the value
       * for the 2nd (index: 1) gradient element, it should
       * appear as the `primary_0_200` color.
       */
      expect(exportedSCSSText()).to.match(
        /\$primary_0_200: hsl\(113.0, 40.00%, 60.00%\)/u
      );
    });

    it('user can copy the SCSS content', () => {
      clickCopyToClipboardBtn();

      const calls = mockCopyTextToClipboard.mock.calls;
      expect(calls.length).to.equal(1);
      expect(exportedSCSSText()).to.match(
        /\$primary_0_200: hsl\(113.0, 40.00%, 60.00%\)/u
      );
    });
  });

  describe(`${COLOR_GRID_UPDATED} event is emittted`, () => {
    beforeEach(() => {
      // Manually set a single color for testing
      color = new RGBColor(20, 30, 40);
      colorGrid.primary[0].set(1, color);

      // Update the component (again)
      eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
      global.wrapper.update();

      openExportModal();
      selectColorModel('rgb');
    });

    it('updates the geneated SCSS content', () => {
      expect(exportedSCSSText()).to.match(
        /\$primary_0_200: rgb\(20, 30, 40\)/u
      );

      // Update the color
      color = new RGBColor(120, 130, 140);
      colorGrid.primary[0].set(1, color);

      // Update the component
      eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
      global.wrapper.update();

      expect(exportedSCSSText()).to.match(
        /\$primary_0_200: rgb\(120, 130, 140\)/u
      );
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorExport {...props} />);
};
