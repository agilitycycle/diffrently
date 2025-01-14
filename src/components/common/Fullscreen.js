import React from 'react';

const Fullscreen = (props) => {
  const { fullScreen, setFullScreen, handleChange, body, characterCount } = props;
  return (
    <div className={`modal ${fullScreen ? 'block' : 'hidden'} fixed w-full h-full top-0 left-0 z-50 flex items-center justify-center`}>
      <div className="modal-overlay absolute z-50 w-full h-full bg-white"></div>
      <div className="modal-container fixed z-50 w-full h-full overflow-y-auto">
        <div onClick={() => setFullScreen(false)} className="modal-close absolute top-0 right-0 z-50 cursor-pointer flex flex-col items-center mt-4 mr-4 text-black text-sm">
          <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
            <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
          </svg>
          (Esc)
        </div>
        <div className="modal-content container mx-auto h-full text-left p-4">
          <div className="flex flex-col justify-between items-center h-full pb-2">
            <textarea onChange={handleChange} value={body} className="resize-none block py-2.5 pr-2.5 w-full h-full text-lg text-lg text-black bg-transparent !outline-none" placeholder="Write something..."/>
            <div className="flex justify-end pt-2">
              <span className={characterCount > 850 ? 'text-red-700' : ''}>{characterCount}</span>/850
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Fullscreen;