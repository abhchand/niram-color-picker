import {
  COLOR_GRID_UPDATED,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import {
  getColorGridAsJSON,
  getSelectedColorPosition
} from 'js/support/components/color-grid/color-cells';
import ColorGrid from 'components/color-grid';
import { expect } from 'chai';
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

afterEach(() => {
  global.wrapper.unmount();
});

describe('Initializing <ColorGrid />', () => {
  it('initializes a random color grid', () => {
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
  });

  it('sets the URL based on initial state', () => {
    const mockReplaceState = jest.fn();

    mockWindowForReactComponent({
      history: {
        replaceState: mockReplaceState
      }
    });

    mockRandom(0.4);
    renderComponent();

    const calls = mockReplaceState.mock.calls;
    expect(calls.length).to.equal(1);
    expect(calls[0][2]).to.eql('/?g=40B052-7E7A7E-B04091-40B05F');
  });

  it('sets the initial selected cell as the base color of the first row', () => {
    renderComponent();

    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });
  });

  it(`emits the ${UPDATE_SELECTED_COLOR} event`, () => {
    const mockEmit = mockEventEmit();

    mockRandom(0.4);
    renderComponent();

    /*
     * Both `UPDATE_SELECTED_COLOR` and `COLOR_GRID_UPDATED` are
     * emitted, so there will be 2 calls
     */
    const calls = mockEmit.mock.calls;
    expect(calls.length).to.equal(2);
    expect(calls[0][0]).to.equal(UPDATE_SELECTED_COLOR);
    expect(calls[0][1].toHex().value()).to.eql('40B052');
  });

  it(`emits the ${COLOR_GRID_UPDATED} event`, () => {
    const mockEmit = mockEventEmit();

    mockRandom(0.4);
    renderComponent();

    /*
     * Both `UPDATE_SELECTED_COLOR` and `COLOR_GRID_UPDATED` are
     * emitted, so there will be 2 calls
     */
    const calls = mockEmit.mock.calls;
    expect(calls.length).to.equal(2);
    expect(calls[1][0]).to.equal(COLOR_GRID_UPDATED);
    expect(transformColorGridtoHex(calls[1][1])).to.eql({
      primary: [['203724', '40B052', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });
  });

  describe('url params are present', () => {
    it('initializes the color grid from the URL', () => {
      mockWindowForReactComponent({
        location: {
          search: '?g=40B052-7E7A7E-B04091-40B05F'
        }
      });

      renderComponent();

      expect(getColorGridAsJSON()).to.eql({
        primary: [['203724', '40B052', '9EECAA']],
        neutral: [['494949', '7E7A7E', 'B4AAB4']],
        accent: [
          ['372031', 'B04091', 'EC9ED6'],
          ['203726', '40B05F', '9EECB3']
        ]
      });
    });

    it('(re-)sets the URL based on initial state', () => {
      const mockReplaceState = jest.fn();

      mockWindowForReactComponent({
        location: {
          search: '?g=40B052-7E7A7E-B04091-40B05F'
        },
        history: {
          replaceState: mockReplaceState
        }
      });

      mockRandom(0.4);
      renderComponent();

      const calls = mockReplaceState.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][2]).to.eql('/?g=40B052-7E7A7E-B04091-40B05F');
    });

    it('sets the initial selected cell as the base color of the first row', () => {
      mockWindowForReactComponent({
        location: {
          search: '?g=40B052-7E7A7E-B04091-40B05F'
        }
      });

      renderComponent();

      expect(getSelectedColorPosition()).to.eql({
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      });
    });

    describe('url is invalid', () => {
      it('ignores the url and initializes a new color grid', () => {
        mockWindowForReactComponent({
          location: {
            search: '?g=XXXXX'
          }
        });

        /*
         * Pick a different seed than the tests above to
         * verify with a new result
         */
        mockRandom(0.9);
        renderComponent();

        expect(getColorGridAsJSON()).to.eql({
          primary: [['74482F', 'DA8D62', 'FBE6DA']],
          neutral: [['656565', '949D9D', 'C7D0D0']],
          accent: [
            ['2F746C', '62DACC', 'DAFBF7'],
            ['742F37', 'DA6270', 'FBDADE']
          ]
        });
      });
    });
  });
});

const renderComponent = (additionalProps = {}) => {
  const fixedProps = {};
  const props = { ...fixedProps, ...additionalProps };

  global.wrapper = mount(<ColorGrid {...props} />);
};
