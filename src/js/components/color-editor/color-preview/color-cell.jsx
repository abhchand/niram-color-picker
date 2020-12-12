import PropTypes from 'prop-types';
import React from 'react';

const ColorCell = (props) => {
  const { hslColor, onClick } = props;

  if (hslColor === null) {
    return null;
  }

  const hexColor = `#${hslColor.toHex().value()}`;

  return (
    <div
      role='image'
      alt={hexColor}
      className='color-editor__color-cell'
      style={{ backgroundColor: hexColor }}
      onClick={onClick}></div>
  );
};

ColorCell.propTypes = {
  hslColor: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ColorCell;
