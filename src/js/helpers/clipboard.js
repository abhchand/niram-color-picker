const copyFromPrompt = (text, fallbackOnPrompt) => {
  if (!fallbackOnPrompt) {
    return;
  }
  // eslint-disable-next-line
  window.prompt('Copy to clipboard: Ctrl+C, Enter', text);
};

const copyTextToClipboard = async (text, fallbackOnPrompt = true) => {
  if (!window.navigator || !window.navigator.clipboard) {
    copyFromPrompt(text, fallbackOnPrompt);
    return;
  }

  await window.navigator.clipboard
    .writeText(text)
    .catch((_err) => copyFromPrompt(text, fallbackOnPrompt));
};

export { copyTextToClipboard };
