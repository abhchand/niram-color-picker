import PropTypes from 'prop-types';
import React from 'react';
import SunIcon from 'components/icons/sun';

function BrightenColor(props) {
  if (props.isDisabled) {
    return <div className='color-editor__luminance-btn-placeholder' />;
  }

  return (
    <button
      type='button'
      className='color-editor__luminance-btn color-editor__luminance-btn--brighten button--icon'
      onClick={props.onClick}>
      <SunIcon size='40' color='#250E62' />
    </button>
  );
}

BrightenColor.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default BrightenColor;
