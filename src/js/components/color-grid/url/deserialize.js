import {
  generateColorGradientsFromBaseColors,
  generateGrayGradientsFromBaseColors,
  generateNullGradients
} from '../gradients';
import {
  NUM_ACCENT_GRADIENTS,
  NUM_NEUTRAL_GRADIENTS,
  NUM_PRIMARY_GRADIENTS
} from '../constants';
import Gradient from 'models/gradient';
import { GRADIENT_LEN } from '../constants';
import HexColor from 'models/hex-color';

const NUM_GRADIENTS =
  NUM_PRIMARY_GRADIENTS + NUM_NEUTRAL_GRADIENTS + NUM_ACCENT_GRADIENTS;

const OVERRIDE_PARAM_PATTERN = /^([pna])(\d+)$/;

const deserializeGradients = (paramValue) => {
  // Parse each token separated by '-' as a hex color
  const segments = (paramValue || '').split('-').map((s) => new HexColor(s));

  // If parsed values are invaid, return null
  if (!segments.every((hc) => hc.isValid())) {
    return null;
  }
  if (segments.length !== NUM_GRADIENTS) {
    return null;
  }

  // Separate by type
  const take = (array, numToTake) => {
    const taken = [];
    for (let i = 0; i < numToTake; i++) {
      taken.push(array.shift());
    }
    return taken;
  };
  const primaryGradients = take(segments, NUM_PRIMARY_GRADIENTS);
  const neutralGradients = take(segments, NUM_NEUTRAL_GRADIENTS);
  const accentGradients = take(segments, NUM_ACCENT_GRADIENTS);

  // Expand each base color into a gradient
  return {
    primaryGradients: generateColorGradientsFromBaseColors(primaryGradients),
    neutralGradients: generateGrayGradientsFromBaseColors(neutralGradients),
    accentGradients: generateColorGradientsFromBaseColors(accentGradients)
  };
};

const deserializeOverrides = (params) => {
  const state = {
    primaryOverrides: generateNullGradients(NUM_PRIMARY_GRADIENTS),
    neutralOverrides: generateNullGradients(NUM_NEUTRAL_GRADIENTS),
    accentOverrides: generateNullGradients(NUM_ACCENT_GRADIENTS)
  };

  for (const key in params) {
    const tokens = OVERRIDE_PARAM_PATTERN.exec(key);
    if (!tokens) {
      continue;
    }

    const idx = parseInt(tokens[2]);
    let stateKey = null;

    switch (tokens[1]) {
      case 'p':
        if (idx >= NUM_PRIMARY_GRADIENTS) {
          continue;
        }
        stateKey = 'primaryOverrides';
        break;

      case 'n':
        if (idx >= NUM_NEUTRAL_GRADIENTS) {
          continue;
        }
        stateKey = 'neutralOverrides';
      default:

      case 'a':
        if (idx >= NUM_ACCENT_GRADIENTS) {
          continue;
        }
        stateKey = 'accentOverrides';
    }

    // Try to parse each token separated by '-' as a hex color
    let segments = params[key].split(',').map((s) => {
      const c = new HexColor(s);
      return c === null || !c.isValid() ? null : c;
    });

    // Pad or trim array to appropriate length
    const diff = GRADIENT_LEN - segments.length;
    if (diff > 0) {
      segments = segments.concat(new Array(diff).fill(null));
    }
    if (diff < 0) {
      segments = segments.slice(0, GRADIENT_LEN);
    }

    // Update the relevant piece of the state with the loaded values
    state[stateKey][idx] = new Gradient(segments);
  }

  return state;
};

export { deserializeGradients, deserializeOverrides };
