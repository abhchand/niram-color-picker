import { copyTextToClipboard } from 'helpers/clipboard';
import { expect } from 'chai';

let mockPrompt, mockWindow, mockWriteText;

beforeEach(() => {
  mockPrompt = jest.fn();
  mockWriteText = jest.fn(() => Promise.resolve());
  mockWindow = {
    prompt: mockPrompt,
    navigator: {
      clipboard: {
        writeText: mockWriteText
      }
    }
  };

  jest.spyOn(window, 'window', 'get').mockImplementation(() => mockWindow);
});

describe('copyTextToClipboard()', () => {
  it('copies the text to clipboard', async () => {
    await copyTextToClipboard('foo');

    const calls = mockWriteText.mock.calls;
    expect(calls.length).to.equal(1);
    expect(calls[0][0]).to.equal('foo');
  });

  describe('navigator clipboard is not supported', () => {
    beforeEach(() => {
      delete mockWindow.navigator;
    });

    it('falls back on the prompt', async () => {
      await copyTextToClipboard('foo');

      const calls = mockPrompt.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.match(/Copy to clipboard/u);
      expect(calls[0][1]).to.equal('foo');
    });

    describe('`fallbackOnPrompt` is set to `false`', () => {
      it('does not render the prompt', async () => {
        await copyTextToClipboard('foo', false);

        const calls = mockPrompt.mock.calls;
        expect(calls.length).to.equal(0);
      });
    });
  });

  describe('an error occurs in copying', () => {
    beforeEach(() => {
      mockWindow.navigator.clipboard.writeText = jest.fn(() =>
        Promise.reject(new Error('some error'))
      );
    });

    it('falls back on the prompt', async () => {
      await copyTextToClipboard('foo');

      const calls = mockPrompt.mock.calls;
      expect(calls.length).to.equal(1);
      expect(calls[0][0]).to.match(/Copy to clipboard/u);
      expect(calls[0][1]).to.equal('foo');
    });

    describe('`fallbackOnPrompt` is set to `false`', () => {
      it('does not render the prompt', async () => {
        await copyTextToClipboard('foo', false);

        const calls = mockPrompt.mock.calls;
        expect(calls.length).to.equal(0);
      });
    });
  });
});
