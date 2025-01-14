import React, { useState, useRef, useEffect } from 'react';

// https://medium.com/@iambharathpadhu/mastering-popovers-building-an-accessible-popover-component-in-react-with-just-html-a6e95c0be2fb

const Popover = ({content, button}) => {
  const popoverRef = useRef(null);
  const buttonRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="inline-block relative">
      <button ref={buttonRef} onClick={() => setIsVisible(!isVisible)}>
        {button}
      </button>
      {isVisible && (
        <div
          ref={popoverRef}
          className="absolute top-[43px] right-0 bg-primary border border-secondary/25 rounded-xl p-1 py-1.5 z-40 whitespace-nowrap"
          role="dialog"
          aria-modal="true"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popover;