import React, { useEffect, useState } from 'react';
import HSLColor from 'models/hsl-color';
import PropTypes from 'prop-types';

function HSLValue(props) {
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
  const [hsl, setHSL] = useState(props.color.value());
  useEffect(() => {
    setHSL(props.color.value());
  }, [props.color]);

  const onChange = (newHSL) => {
    // Update the state
    setHSL(newHSL);

    // If the form input is a valid color, update the color
    const hslColor = new HSLColor(
      parseFloat(newHSL.h),
      parseFloat(newHSL.s),
      parseFloat(newHSL.l)
    );
    if (hslColor.isValid()) {
      props.setColor(hslColor);
    }
  };

  return (
    <div className='color-editor__color-value color-editor__color-value--hsl'>
      <label htmlFor='color_component_h'>
        H:&nbsp;
        <input
          type='input'
          onChange={(e) =>
            onChange({ h: e.currentTarget.value, s: hsl.s, l: hsl.l })
          }
          value={parseFloat(hsl.h).toFixed(1)}
          name='color_component[h]'
          id='color_component_h'
        />
        °
      </label>
      <label htmlFor='color_component_s'>
        S:&nbsp;
        <input
          type='input'
          onChange={(e) =>
            onChange({ h: hsl.h, s: e.currentTarget.value, l: hsl.l })
          }
          value={parseFloat(hsl.s).toFixed(2)}
          name='color_component[s]'
          id='color_component_s'
        />
      </label>
      <label htmlFor='color_component_l'>
        L:&nbsp;
        <input
          type='input'
          onChange={(e) =>
            onChange({ h: hsl.h, s: hsl.s, l: e.currentTarget.value })
          }
          value={parseFloat(hsl.l).toFixed(2)}
          name='color_component[l]'
          id='color_component_l'
        />
        %
      </label>
    </div>
  );
}

HSLValue.propTypes = {
  color: PropTypes.object.isRequired,
  setColor: PropTypes.func.isRequired
};

export default HSLValue;
