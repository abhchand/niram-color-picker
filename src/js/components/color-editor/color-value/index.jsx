import HexValue from './hex';
import HSLValue from './hsl';
import PropTypes from 'prop-types';
import React from 'react';
import RGBValue from './rgb';

const ColorValue = (props) => {
  switch (props.colorModel) {
    case 'rgb':
      return <RGBValue color={props.color.toRGB()} setColor={props.setColor} />;

    case 'hex':
      return <HexValue color={props.color.toHex()} setColor={props.setColor} />;

    case 'hsl':
      return <HSLValue color={props.color.toHSL()} setColor={props.setColor} />;

    default:
      throw `Unknown color model ${props.colorModel}`;
  }
};

ColorValue.propTypes = {
  color: PropTypes.object.isRequired,
  colorModel: PropTypes.string.isRequired,
  setColor: PropTypes.func.isRequired
};

export default ColorValue;
