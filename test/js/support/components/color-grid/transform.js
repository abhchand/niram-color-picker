import HexColor from 'models/hex-color';
import HSLColor from 'models/hsl-color';
import RGBColor from 'models/rgb-color';

const toColor = (colorObj) => {
  if (colorObj.h) {
    return new HSLColor(colorObj.h, colorObj.s, colorObj.l);
  } else if (colorObj.r) {
    return new RGBColor(colorObj.r, colorObj.g, colorObj.b);
  }
  return new HexColor(colorObj);
};

/*
 * Transforms a color grid representation into
 * Hex
 *
 * === Input:
 *
 * {
 *   primary: [
 *     [
 *       {'h': 326.904, 'l': 0.155, 's': 0.267},
 *       {'h': 326.904, 'l': 0.455, 's': 0.467},
 *       {'h': 326.904, 'l': 0.755, 's': 0.667}
 *     ]
 *   ],
 *   neutral: [
 *     [
 *       {'h': 294.962, 'l': 0.247, 's': 0},
 *       {'h': 294.962, 'l': 0.447, 's': 0.025},
 *       {'h': 294.962, 'l': 0.647, 's': 0.075}]
 *     ],
 *   ],
 *   accent: [
 *     [
 *       {'h': 212.243, 'l': 0.3, 's': 0.359},
 *       {'h': 212.243, 'l': 0.6, 's': 0.559},
 *       {'h': 212.243, 'l': 0.9, 's': 0.759}
 *     ],
 *     [
 *       {'h': 78.806, 'l': 0.197, 's': 0.434},
 *       {'h': 78.806, 'l': 0.497, 's': 0.634},
 *       {'h': 78.806, 'l': 0.797, 's': 0.834}
 *     ]
 *   ]
 * }
 *
 * Output:
 *
 * {
 *   primary: [['203724', '40B052', '9EECAA']],
 *   neutral: [['494949', '7E7A7E', 'B4AAB4']],
 *   accent: [
 *     ['372031', 'B04091', 'EC9ED6'],
 *     ['203726', '40B05F', '9EECB3']
 *   ]
 *  }
 */
const transformColorGridtoHex = (colorGrid) => {
  // Incoming color grid may not already be in JSON format
  const json = JSON.parse(JSON.stringify(colorGrid));

  const result = {};

  for (const gradientType in json) {
    if (Object.prototype.hasOwnProperty.call(json, gradientType)) {
      const rows = json[gradientType];

      result[gradientType] = rows.map((row) => {
        return row.map((color) => toColor(color).toHex().value());
      });
    }
  }

  return result;
};

export { transformColorGridtoHex };
