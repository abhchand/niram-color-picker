import {
  RESET_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import { clickResetColorBtn } from 'js/support/components/color-editor/buttons';
import ColorEditor from 'components/color-editor';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import HSLColor from 'models/hsl-color';
import { mockEventEmit } from 'js/support/mocks/event-bus';
import { mount } from 'enzyme';
import React from 'react';

let color;

afterEach(() => {
  global.wrapper.unmount();
});

describe('Resetting Color', () => {
  beforeEach(() => {
    renderComponent();

    color = new HSLColor(180, 0.4, 0.5);
    eventBus.emit(UPDATE_SELECTED_COLOR, color);
    global.wrapper.update();
  });

  describe('on click', () => {
    it(`emits the ${RESET_SELECTED_COLOR} event`, () => {
      const mockEmit = mockEventEmit();

      clickResetColorBtn();

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(RESET_SELECTED_COLOR);
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorEditor {...props} />);
};
