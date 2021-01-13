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
 *   primary: [ [ '203724', '40B052', '9EECAA' ] ],
 *   neutral: [ [ '494949', '7E7A7E', 'B4AAB4' ] ],
 *   accent: [
 *     [ '372031', 'B04091', 'EC9ED6' ],
 *     [ '203726', '40B05F', '9EECB3' ]
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
 * Returns the positions of the overridden color in the format:
 *
 * [
 *   {
 *     gradientType: 'primary',
 *     gradientIdx: 1,
 *     positionIdx: 3
 *   },
 *   ...
 * ]
 *
 */
const getOverridentColorPositions = () => {
  const positions = [];
  const colorCells = global.wrapper.find('.color-grid__color-cell--override');

  colorCells.forEach((colorCell) => {
    /*
     * See note in `getSelectedColorPosition` below about how
     * we filter on parents
     */
    const td = colorCell.parents('td');

    positions.push({
      gradientType: td.prop('data-gradient-type'),
      gradientIdx: td.prop('data-gradient-idx'),
      positionIdx: td.prop('data-position-idx')
    });
  });

  return positions;
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

const setSelectedColorPosition = (pos) => {
  /*
   * The data-*-idx values are integers, so the query selector
   * should not have surrounding quotes.
   *
   * See: https://github.com/enzymejs/enzyme/blob/master/docs/api/selector.md#1-a-valid-css-selector
   */
  const selectedColorCell = global.wrapper
    .find(
      `td[data-gradient-type='${pos.gradientType}'][data-gradient-idx=${pos.gradientIdx}][data-position-idx=${pos.positionIdx}]`
    )
    .at(0);
  selectedColorCell.find('div').at(0).simulate('click');
};

const setOverrideColor = (color, position) => {
  const { gradientType, gradientIdx, positionIdx } = position;

  const key = `${gradientType}Overrides`;

  /*
   * Manually update the state to override the color cell
   * at the specified position
   */
  const overrides = global.wrapper.state(key);
  overrides[gradientIdx].set(positionIdx, color);
  global.wrapper.setState({ [key]: overrides });

  // Force a re-render
  global.wrapper.setProps({});
};

export {
  getColorGridAsJSON,
  getOverridentColorPositions,
  getSelectedColorPosition,
  setSelectedColorPosition,
  setOverrideColor
};
