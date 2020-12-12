import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RGBColor from 'models/rgb-color';

function RGBValue(props) {
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
  const [rgb, setRGB] = useState(props.color.value());
  useEffect(() => {
    setRGB(props.color.value());
  }, [props.color]);

  const onChange = (newRGB) => {
    // Update the state
    setRGB(newRGB);

    // If the form input is a valid color, update the color
    const rgbColor = new RGBColor(
      parseInt(newRGB.r, 10),
      parseInt(newRGB.g, 10),
      parseInt(newRGB.b, 10)
    );
    if (rgbColor.isValid()) {
      props.setColor(rgbColor);
    }
  };

  return (
    <div className='color-editor__color-value color-editor__color-value--rgb'>
      <label htmlFor='color_component_r'>
        R:&nbsp;
        <input
          type='input'
          onChange={(e) =>
            onChange({ r: e.currentTarget.value, g: rgb.g, b: rgb.b })
          }
          value={rgb.r}
          name='color_component[r]'
          id='color_component_r'
        />
      </label>
      <label htmlFor='color_component_g'>
        G:&nbsp;
        <input
          type='input'
          onChange={(e) =>
            onChange({ r: rgb.r, g: e.currentTarget.value, b: rgb.b })
          }
          value={rgb.g}
          name='color_component[g]'
          id='color_component_g'
        />
      </label>
      <label htmlFor='color_component_b'>
        B:&nbsp;
        <input
          type='input'
          onChange={(e) =>
            onChange({ r: rgb.r, g: rgb.g, b: e.currentTarget.value })
          }
          value={rgb.b}
          name='color_component[b]'
          id='color_component_b'
        />
      </label>
    </div>
  );
}

RGBValue.propTypes = {
  color: PropTypes.object.isRequired,
  setColor: PropTypes.func.isRequired
};

export default RGBValue;
