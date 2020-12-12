import PropTypes from 'prop-types';
import React from 'react';

function ColorModelSelector(props) {
  const onChange = (e) => props.setColorModel(e.target.value);

  return (
    <div className='color-editor__model-selector'>
      <label htmlFor='color_model_name_0'>
        <input
          checked={props.colorModel === 'rgb'}
          onChange={onChange}
          type='radio'
          value='rgb'
          name='color_model[name]'
          id='color_model_name_0'
        />
        RGB
      </label>
      <label htmlFor='color_model_name_1'>
        <input
          checked={props.colorModel === 'hex'}
          onChange={onChange}
          type='radio'
          value='hex'
          name='color_model[name]'
          id='color_model_name_1'
        />
        Hex
      </label>
      <label htmlFor='color_model_name_2'>
        <input
          checked={props.colorModel === 'hsl'}
          onChange={onChange}
          type='radio'
          value='hsl'
          name='color_model[name]'
          id='color_model_name_2'
        />
        HSL
      </label>
    </div>
  );
}

ColorModelSelector.propTypes = {
  colorModel: PropTypes.string.isRequired,
  setColorModel: PropTypes.func.isRequired
};

export default ColorModelSelector;
