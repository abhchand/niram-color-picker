/*
 * When a React component loads, it makes several calls to various
 * `window` functions (e.g. like `addEventListener`).
 *
 * If we mock the `window` object, we also have to mock (or preserve)
 * these functions, otherwise React's internal library will raise
 * an error if it doesn't find it.
 *
 * The below function Mocks the `window` object for use inside a React
 * component. It does this by preserving a handful of required functions
 * that React will need.
 *
 * This is *not* a scalable or ideal way to implement this. This is a quick
 * workaround for a small component being tested. If this gets any
 * more complicated, considering other libraries that provide testing and
 * mocking solutions.
 */
const mockWindowForReactComponent = (windowImplementation) => {
  const requiredFunctions = {
    HTMLIFrameElement: window.HTMLIFrameElement,
    addEventListener: window.addEventListener,
    removeEventListener: window.removeEventListener
  };

  const defaults = {
    history: window.history,
    location: window.location
  };

  const mockImplementation = {
    ...requiredFunctions,
    ...defaults,
    ...windowImplementation
  };

  // eslint-disable-next-line
  const windowSpy = jest.spyOn(window, 'window', 'get');
  windowSpy.mockImplementation(() => mockImplementation);

  return windowSpy;
};

export { mockWindowForReactComponent };
