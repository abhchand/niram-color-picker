import ColorModelSelector from 'components/color-model-selector';
import ColorPreview from './color-preview';
import ColorValue from './color-value';
import CopyToClipboard from 'components/copy-to-clipboard';
import eventBus from 'components/event-bus';
import PropTypes from 'prop-types';
import React from 'react';
import {
  OVERRIDE_SELECTED_COLOR,
  RESET_SELECTED_COLOR,
  UPDATE_SELECTED_COLOR
} from 'components/event-bus/events';

class ColorEditor extends React.Component {
  constructor(props) {
    super(props);

    this.eventUnsubscribes = [];

    this.clipboardText = this.clipboardText.bind(this);
    this.setColor = this.setColor.bind(this);
    this.setColorModel = this.setColorModel.bind(this);

    this.state = {
      color: null,
      colorModel: 'rgb'
    };
  }

  componentDidMount() {
    // Listen for updates to the selected color
    const unsubscribe = eventBus.on(UPDATE_SELECTED_COLOR, (color) =>
      this.setState({ color: color })
    );
    this.eventUnsubscribes.push(unsubscribe);
  }

  componentWillUnmount() {
    this.eventUnsubscribes.forEach((u) => u());
  }

  clipboardText() {
    const { color, colorModel } = this.state;

    switch (colorModel) {
      case 'rgb':
        return color.toRGB().toString();

      case 'hex':
        return color.toHex().toString();

      case 'hsl':
        return color.toHSL().toString();

      default:
        return 'unknown';
    }
  }

  setColor(newColor) {
    this.setState(
      {
        color: newColor
      },
      () => {
        eventBus.emit(OVERRIDE_SELECTED_COLOR, newColor);
      }
    );
  }

  setColorModel(newColorModel) {
    this.setState({
      colorModel: newColorModel
    });
  }

  render() {
    const { color, colorModel } = this.state;
    if (!color) {
      return null;
    }

    return (
      <div className='color-editor'>
        <ColorModelSelector
          colorModel={colorModel}
          setColorModel={this.setColorModel}
          namespace={'color_editor'}
        />
        <ColorValue
          color={color}
          colorModel={colorModel}
          setColor={this.setColor}
        />
        <ColorPreview hslColor={color.toHSL()} setColor={this.setColor} />
        <CopyToClipboard text={this.clipboardText()} />
        <div className='color-editor__reset'>
          <button onClick={(e) => eventBus.emit(RESET_SELECTED_COLOR)}>
            RESET
          </button>
        </div>
      </div>
    );
  }
}

export default ColorEditor;
