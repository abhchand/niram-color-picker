import { expect } from 'chai';

const assetExportModalIsClosed = () => {
  expect(global.wrapper.exists('.color-export__modal')).to.equal(false);
};

const assetExportModalIsOpen = () => {
  expect(global.wrapper.exists('.color-export__modal')).to.equal(true);
};

const closeExportModal = () => {
  global.wrapper
    .find('.color-export__modal .button--hollow')
    .at(0)
    .simulate('click');
};

const openExportModalBtn = () => {
  return global.wrapper.find('.color-export__export').at(0);
};

const openExportModal = () => {
  openExportModalBtn().simulate('click');
};

export {
  assetExportModalIsClosed,
  assetExportModalIsOpen,
  closeExportModal,
  openExportModalBtn,
  openExportModal
};
