const clickResetColorBtn = () => {
  global.wrapper.find('.color-editor__reset button').at(0).simulate('click');
};

const clickCopyToClipboardBtn = () => {
  copyToClipboardBtn().simulate('click');
};

const copyToClipboardBtn = () => {
  return global.wrapper.find('.copy-to-clipboard').at(0);
};

export { clickResetColorBtn, clickCopyToClipboardBtn, copyToClipboardBtn };
