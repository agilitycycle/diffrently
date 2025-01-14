import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const renderProfileStyle = (photoUrl) => {
  return {
    backgroundImage: `url(${photoUrl})`,
    backgroundSize: 'contain'
  };
}

const renderSocialMediaIcons = () => {
  return(<div className="flex items-center justify-center">
    <svg className="w-[20px] h-[20px] text-[#515666] dark:text-[#515666]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
    </svg>
    <svg className="w-[22px] h-[22px] mr-2 text-[#515666] dark:text-[#515666]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
    </svg>
    <svg className="w-[22px] h-[22px] mr-2 text-[#515666] dark:text-[#515666]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clip-rule="evenodd"/>
    </svg>
    <svg className="w-[18px] h-[18px] mr-1.5 text-[#515666] dark:text-[#515666]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
    </svg>
    <svg className="w-[23px] h-[23px] text-[#515666] dark:text-[#515666]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
      <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
    </svg>
  </div>)
}

const Compact = (props) => {
  const navigate = useNavigate();
  const {item, photoUrl, displayName, loadTag, handleDeletePost, setPostItem, setOpenShareModal, setOpenParachuteModal, getTags, postLength} = props;
  const {body, dateCreated} = item;
  const [openMenu, setOpenMenu] = useState(false);
  const tagEl = Object.keys(item).filter(a => a.indexOf('tag') > -1).map(b => b.replace('tag', ''));

  const toggleSubmenu = () => {
    setOpenMenu(!openMenu);
  }

  return (<div className="relative mb-7 mx-auto bg-transparent border border-gray-200 rounded-lg shadow dark:bg-transparent dark:border-gray-700">
    {/**
     * Extra menu options
     */}
    {openMenu && (
      <a href={null} onClick={toggleSubmenu} className="cursor-pointer z-20 absolute right-0 w-full h-full">
        <div className="flex flex-col justify-between h-full">
          <h5 className="cursor-pointer pl-9 pt-11 w-[60%] leading-loose text-3xl font-light tracking-wide text-gray-900 dark:text-white">
            What would you like to do?
          </h5>
        </div>
      </a>
    )}
    {/**
     * Dropdown menu
     */}
    <div className={`${openMenu ? 'flex' : 'hidden'} items-center justify-center absolute top-[65px] right-[23px] z-30 w-[120px]`}>
      <ul className="text-sm leading-relaxed text-right">
        <li>
          <a href={null} onClick={() => {
            setPostItem(item);
            setOpenShareModal(true);
          }} className="transition-all duration-300 ease-in-out group inline-block cursor-pointer px-3 py-.5 mb-3 rounded font-medium text-gray-800 bg-gray-400 hover:bg-gray-300">
            <span>
              Share
            </span>
          </a>
        </li>
        <li className="transition-all duration-300 ease-in-out group inline-block cursor-pointer px-3 py-.5 mb-3 rounded font-medium text-gray-800 bg-gray-400 hover:bg-gray-300">
          <span>
            Edit
          </span>
        </li>
        <li>
          <a href={null} onClick={() => {
            setPostItem(item);
            setOpenParachuteModal(true);
          }} className="transition-all duration-300 ease-in-out group inline-block cursor-pointer px-3 py-.5 mb-3 rounded font-medium text-gray-800 bg-gray-400 hover:bg-gray-300">
            <span>
              Parachute
            </span>
          </a>
        </li>
        <li>
          <a href={null} onClick={() => handleDeletePost(item.id)}
            className="transition-all duration-300 ease-in-out group inline-block cursor-pointer px-3 py-.5 mb-3 rounded font-medium text-gray-800 bg-gray-400 hover:bg-rose-700">
            <span>
              Delete
            </span>
          </a>
        </li>
      </ul>
    </div>
    {/**
     * Toggle menu button
     */}
    <a href={null} onClick={toggleSubmenu} className={`transition-all duration-100 ease-in-out flex items-center justify-center cursor-pointer absolute top-[22px] right-[22px] z-40 w-8 h-8 rounded-full ${openMenu ? 'fill-gray-400' : 'fill-[#A9AAC5]/50'} bg-transparent`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5">
        <path d="M256 232C242.7 232 232 242.7 232 256S242.7 280 256 280c13.26 0 24-10.74 24-24S269.3 232 256 232zM256 344c-13.25 0-24 10.74-24 24s10.75 24 24 24c13.26 0 24-10.74 24-24S269.3 344 256 344zM256 120c-13.25 0-24 10.74-24 24S242.7 168 256 168c13.26 0 24-10.74 24-24S269.3 120 256 120zM256 0c-141.4 0-255.1 114.6-255.1 256S114.6 511.1 256 511.1s256-114.6 256-255.1S397.4 0 256 0zM256 480c-123.5 0-224-100.5-224-224s100.5-224 224-224s224 100.5 224 224S379.5 480 256 480z"/>
      </svg>
    </a>
    {/**
     * Card content section
     */}
    <div>
      <div className={`transition-all ease-in-out ${openMenu ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex justify-between mt-4 ml-5"></div>
        {/**
         * Card content
         */}
        <div className="pt-5 pl-5 pr-5">
          <div className="flex justify-between">
            <h5 onClick={() => navigate(`/timeline/${tagEl[0]}/${item.id}`)} className="cursor-pointer mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {item.title || item.primaryTag}
            </h5>
          </div>
          <p onClick={() => navigate(`/timeline/${tagEl[0]}/${item.id}`)} className="cursor-pointer mb-8 font-normal text-base text-[#A9AAC5] leading-9" style={{wordBreak: 'break-word'}}>
            {postLength === 850 ? body.slice(0, 850) : `${body.slice(0, 150 - 1)}...`}
          </p>
          <p className="mb-4 text-sm text-[#A9AAC5]">
            <div className="flex mb-3">
              <div className="rounded-full w-[40px] h-[40px] bg-[#40435a]" style={renderProfileStyle(photoUrl)}>
                &nbsp;
              </div>
              <div className="flex items-center justify-center ml-4 text-lg font-medium">
                <h5>{displayName}</h5>
              </div>
            </div>
            <div className="mb-8 opacity-60 text-[#A9AAC5]">{
              moment(dateCreated).fromNow()
            }</div>
            {getTags && (
              getTags(tagEl)
            )}
            {!getTags && (
              <>
                <button className="mb-4" onClick={() => loadTag(tagEl[0])}>
                  <span className="opacity-40 border border-[#A9AAC5] text-[#A9AAC5] bg-transparent text-sm font-medium me-2.5 px-2.5 py-0.5 rounded">
                    {tagEl.length} tags
                  </span>
                </button>
                {item.image && (
                  <button className="mb-4">
                    <span className="opacity-40 border border-[#A9AAC5] text-[#A9AAC5] bg-transparent text-sm font-medium me-2.5 px-2.5 py-0.5 rounded">
                      Media
                    </span>
                  </button>
                )}
                {/*<span className="bg-blue-100 text-slate-300 text-sm font-normal me-2 px-2.5 py-0.5 rounded dark:bg-indigo-800 dark:text-slate-300">
                  Trending
                </span>*/}
              </>
            )}
          </p>
          {/*
            <div className="grid justify-items-end">
              <button type="button" className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="w-4 h-4 me-2 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13.09 3.294c1.924.95 3.422 1.69 5.472.692a1 1 0 0 1 1.438.9v9.54a1 1 0 0 1-.562.9c-2.981 1.45-5.382.24-7.25-.701a38.739 38.739 0 0 0-.622-.31c-1.033-.497-1.887-.812-2.756-.77-.76.036-1.672.357-2.81 1.396V21a1 1 0 1 1-2 0V4.971a1 1 0 0 1 .297-.71c1.522-1.506 2.967-2.185 4.417-2.255 1.407-.068 2.653.453 3.72.967.225.108.443.216.655.32Z"/>
                </svg>
                Report
              </button>
            </div>
          */}
        </div>
      </div>
      {/**
       * Social media icons
       */}
      <div className="pb-5">
        {renderSocialMediaIcons()}
      </div>
    </div>
  </div>);
} 

export default Compact;