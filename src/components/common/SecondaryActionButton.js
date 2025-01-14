import React from 'react';

const SecondaryActionButton = (props) => {
  const { label, css, disabled, size = 'small', onClick } = props;
  const buttonSize = size === 'small' ? 'px-5 p-1.5' : 'px-5 p-2.5';

  return (
    <button onClick={onClick} disabled={disabled} className={`bg-blue-600 text-white rounded-lg font-medium text-sm ${buttonSize} ${css}`}>
      {label}
    </button>
  );
}

export default SecondaryActionButton;