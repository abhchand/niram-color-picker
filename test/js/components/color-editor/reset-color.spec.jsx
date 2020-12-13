import {
  RESET_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import ColorEditor from 'components/color-editor';
import eventBus from 'components/event-bus';
import { expect } from 'chai';
import HSLColor from 'models/hsl-color';
import { mockEventEmit } from 'js/support/mocks/event-bus';
import { mount } from 'enzyme';
import React from 'react';

let color, wrapper;

afterEach(() => {
  wrapper.unmount();
});

describe('Resetting Color', () => {
  beforeEach(() => {
    renderComponent();

    color = new HSLColor(180, 0.4, 0.5);
    eventBus.emit(UPDATE_SELECTED_COLOR, color);
    wrapper.update();
  });

  describe('on click', () => {
    it(`emits the ${RESET_SELECTED_COLOR} event`, () => {
      const mockEmit = mockEventEmit();

      resetColor();

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(RESET_SELECTED_COLOR);
    });
  });
});

const resetColor = () => {
  wrapper.find('.color-editor__reset button').at(0).simulate('click');
};

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  wrapper = mount(<ColorEditor {...props} />);
};
