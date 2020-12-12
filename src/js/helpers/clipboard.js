const copyTextToClipboard = (text, fallbackOnPrompt = true) => {
  if (!navigator.clipboard) {
    fallbackOnPrompt ? copyFromPrompt() : null;
    return;
  }

  navigator.clipboard.writeText(text).catch((_err) => copyFromPrompt());
};

const copyFromPrompt = () => {
  window.prompt('Copy to clipboard: Ctrl+C, Enter', text);
};

export { copyTextToClipboard };
