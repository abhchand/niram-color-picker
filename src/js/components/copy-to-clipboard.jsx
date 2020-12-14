import React, { useEffect, useState } from 'react';
import { copyTextToClipboard } from 'helpers/clipboard';
import PropTypes from 'prop-types';

function CopyToClipboard(props) {
  const [showCheck, setShowCheck] = useState(false);
  useEffect(() => {
    setShowCheck(false);
  }, [props.text, props.fallbackOnPrompt]);

  const onClick = (_e) => {
    copyTextToClipboard(props.text, props.fallbackOnPrompt);

    setShowCheck(true);
    setTimeout(() => {
      setShowCheck(false);
    }, 1000);
  };

  return (
    <button type='button' className='copy-to-clipboard' onClick={onClick}>
      {showCheck ? '✅' : 'COPY'}
    </button>
  );
}

CopyToClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  fallbackOnPrompt: PropTypes.bool
};

CopyToClipboard.defaultProps = {
  fallbackOnPrompt: true
};

export default CopyToClipboard;
