import React from 'react';
import { createAvatar } from '@dicebear/core';
import { identicon } from '@dicebear/collection';

const renderThumbnail = (primaryTag) => {
  const avatar = createAvatar(identicon, {
      size: 48,
      seed: primaryTag
    }).toDataUri();

  return <img src={avatar} alt="Avatar" className="w-[40px] h-[40px]" />
}

const renderSocialMediaIcons = () => {
  return(<div className="flex items-center justify-center">
    <svg className="opacity-25 w-[20px] h-[20px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
    </svg>
    <svg className="opacity-25 w-[22px] h-[22px] mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
    </svg>
    <svg className="opacity-25 w-[22px] h-[22px] mr-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clip-rule="evenodd"/>
    </svg>
    <svg className="opacity-25 w-[18px] h-[18px] mr-1.5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
    </svg>
    <svg className="opacity-25 w-[23px] h-[23px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
      <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
    </svg>
  </div>)
}

const Flat = (props) => {
  const { item } = props;

  return (<div className="relative w-full sm:w-[400px] mx-auto bg-transparent border border-gray-200 rounded-lg shadow dark:bg-transparent dark:border-gray-700">
    <div className="flex justify-between mt-5 ml-5">
      <div className="flex items-center justify-center bg-transparent border border-gray-700 p-2 rounded-md">
        <div className="mr-2">
          <img referrerpolicy="no-referrer" src="https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/profile%2F-NrnSwk-t38iZWOB76Lt%2Fprofile.png?alt=media"
            className="h-[40px] rounded" />
        </div>
        <div className="mr-2">
          {renderThumbnail(item.primaryTag)}
        </div>
        <div>
          <div className="rounded-full w-[40px] h-[40px] bg-[#40435a]" style={{backgroundImage: 'url(\'https://lh3.googleusercontent.com/d/18UOi66-7Gb9Jkl6kmsi3i1bOVmoSr-cH\')', backgroundSize: 'contain'}}>
            &nbsp;
          </div>
        </div>
      </div>
    </div>
    <div className="p-5">
      <div className="flex justify-between">
        <h5 className="cursor-pointer mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Hurricane Helene
        </h5>
      </div>
      <p className="cursor-pointer mb-8 font-normal text-base text-[#A9AAC5] leading-9" style={{wordBreak: 'break-word'}}>
        Helene has killed at least 161 people, CBS News confirmed. The storm appears to have inflicted its worst damage in the Carolinas...
      </p>
      <p className="mb-8 text-sm text-[#A9AAC5]">
        <div className="mb-4 opacity-60 font-extralight text-[#A9AAC5]">
          1 day ago
        </div>
        <button className="mb-4">
          <span className="opacity-40 border border-[#A9AAC5] text-[#A9AAC5] bg-transparent text-sm font-medium me-2 px-2.5 py-0.5 rounded">
            27 tags
          </span>
        </button>
      </p>
      {renderSocialMediaIcons()}
    </div>
  </div>);
}

export default Flat;