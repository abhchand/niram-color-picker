import PropTypes from 'prop-types';
import React from 'react';

const MoonIcon = (props) => {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'>
      <title>moon</title>
      <g id='moon' stroke='none' strokeWidth='1' fill='none' fillRule='evenodd'>
        <path
          d='M37.0003302,75.3699207 C40.9769791,77.4123824 45.4065908,78.5 50,78.5 C65.7401154,78.5 78.5,65.7401154 78.5,50 C78.5,34.2598846 65.7401154,21.5 50,21.5 C45.4065908,21.5 40.9769791,22.5876176 37.0003302,24.6300793 C46.3731412,29.4346868 52.5,39.1434645 52.5,50 C52.5,60.8565355 46.3731412,70.5653132 37.0003302,75.3699207 Z'
          stroke={props.color}
          strokeWidth='3'
          fill={props.color}
        />
      </g>
    </svg>
  );
};

MoonIcon.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string
};

MoonIcon.defaultProps = {
  color: '#888888',
  size: '32'
};

export default MoonIcon;
