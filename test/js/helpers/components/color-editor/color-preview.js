import { expect } from 'chai';

const assertPreviewColor = (color) => {
  const colorCell = global.wrapper.find('.color-editor__color-cell');

  // Use substring to remove `#` prefix on hex color code
  const hexColorStr = colorCell.prop('style').backgroundColor.substring(1);

  expect(hexColorStr).to.equal(color.toHex().value());
};

const clickBrightenBtn = () => {
  global.wrapper
    .find('.color-editor__luminance-btn--brighten')
    .simulate('click');
};

const clickDarkenBtn = () => {
  global.wrapper.find('.color-editor__luminance-btn--darken').simulate('click');
};

export { assertPreviewColor, clickBrightenBtn, clickDarkenBtn };
