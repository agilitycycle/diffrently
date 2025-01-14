import React from 'react';
import {Link} from 'react-router-dom';
import Menu from './Menu';
import DarkMode from './DarkMode';

const appName = 'Diffrently.';

/**
 * 
 * @diffrently
 * 
 */

const Header = (props) => {
  const {className, extraButtons, noMenu=false, useLink='/start'} = props;
  const headerClss = className || 'w-full block leading-none text-3xl font-light';

  return (
    <div className="pt-[59px]">
      <div className="fixed z-50 top-0 w-full bg-primary">
        <div className="flex px-5 py-3.5 border-b border-secondary/10">
          {!noMenu && (
            <Menu />
          )}
          <div className="grow">
            <h1 className={headerClss}>
              <Link to={useLink} className="flex items-center w-[220px] text-[#000423] text-secondary">
                {appName}
              </Link>
            </h1>
          </div>
          {extraButtons}
          <DarkMode />
        </div>
      </div>
    </div>
  );
}

export default Header;