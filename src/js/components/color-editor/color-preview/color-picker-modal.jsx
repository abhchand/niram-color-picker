import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import PropTypes from 'prop-types';
import RGBColor from 'models/rgb-color';

function ColorPickerModal(props) {
  const [rgb, setRgb] = useState(props.hslColor.toRGB().value());

  const handleChangeComplete = (color) => {
    setRgb(color.rgb);
  };

  const submitModal = () => {
    props.setColor(new RGBColor(rgb.r, rgb.g, rgb.b));
    props.closeModal();
  };

  return (
    <div className='color-editor__color-picker-modal modal'>
      <div className='modal-content'>
        <ChromePicker
          color={rgb}
          onChangeComplete={handleChangeComplete}
          disableAlpha
        />
        <div className='color-editor__modal-btns'>
          <button type='button' onClick={submitModal}>
            SELECT
          </button>
          <button
            type='button'
            onClick={props.closeModal}
            className='button--hollow'>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

ColorPickerModal.propTypes = {
  hslColor: PropTypes.object.isRequired,
  closeModal: PropTypes.func.isRequired,
  setColor: PropTypes.func.isRequired
};

export default ColorPickerModal;
