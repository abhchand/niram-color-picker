import { serializeGradients, serializeOverrides } from './serialize';
import { deserializeGradients, deserializeOverrides } from './deserialize';

const setUrlFromState = (state) => {
  const gradients = serializeGradients(state);
  const overrides = serializeOverrides(state);

  const params = [['g', gradients].join('=')];

  for (const key in overrides) {
    params.push([key, overrides[key]].join('='));
  }

  const urlSegments = ['/', '?', params.join('&')];
  window.history.replaceState({}, document.title, urlSegments.join(''));
};

const getStateFromUrl = () => {
  // Load URL params into an object
  const params = {},
    search = new URLSearchParams(window.location.search);
  search.forEach((value, key) => (params[key] = value));

  /*
   * Check for and parse `g`, the gradient param, which must exist
   * in order to parse the state
   */
  if (!params.g) {
    return null;
  }
  const gradientState = deserializeGradients(params.g);

  /*
   * Parse all other params, which are assumed to be various
   * overrides
   */
  delete params.g;
  const overrideState = deserializeOverrides(params);

  /*
   * Combine the gradient and override states to return a
   * unified state parsed from the URL
   */
  return { ...gradientState, ...overrideState };
};

export { setUrlFromState, getStateFromUrl };
