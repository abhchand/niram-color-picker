const clickCopyToClipboardBtn = () => {
  global.wrapper
    .find('.color-export__modal .copy-to-clipboard')
    .at(0)
    .simulate('click');
};

const exportedSCSSText = () => {
  return global.wrapper.find('.color-export__scss').text();
};

const selectColorModel = (colorModel) => {
  const input = global.wrapper
    .find(`input[name='color_model[name]'][value='${colorModel}']`)
    .at(0);
  input.simulate('change');
};

export { clickCopyToClipboardBtn, exportedSCSSText, selectColorModel };
