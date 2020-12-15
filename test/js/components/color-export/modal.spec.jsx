import {
  assetExportModalIsClosed,
  assetExportModalIsOpen,
  closeExportModal,
  openExportModal,
  openExportModalBtn
} from 'js/helpers/components/color-export/modal';
import {
  generateColorGradients,
  generateGrayGradients
} from 'components/color-grid/gradients';
import { COLOR_GRID_UPDATED } from 'components/event-bus/events';
import ColorExport from 'components/color-export';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

afterEach(() => {
  global.wrapper.unmount();
});

describe('Export Modal', () => {
  it('renders nothing', () => {
    renderComponent();
    expect(global.wrapper.isEmptyRender()).to.equal(true);
  });

  describe('component has received color grid data', () => {
    let colorGrid;

    beforeEach(() => {
      renderComponent();

      colorGrid = {
        primary: generateColorGradients(1),
        neutral: generateGrayGradients(1),
        accent: generateColorGradients(2)
      };

      eventBus.emit(COLOR_GRID_UPDATED, colorGrid);
      global.wrapper.update();
    });

    it('renders the button and a closed modal', () => {
      // eslint-disable-next-line
      expect(openExportModalBtn()).to.not.be.null;
      assetExportModalIsClosed();
    });

    it('user can open and close the modal', () => {
      assetExportModalIsClosed();

      openExportModal();
      assetExportModalIsOpen();

      closeExportModal();
      assetExportModalIsClosed();
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorExport {...props} />);
};
