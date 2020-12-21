import { generateNullGradients } from 'components/color-grid/gradients';
import HexColor from 'models/hex-color';

/*
 * Returns a JSON representation of the color grid currently
 * displayed in the rendered DOM.
 *
 * Unlike internal `state`, we can't distinguish between gradients
 * and overrides when parsing values from the DOM, so this is just
 * a "flattened" visual representation.
 *
 * Returns the form:
 *
 * {
 *   primary: [ [ '203723', '40B052', '9DECAA' ] ],
 *   neutral: [ [ '494949', '7E7A7E', 'B5AAB5' ] ],
 *   accent: [
 *     [ '372030', 'B04091', 'EC9DD6' ],
 *     [ '203726', '40B05F', '9DECB3' ]
 *   ]
 * }
 */
const getColorGridAsJSON = () => {
  const colorGrid = {};

  const rows = global.wrapper.find('.color-grid tbody .color-grid__row');

  rows.forEach((row) => {
    const cols = row.find('td');

    // Build an empty gradient to populate
    const gradient = generateNullGradients(1)[0];

    cols.forEach((col) => {
      const positionIdx = parseInt(col.prop('data-position-idx'), 10);

      // Ignore non-color cells (those without an integer data-id)
      if (isNaN(positionIdx)) {
        return;
      }

      // Parse background color of cell
      const hexColorStr = col
        .find('.color-grid__color-cell')
        .prop('style')
        .backgroundColor.substring(1);
      const hexColor = new HexColor(hexColorStr);

      // Update gradient
      gradient.set(positionIdx, hexColor);
    });

    /*
     * Add this gradient to the color grid, under the appropriate
     * gradient type, which can be determined from data property on the row
     */
    const gradientType = row.prop('data-gradient-type');
    colorGrid[gradientType] = colorGrid[gradientType] || [];
    colorGrid[gradientType].push(gradient);
  });

  return JSON.parse(JSON.stringify(colorGrid));
};

/*
 * Returns the position of the selected color in the format:
 *
 * {
 *   gradientType: 'primary',
 *   gradientIdx: 1,
 *   positionIdx: 3
 * }
 *
 */
const getSelectedColorPosition = () => {
  /*
   * We pull the properties from the `data-*` properties on the `td` element
   *
   * NOTE: Enzyme render ths React component itself as a "layer" in the DOM
   *
   * <td ...>
   *   <ColorCell .. >
   *     <div class='color-grid__color-cell--selected'>
   *     </div>
   *   </ColorCell>
   * <td>
   *
   * So we retrieve all `parents()` and filter on the `td` specifically
   */
  const td = global.wrapper
    .find('.color-grid__color-cell--selected')
    .at(0)
    .parents('td');

  return {
    gradientType: td.prop('data-gradient-type'),
    gradientIdx: td.prop('data-gradient-idx'),
    positionIdx: td.prop('data-position-idx')
  };
};

export { getColorGridAsJSON, getSelectedColorPosition };
