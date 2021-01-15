import PropTypes from 'prop-types';
import React from 'react';

function SunIcon(props) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'>
      <title>sun</title>
      <g id='sun' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <circle
          id='Oval'
          stroke={props.color}
          strokeWidth='3'
          cx='50'
          cy='50'
          r='28.5'
        />
        <path
          d='M50,5 L50,15'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
        />
        <path
          d='M50,85 L50,95'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
        />
        <path
          d='M10,45 L10,55'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
          transform='translate(10.000000, 50.000000) rotate(-90.000000) translate(-10.000000, -50.000000) '
        />
        <path
          d='M18,72 L18,82'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
          transform='translate(18.000000, 77.000000) rotate(-135.000000) translate(-18.000000, -77.000000) '
        />
        <path
          d='M18,18 L18,28'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
          transform='translate(18.000000, 23.000000) rotate(-45.000000) translate(-18.000000, -23.000000) '
        />
        <path
          d='M82,18 L82,28'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
          transform='translate(82.000000, 23.000000) rotate(45.000000) translate(-82.000000, -23.000000) '
        />
        <path
          d='M82,72 L82,82'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
          transform='translate(82.000000, 77.000000) rotate(-225.000000) translate(-82.000000, -77.000000) '
        />
        <path
          d='M90,45 L90,55'
          id='Line'
          stroke={props.color}
          strokeWidth='2'
          strokeLinecap='square'
          transform='translate(90.000000, 50.000000) rotate(-90.000000) translate(-90.000000, -50.000000) '
        />
      </g>
    </svg>
  );
}

SunIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string
};

SunIcon.defaultProps = {
  color: '#888888',
  size: '32'
};

export default SunIcon;
