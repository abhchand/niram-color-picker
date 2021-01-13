import PropTypes from 'prop-types';
import React from 'react';

function ColorCell(props) {
  const { hslColor, onClick } = props;

  if (hslColor === null) {
    return null;
  }

  const hexColor = `#${hslColor.toHex().value()}`;

  const cssClasses = [];

  if (props.isSelected) {
    cssClasses.push('color-grid__color-cell--selected');
  }

  if (hslColor.isOverride()) {
    cssClasses.push('color-grid__color-cell--override');
  }

  return (
    <div
      role='image'
      alt={hexColor}
      className={`color-grid__color-cell ${cssClasses.join(' ')}`}
      style={{ backgroundColor: hexColor }}
      onClick={onClick} />
  );
}

ColorCell.propTypes = {
  hslColor: PropTypes.object.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default ColorCell;
