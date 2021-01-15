import MoonIcon from 'components/icons/moon';
import PropTypes from 'prop-types';
import React from 'react';

function DarkenColor(props) {
  if (props.isDisabled) {
    return <div className='color-editor__luminance-btn-placeholder' />;
  }

  return (
    <button
      type='button'
      className='color-editor__luminance-btn color-editor__luminance-btn--darken button--icon'
      onClick={props.onClick}>
      <MoonIcon size='40' color='#250E62' />
    </button>
  );
}

DarkenColor.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default DarkenColor;
