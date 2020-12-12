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
import RGBColor from 'models/rgb-color';

let wrapper;

afterEach(() => {
  wrapper.unmount();
});

describe('Editing Color Value', () => {
  describe('before any color is dispatched', () => {
    it('renders nothing', () => {
      renderComponent();
      expect(wrapper.isEmptyRender()).to.equal(true);
    });
  });

  it('renders the color model radio buttons, defaulting to RGB', () => {
    renderComponent();

    const color = new RGBColor(100, 120, 140);
    eventBus.emit(UPDATE_SELECTED_COLOR, color);
    wrapper.update();

    let e;

    /* eslint-disable no-unused-expressions */
    e = wrapper.find("#color_model_name_0[value='rgb']").at(0);
    expect(e).to.not.be.null;
    expect(e).to.be.checked;

    e = wrapper.find("#color_model_name_1[value='hex']").at(0);
    expect(e).to.not.be.null;
    expect(e).to.not.be.checked;

    e = wrapper.find("#color_model_name_2[value='hsl']").at(0);
    expect(e).to.not.be.null;
    expect(e).to.not.be.checked;
    /* eslint-enable no-unused-expressions */
  });

  describe('RGB is selected', () => {
    let color;

    beforeEach(() => {
      renderComponent();

      color = new RGBColor(100, 120, 140);
      eventBus.emit(UPDATE_SELECTED_COLOR, color);
      wrapper.update();

      selectColorModel('rgb');
    });

    it('renders the RGB components', () => {
      expect(getRGBInputValues()).to.eql({ r: 100, g: 120, b: 140 });
    });

    it('updates the color as the components change', () => {
      assertPreviewColor(color);

      // Test change to `R`
      setInputValue('r', 101);
      assertPreviewColor(new RGBColor(101, 120, 140));

      // Test change to `G`
      setInputValue('g', 121);
      assertPreviewColor(new RGBColor(101, 121, 140));

      // Test change to `B`
      setInputValue('b', 141);
      assertPreviewColor(new RGBColor(101, 121, 141));
    });

    it(`emits the ${OVERRIDE_SELECTED_COLOR} event as the components change`, () => {
      const mockEmit = mockEventEmit();

      setInputValue('r', 101);

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);
      expect(calls[0][1].value()).to.eql(new RGBColor(101, 120, 140).value());
    });

    it('preserves the updates when switching away and back to RGB', () => {
      // Validate the color preview is correct

      setInputValue('r', 101);
      assertPreviewColor(new RGBColor(101, 120, 140));

      selectColorModel('hex');
      assertPreviewColor(new RGBColor(101, 120, 140));

      selectColorModel('rgb');
      assertPreviewColor(new RGBColor(101, 120, 140));

      // Validate the input values

      expect(getRGBInputValues()).to.eql({ r: 101, g: 120, b: 140 });
    });

    describe('components are changed to an invalid value', () => {
      it('does not update the color', () => {
        // Test bad input on each channel
        ['r', 'g', 'b'].forEach((channel) => {
          // Test various bad inputs - the color should never change
          [-1, 256, 'a'].forEach((input) => {
            setInputValue(channel, input);
            assertPreviewColor(new RGBColor(100, 120, 140));
          });
        });
      });

      it('does not preserve the updates when switching away and back to RGB', () => {
        // Validate the color preview is correct

        setInputValue('r', -1);
        assertPreviewColor(new RGBColor(100, 120, 140));

        selectColorModel('hex');
        assertPreviewColor(new RGBColor(100, 120, 140));

        selectColorModel('rgb');
        assertPreviewColor(new RGBColor(100, 120, 140));

        // Validate the input values

        expect(getRGBInputValues()).to.eql({ r: 100, g: 120, b: 140 });
      });
    });
  });

  describe('Hex is selected', () => {
    let color;

    beforeEach(() => {
      renderComponent();

      color = new HexColor('AA11FF');
      eventBus.emit(UPDATE_SELECTED_COLOR, color);
      wrapper.update();

      selectColorModel('hex');
    });

    it('renders the Hex components', () => {
      expect(getHexInputValues()).to.eql('AA11FF');
    });

    it('updates the color as the components change', () => {
      assertPreviewColor(color);

      setInputValue('hex', 'BB22FF');
      assertPreviewColor(new HexColor('BB22FF'));
    });

    it('is case insensitive', () => {
      assertPreviewColor(color);

      setInputValue('hex', 'bb22ff');
      assertPreviewColor(new HexColor('BB22FF'));
    });

    it(`emits the ${OVERRIDE_SELECTED_COLOR} event as the components change`, () => {
      const mockEmit = mockEventEmit();

      setInputValue('hex', 'BB22FF');

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);
      expect(calls[0][1].value()).to.eql(new HexColor('BB22FF').value());
    });

    it('preserves the updates when switching away and back to Hex', () => {
      // Validate the color preview is correct

      setInputValue('hex', 'BB22FF');
      assertPreviewColor(new HexColor('BB22FF'));

      selectColorModel('rgb');
      assertPreviewColor(new HexColor('BB22FF'));

      selectColorModel('hex');
      assertPreviewColor(new HexColor('BB22FF'));

      // Validate the input values

      expect(getHexInputValues()).to.eql('BB22FF');
    });

    describe('components are changed to an invalid value', () => {
      it('does not update the color', () => {
        setInputValue('hex', 'ZZZZZZ');
        assertPreviewColor(new HexColor('AA11FF'));
      });

      it('does not preserve the updates when switching away and back to Hex', () => {
        // Validate the color preview is correct

        setInputValue('hex', 'ZZZZZZ');
        assertPreviewColor(new HexColor('AA11FF'));

        selectColorModel('rgb');
        assertPreviewColor(new HexColor('AA11FF'));

        selectColorModel('hex');
        assertPreviewColor(new HexColor('AA11FF'));

        // Validate the input values

        expect(getHexInputValues()).to.eql('AA11FF');
      });
    });
  });

  describe('HSL is selected', () => {
    let color;

    beforeEach(() => {
      renderComponent();

      color = new HSLColor(100, 0.4, 0.6);
      eventBus.emit(UPDATE_SELECTED_COLOR, color);
      wrapper.update();

      selectColorModel('hsl');
    });

    it('renders the HSL components', () => {
      expect(getHSLInputValues()).to.eql({ h: 100, s: 0.4, l: 0.6 });
    });

    it('updates the color as the components change', () => {
      assertPreviewColor(color);

      // Test change to `H`
      setInputValue('h', 101);
      assertPreviewColor(new HSLColor(101, 0.4, 0.6));

      // Test change to `S`
      setInputValue('s', 0.41);
      assertPreviewColor(new HSLColor(101, 0.41, 0.6));

      // Test change to `L'
      setInputValue('l', 0.61);
      assertPreviewColor(new HSLColor(101, 0.41, 0.61));
    });

    it(`emits the ${OVERRIDE_SELECTED_COLOR} event as the components change`, () => {
      const mockEmit = mockEventEmit();

      setInputValue('h', 101);

      const calls = mockEmit.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(OVERRIDE_SELECTED_COLOR);
      expect(calls[0][1].value()).to.eql(new HSLColor(101, 0.4, 0.6).value());
    });

    it('preserves the updates when switching away and back to HSL', () => {
      // Validate the color preview is correct

      setInputValue('h', 101);
      assertPreviewColor(new HSLColor(101, 0.4, 0.6));

      selectColorModel('hex');
      assertPreviewColor(new HSLColor(101, 0.4, 0.6));

      selectColorModel('hsl');
      assertPreviewColor(new HSLColor(101, 0.4, 0.6));

      // Validate the input values

      expect(getHSLInputValues()).to.eql({ h: 101, s: 0.4, l: 0.6 });
    });

    describe('components are changed to an invalid value', () => {
      it('does not update the color', () => {
        // Test bad input on each channel

        ['h'].forEach((channel) => {
          // Test various bad inputs - the color should never change
          [-1, 361, 'a'].forEach((input) => {
            setInputValue(channel, input);
            assertPreviewColor(new HSLColor(100, 0.4, 0.6));
          });
        });

        ['s', 'l'].forEach((channel) => {
          // Test various bad inputs - the color should never change
          [-1, 1.1, 'a'].forEach((input) => {
            setInputValue(channel, input);
            assertPreviewColor(new HSLColor(100, 0.4, 0.6));
          });
        });
      });

      it('does not preserve the updates when switching away and back to HSL', () => {
        // Validate the color preview is correct

        setInputValue('h', -1);
        assertPreviewColor(new HSLColor(100, 0.4, 0.6));

        selectColorModel('hex');
        assertPreviewColor(new HSLColor(100, 0.4, 0.6));

        selectColorModel('hsl');
        assertPreviewColor(new HSLColor(100, 0.4, 0.6));

        // Validate the input values

        expect(getHSLInputValues()).to.eql({ h: 100, s: 0.4, l: 0.6 });
      });
    });
  });
});

const getHexInputValues = () => {
  return getInputValue('hex');
};

const getHSLInputValues = () => {
  return {
    h: parseFloat(getInputValue('h')),
    s: parseFloat(getInputValue('s')),
    l: parseFloat(getInputValue('l'))
  };
};

const getRGBInputValues = () => {
  return {
    r: parseInt(getInputValue('r'), 10),
    g: parseInt(getInputValue('g'), 10),
    b: parseInt(getInputValue('b'), 10)
  };
};

const getInputValue = (channel) => {
  return wrapper.find(`#color_component_${channel}`).at(0).prop('value');
};

const setInputValue = (channel, value) => {
  const input = wrapper.find(`#color_component_${channel}`).at(0);
  input.getDOMNode().value = value;
  input.simulate('change');
};

const assertPreviewColor = (color) => {
  const colorCell = wrapper.find('.color-editor__color-cell');

  // Use substring to remove `#` prefix on hex color code
  const hexColorStr = colorCell.prop('style').backgroundColor.substring(1);

  expect(hexColorStr).to.equal(color.toHex().value());
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
