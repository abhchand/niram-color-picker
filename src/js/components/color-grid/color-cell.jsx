import PropTypes from 'prop-types';
import React from 'react';

const ColorCell = (props) => {
  const { hslColor, onClick } = props;

  if (hslColor === null) {
    return null;
  }

  const hexColor = `#${hslColor.toHex().value()}`;
  const selectedCss = props.isSelected
    ? 'color-grid__color-cell--selected'
    : '';

  return (
    <div
      role='image'
      alt={hexColor}
      className={`color-grid__color-cell ${selectedCss}`}
      style={{ backgroundColor: hexColor }}
      onClick={onClick}></div>
  );
};

ColorCell.propTypes = {
  hslColor: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ColorCell;
