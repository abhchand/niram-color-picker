import {
  COLOR_GRID_UPDATED,
  OVERRIDE_SELECTED_COLOR,
  RESET_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';
import {
  generateColorGradients,
  generateGrayGradients,
  generateNullGradients
} from './gradients';
import { getStateFromUrl, setUrlFromState } from './url';
import {
  GRADIENT_LEN,
  NUM_ACCENT_GRADIENTS,
  NUM_NEUTRAL_GRADIENTS,
  NUM_PRIMARY_GRADIENTS
} from './constants';
import eventBus from 'components/event-bus';
import React from 'react';
import Row from './row';

class ColorGrid extends React.Component {
  constructor(props) {
    super(props);

    this.updateSelectedCell = this.updateSelectedCell.bind(this);
    this.overrideSelectedColor = this.overrideSelectedColor.bind(this);
    this.refreshGradient = this.refreshGradient.bind(this);
    this.broadcastSelectedColor = this.broadcastSelectedColor.bind(this);
    this.broadcastColorGrid = this.broadcastColorGrid.bind(this);
    this.renderRowsFor = this.renderRowsFor.bind(this);

    this.eventUnsubscribes = [];

    /*
     * Check if URL can be parsed and loaded, if not generate a
     * new initial state from randomized colors
     */
    const stateFromUrl = getStateFromUrl();

    if (stateFromUrl) {
      this.state = { ...this.state, ...stateFromUrl };
    } else {
      this.state = {
        primaryGradients: generateColorGradients(NUM_PRIMARY_GRADIENTS),
        primaryOverrides: generateNullGradients(NUM_PRIMARY_GRADIENTS),

        neutralGradients: generateGrayGradients(NUM_NEUTRAL_GRADIENTS),
        neutralOverrides: generateNullGradients(NUM_NEUTRAL_GRADIENTS),

        accentGradients: generateColorGradients(NUM_ACCENT_GRADIENTS),
        accentOverrides: generateNullGradients(NUM_ACCENT_GRADIENTS)
      };
    }

    this.state = Object.assign(this.state, {
      selectedColorCell: {
        gradientType: 'primary',
        gradientIdx: 0,
        // Temporarily `null` - set directly below
        positionIdx: null
      }
    });

    // Set `positionIdx`
    const gradient = this.state.primaryGradients[0];
    const color = gradient.baseColor();
    this.state.selectedColorCell.positionIdx = gradient.indexOf(color);

    setUrlFromState(this.state);
  }

  componentDidMount() {
    // Broadcast initial selection and state to other components
    this.broadcastSelectedColor();
    this.broadcastColorGrid();

    // Listen for emitted events from other components
    const { overrideSelectedColor } = this;
    const unsubscribeOverride = eventBus.on(OVERRIDE_SELECTED_COLOR, (color) =>
      overrideSelectedColor(color)
    );
    const unsubscribeReset = eventBus.on(RESET_SELECTED_COLOR, () =>
      overrideSelectedColor(null)
    );

    this.eventUnsubscribes.push(unsubscribeOverride);
    this.eventUnsubscribes.push(unsubscribeReset);
  }

  componentWillUnmount() {
    this.eventUnsubscribes.forEach((u) => u());
  }

  updateSelectedCell(gradientType, gradientIdx, positionIdx) {
    this.setState(
      {
        selectedColorCell: {
          gradientType: gradientType,
          gradientIdx: gradientIdx,
          positionIdx: positionIdx
        }
      },
      this.broadcastSelectedColor
    );
  }

  overrideSelectedColor(overrideColor) {
    const {
      gradientType,
      gradientIdx,
      positionIdx
    } = this.state.selectedColorCell;

    const gradientKey = `${gradientType}Gradients`,
      overrideKey = `${gradientType}Overrides`;

    let updatedValue = overrideColor;

    // Indicate that this is an override color
    if (updatedValue !== null) {
      updatedValue.markAsOverride();
    }

    /*
     * If the override is the same value as the original
     * color it's overriding, it's not really an override.
     * In this case set the override to `null`.
     */
    const originalColor = this.state[gradientKey][gradientIdx].valueAt(
      positionIdx
    );
    if (originalColor.equals(overrideColor)) {
      updatedValue = null;
    }

    // Update the override value
    const overrides = this.state[overrideKey];
    overrides[gradientIdx].set(positionIdx, updatedValue);

    // Update `state` with new overrides
    const newState = {};
    newState[overrideKey] = overrides;

    this.setState(newState, () => {
      this.broadcastSelectedColor();
      this.broadcastColorGrid();
      setUrlFromState(this.state);
    });
  }

  refreshGradient(type, index) {
    const newState = {};

    /*
     * Since `primary` and `neutral` colors will only have 1
     * gradient, we can just replace the entire gradient array.
     *
     * With `accent` we have to update/replace the specific
     * gradient entry in the array.
     */
    switch (type) {
      case 'primary':
        newState.primaryGradients = generateColorGradients(1);
        newState.primaryOverrides = generateNullGradients(1);
        break;

      case 'neutral':
        newState.neutralGradients = generateGrayGradients(1);
        newState.neutralOverrides = generateNullGradients(1);
        break;

      case 'accent':
        newState.accentGradients = this.state.accentGradients;
        newState.accentGradients[index] = generateColorGradients(1)[0];

        newState.accentOverrides = this.state.accentOverrides;
        newState.accentOverrides[index] = generateNullGradients(1)[0];
        break;

      default:
        throw `Unknown type ${type}`;
    }

    this.setState(newState, () => {
      this.broadcastSelectedColor();
      this.broadcastColorGrid();
      setUrlFromState(this.state);
    });
  }

  broadcastSelectedColor() {
    const {
      gradientType,
      gradientIdx,
      positionIdx
    } = this.state.selectedColorCell;

    const curColor = this.state[`${gradientType}Gradients`][
      gradientIdx
    ].valueAt(positionIdx);
    const override = this.state[`${gradientType}Overrides`][
      gradientIdx
    ].valueAt(positionIdx);

    eventBus.emit(UPDATE_SELECTED_COLOR, override || curColor);
  }

  broadcastColorGrid() {
    const {
      primaryGradients,
      primaryOverrides,
      neutralGradients,
      neutralOverrides,
      accentGradients,
      accentOverrides
    } = this.state;

    const perform = (gradients, overrides) => {
      return gradients.map((g, idx) => g.merge(overrides[idx]));
    };

    eventBus.emit(COLOR_GRID_UPDATED, {
      primary: perform(primaryGradients, primaryOverrides),
      neutral: perform(neutralGradients, neutralOverrides),
      accent: perform(accentGradients, accentOverrides)
    });
  }

  renderRowsFor(gradientType) {
    const { refreshGradient, updateSelectedCell } = this;

    const gradients = this.state[`${gradientType}Gradients`];
    const overrides = this.state[`${gradientType}Overrides`];
    const selectedColorCell = this.state.selectedColorCell || {};

    return gradients.map((gradient, gradientIdx) => {
      const boundSelectColor = (positionIdx) => {
        return updateSelectedCell(gradientType, gradientIdx, positionIdx);
      };

      const override = overrides[gradientIdx];

      const isRowSelected =
        selectedColorCell.gradientType === gradientType &&
        selectedColorCell.gradientIdx === gradientIdx;

      return (
        <Row
          key={`gradient-${gradientType}-${gradientIdx}`}
          gradient={gradient.merge(override)}
          gradientIdx={gradientIdx}
          gradientType={gradientType}
          selectedIdx={isRowSelected ? selectedColorCell.positionIdx : -1}
          refreshGradient={refreshGradient}
          selectColor={boundSelectColor}
        />
      );
    });
  }

  render() {
    return (
      <table className='color-grid'>
        <thead>
          <tr>
            <th />
            {new Array(GRADIENT_LEN).fill(null).map((_i, idx) => {
              return (
                <th key={`th-${idx}`} data-position-idx={idx}>
                  {(idx + 1) * 100}
                </th>
              );
            })}
            <th />
          </tr>
        </thead>
        <tbody>
          {this.renderRowsFor('primary')}
          {this.renderRowsFor('neutral')}
          {this.renderRowsFor('accent')}
        </tbody>
      </table>
    );
  }
}

export default ColorGrid;
