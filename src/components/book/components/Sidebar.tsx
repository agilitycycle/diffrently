import React from 'react';
import {FiX} from 'react-icons/fi';
import {RiExpandLeftRightLine} from 'react-icons/ri';

const Sidebar = ({children, sidebar, handleControls}) => {
  return(<div className={`${sidebar.isOpen ? sidebar.darkMode ? 'dark' : 'light' : ''} fixed z-40 top-[58px] right-0 ${sidebar.isOpen ? `w-[calc(100%-55px)] ${sidebar.isExpand ? 'md:w-[95%]' : 'md:w-[600px] lg:w-[700px]'}` : 'w-6'} h-[calc(100%-58px)] border-l border-secondary/10 shadow bg-page/section`}>
    <button
      onClick={() => handleControls({sidebar: {isOpen: !sidebar.isOpen}})}
      className="absolute -left-5 top-7 bg-page/section border border-secondary/15 shadow p-2 rounded-full hover:bg-page/section focus:outline-none"
    >
      {sidebar.isOpen ? (
        <FiX className="w-4 h-4 text-secondary/60" />
      ) : (
        <RiExpandLeftRightLine className="w-4 h-4 text-secondary/60"/>
      )}
    </button>
    {sidebar.isOpen && (
      children
    )}
  </div>);
}

export default Sidebar;