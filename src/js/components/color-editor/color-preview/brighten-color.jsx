import PropTypes from 'prop-types';
import React from 'react';
import SunIcon from 'components/icons/sun';

const BrightenColor = (props) => {
  if (props.isDisabled) {
    return <div className='color-editor__luminance-btn-placeholder'></div>;
  }

  return (
    <button
      className='color-editor__luminance-btn color-editor__luminance-btn--brighten button--icon'
      onClick={props.onClick}>
      <SunIcon size='40' color={'#250E62'} />
    </button>
  );
};

BrightenColor.propTypes = {
  onClick: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool.isRequired
};

export default BrightenColor;
