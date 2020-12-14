import * as ClipboardHelpers from 'helpers/clipboard';
import { act } from 'react-dom/test-utils';
import CopyToClipboard from 'components/copy-to-clipboard';
import { expect } from 'chai';
import { mount } from 'enzyme';
import React from 'react';

let mockCopyTextToClipboard, text, wrapper;

jest.useFakeTimers();

afterEach(() => {
  wrapper.unmount();
  jest.clearAllTimers();
});

describe('Copying to Clipboard', () => {
  beforeEach(() => {
    text = 'text to copy';

    mockCopyTextToClipboard = jest.fn();
    jest
      .spyOn(ClipboardHelpers, 'copyTextToClipboard')
      .mockImplementation(mockCopyTextToClipboard);
  });

  it('renders the copy button', () => {
    renderComponent();
    // eslint-disable-next-line
    expect(copyToClipboardBtn()).to.not.be.null;
  });

  describe('on click', () => {
    it('copies text to the clipboard', () => {
      renderComponent();
      copyToClipboardBtn().simulate('click');

      const calls = mockCopyTextToClipboard.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.equal(text);
    });

    it('temporarily displays the success state', () => {
      renderComponent();

      expect(copyToClipboardBtn()).to.have.text('COPY');

      copyToClipboardBtn().simulate('click');
      expect(copyToClipboardBtn()).to.have.text('✅');

      act(() => jest.advanceTimersByTime(1000));
      expect(copyToClipboardBtn()).to.have.text('COPY');
    });

    describe('passing `fallbackOnPrompt` option', () => {
      it('defaults to true', () => {
        renderComponent();
        copyToClipboardBtn().simulate('click');

        const calls = mockCopyTextToClipboard.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][1]).to.equal(true);
      });

      it('can be overridden', () => {
        renderComponent({ fallbackOnPrompt: false });
        copyToClipboardBtn().simulate('click');

        const calls = mockCopyTextToClipboard.mock.calls;
        expect(calls.length).to.equal(1);
        expect(calls[0][1]).to.equal(false);
      });
    });
  });
});

const copyToClipboardBtn = () => {
  return wrapper.find('.copy-to-clipboard').at(0);
};

const renderComponent = (additionalProps = {}) => {
  const fixedProps = { text: text };
  const props = { ...fixedProps, ...additionalProps };

  wrapper = mount(<CopyToClipboard {...props} />);
};
