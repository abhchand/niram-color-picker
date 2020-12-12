import React, { useState } from 'react';
import { ChromePicker } from 'react-color';
import HSLColor from 'models/hsl-color';
import PropTypes from 'prop-types';

function ColorPickerModal(props) {
  const [hsl, setHsl] = useState(props.hslColor.value());

  const handleChangeComplete = (color) => {
    setHsl(color.hsl);
  };

  const submitModal = () => {
    props.setColor(new HSLColor(hsl.h, hsl.s, hsl.l));
    props.closeModal();
  };

  return (
    <div className='color-editor__color-picker-modal modal'>
      <div className='modal-content'>
        <ChromePicker
          color={hsl}
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
