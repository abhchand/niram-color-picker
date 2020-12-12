import React, { useEffect, useState } from 'react';
import HexColor from 'models/hex-color';
import PropTypes from 'prop-types';

function HexValue(props) {
  /*
   * We need to keep track of `input` value state since
   * it's required by React to make the form editable
   * (see: React controlled components).
   *
   * But since the prop value isn't used for rendering,
   * React doesn't not re-render the view when the props
   * are updated. We need to update the state as well,
   * which we do by watching for prop changes with `useEffect`
   */
  const [hex, setHex] = useState(props.color.value());
  useEffect(() => {
    setHex(props.color.value());
  }, [props.color]);

  const onChange = (newHex) => {
    // Update the state
    setHex(newHex);

    // If the form input is a valid color, update the color
    const hexColor = new HexColor(newHex);
    if (hexColor.isValid()) {
      props.setColor(hexColor);
    }
  };

  return (
    <div className='color-editor__color-value color-editor__color-value--hex'>
      <label htmlFor='color_component_hex'>
        #&nbsp;
        <input
          type='input'
          onChange={(e) => onChange(e.currentTarget.value)}
          value={hex}
          name='color_component[hex]'
          id='color_component_hex'
        />
      </label>
    </div>
  );
}

HexValue.propTypes = {
  color: PropTypes.object.isRequired,
  setColor: PropTypes.func.isRequired
};

export default HexValue;
