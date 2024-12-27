import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, DarkMode } from './';

const appName = 'Diffrently.';

/**
 * 
 * @diffrently
 * 
 */

const Header = (props) => {
  const {className, extraButtons, noMenu=false, useLink='/subject'} = props;
  const headerClss = className || 'w-full block leading-none text-3xl font-light';

  return (
    <div className="flex px-5 py-3.5 border-b border-gray-800">
			{!noMenu && (
        <Menu />
      )}
      <div className="grow">
        <h1 className={headerClss}>
          <Link to={useLink} className="flex items-center w-[220px] text-[#000423] dark:text-white">
            {appName}
          </Link>
        </h1>
      </div>
      {extraButtons}
      <DarkMode />
    </div>
  );
}

export default Header;