import {
  assertPreviewColor,
  clickBrightenBtn,
  clickDarkenBtn
} from 'js/support/components/color-editor/color-preview';
import {
  getColorGridAsJSON,
  getOverridentColorPositions,
  getSelectedColorPosition,
  setSelectedColorPosition
} from 'js/support/components/color-grid/color-cells';
import {
  getHexInputValues,
  selectColorModel,
  setInputValue
} from 'js/support/components/color-editor/color-value';
import { mockRandom, resetMockRandom } from 'jest-mock-random';
import {
  openColorPicker,
  setColorPickerValue,
  submitColorPicker
} from 'js/support/components/color-editor/color-picker';
import { clickGradientRefreshBtn } from 'js/support/components/color-grid/refresh';
import { clickResetColorBtn } from 'js/support/components/color-editor/buttons';
import { expect } from 'chai';
import { exportedSCSSText } from 'js/support/components/color-export/export';
import HexColor from 'models/hex-color';
import { mockWindowForReactComponent } from 'js/support/mocks/react/window';
import { openExportModal } from 'js/support/components/color-export/modal';
import { renderApplication } from 'js/support/application';

afterEach(() => {
  global.wrapper.unmount();
});

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

let mockReplaceState, windowSpy;

beforeEach(() => {
  mockReplaceState = jest.fn();

  windowSpy = mockWindowForReactComponent({
    location: {
      pathname: '/',
      search: ''
    },
    history: {
      replaceState: mockReplaceState
    },
    document: document
  });

  mockRandom(0.4);
  /*
   * The default selected color is the base color (middle color)
   * of the first row (primary gradient).
   */
  renderApplication();
});

describe('Color Picker', () => {
  it('sets up the corect state for other integration tests', () => {
    /*
     * This test exists purely to verify the current state of the
     * component so that we can be assured that all the other
     * intgration tests are starting from the correct state
     */

    // It has the correct preview
    assertPreviewColor(new HexColor('40B052'));

    // It has the correct color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('40B052');

    // It has the correct color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', '40B052', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([]);

    // It has the correct URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F'
    );

    // It has the correct exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(/\$primary_0_200: rgb\(64, 176, 95\)/u);
  });

  it('user can edit the input values', () => {
    selectColorModel('hex');
    setInputValue('hex', 'C9C9C9');

    // It updates the preview
    assertPreviewColor(new HexColor('C9C9C9'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('C9C9C9');

    // It updates color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', 'C9C9C9', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([
      {
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      }
    ]);

    // It updates the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F&p0=,C9C9C9,'
    );

    // It updates the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(
      /\$primary_0_200: rgb\(201, 201, 201\)/u
    );
  });

  it('user can lighten the color', () => {
    clickBrightenBtn();

    // It updates the preview
    assertPreviewColor(new HexColor('5FC56F'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('5FC56F');

    // It updates color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', '5FC56F', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([
      {
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      }
    ]);

    // It updates the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F&p0=,5FC56F,'
    );

    // It updates the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(
      /\$primary_0_200: rgb\(95, 197, 111\)/u
    );
  });

  it('user can darken the color', () => {
    clickDarkenBtn();

    // It updates the preview
    assertPreviewColor(new HexColor('328B41'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('328B41');

    // It updates color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', '328B41', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([
      {
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      }
    ]);

    // It updates the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F&p0=,328B41,'
    );

    // It updates the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(/\$primary_0_200: rgb\(50, 139, 65\)/u);
  });

  it('user can select a color from the color picker', async () => {
    openColorPicker();
    await setColorPickerValue(new HexColor('C9C9C9'));
    submitColorPicker();

    // It updates the preview
    assertPreviewColor(new HexColor('C9C9C9'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('C9C9C9');

    // It updates color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', 'C9C9C9', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([
      {
        gradientType: 'primary',
        gradientIdx: 0,
        positionIdx: 1
      }
    ]);

    // It updates the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F&p0=,C9C9C9,'
    );

    // It updates the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(
      /\$primary_0_200: rgb\(201, 201, 201\)/u
    );
  });

  it('user can reset an overridden color', () => {
    selectColorModel('hex');
    setInputValue('hex', 'C9C9C9');
    clickResetColorBtn();

    // It updates the preview
    assertPreviewColor(new HexColor('40B052'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('40B052');

    // It updates color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', '40B052', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([]);

    // It updates the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F'
    );

    // It updates the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(/\$primary_0_200: rgb\(64, 176, 82\)/u);
  });

  it('user can select a new color cell', () => {
    setSelectedColorPosition({
      gradientType: 'accent',
      gradientIdx: 1,
      positionIdx: 2
    });

    // It updates the preview
    assertPreviewColor(new HexColor('9EECB3'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('9EECB3');

    // It does not update the color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['203724', '40B052', '9EECAA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'accent',
      gradientIdx: 1,
      positionIdx: 2
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([]);

    // It does not update the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=40B052-7E7A7E-B04091-40B05F'
    );

    // It does not updatte the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(/\$primary_0_200: rgb\(64, 176, 82\)/u);
  });

  it('user can refresh a gradient', () => {
    /*
     * Change the randomized seed and refresh the currently
     * selected row
     */
    resetMockRandom();
    mockRandom(0.9);
    clickGradientRefreshBtn('primary', 0);

    // It updates the preview
    assertPreviewColor(new HexColor('DA8D62'));

    // It updates the color input value
    selectColorModel('hex');
    expect(getHexInputValues()).to.eql('DA8D62');

    // It updates color grid
    expect(getColorGridAsJSON()).to.eql({
      primary: [['74482F', 'DA8D62', 'FBE6DA']],
      neutral: [['494949', '7E7A7E', 'B4AAB4']],
      accent: [
        ['372031', 'B04091', 'EC9ED6'],
        ['203726', '40B05F', '9EECB3']
      ]
    });

    // It has the correct color cell selected
    expect(getSelectedColorPosition()).to.eql({
      gradientType: 'primary',
      gradientIdx: 0,
      positionIdx: 1
    });

    // It has the correct color cells marked as overriden
    expect(getOverridentColorPositions()).to.eql([]);

    // It updates the URL state
    const calls = mockReplaceState.mock.calls;
    expect(calls[calls.length - 1][2]).to.eql(
      '/?g=DA8D62-7E7A7E-B04091-40B05F'
    );

    // It updates the exported SCSS
    openExportModal();
    selectColorModel('rgb');
    expect(exportedSCSSText()).to.match(
      /\$primary_0_200: rgb\(218, 141, 98\)/u
    );
  });
});
