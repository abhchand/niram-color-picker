import BrightenColor from './brighten-color';
import ColorCell from './color-cell';
import ColorPickerModal from './color-picker-modal';
import DarkenColor from './darken-color';
import { NUM_SHADES } from './constants';
import PropTypes from 'prop-types';
import React from 'react';

class ColorPreview extends React.Component {
  static propTypes = {
    hslColor: PropTypes.object.isRequired,
    setColor: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.createShade = this.createShade.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderModal = this.renderModal.bind(this);

    this.state = {
      isModalOpen: false
    };
  }

  createShade(luminanceChange) {
    const newColor = this.props.hslColor.dup().shiftBy(0, 0, luminanceChange);
    this.props.setColor(newColor);
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  closeModal() {
    this.setState({ isModalOpen: false });
  }

  renderModal() {
    if (!this.state.isModalOpen) {
      return null;
    }

    return (
      <ColorPickerModal
        hslColor={this.props.hslColor}
        closeModal={this.closeModal}
        setColor={this.props.setColor}
      />
    );
  }

  render() {
    const stepSize = 1 / NUM_SHADES;
    const { hslColor } = this.props;

    return (
      <div className='color-editor__preview'>
        <div className='color-editor__preview-container'>
          <DarkenColor
            onClick={() => this.createShade(-1 * stepSize)}
            isDisabled={hslColor.value().l - stepSize <= 0}
          />
          <ColorCell hslColor={this.props.hslColor} onClick={this.openModal} />
          <BrightenColor
            onClick={() => this.createShade(stepSize)}
            isDisabled={hslColor.value().l + stepSize >= 1}
          />
          {this.renderModal()}
        </div>
      </div>
    );
  }
}

export default ColorPreview;
