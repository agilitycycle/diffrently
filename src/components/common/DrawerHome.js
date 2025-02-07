import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateAppState, appState } from '../../app/slices/appSlice';
import Menu from './Menu';
import { clsx } from 'clsx';

const openClassNames = {
  right: 'translate-x-0',
  left: 'translate-x-0',
  top: 'translate-y-0',
  bottom: 'translate-y-0'
};

const closeClassNames = {
  right: 'translate-x-full',
  left: '-translate-x-full',
  top: '-translate-y-full',
  bottom: 'translate-y-full'
};

const classNames = {
  right: 'inset-y-0 right-0',
  left: 'inset-y-0 left-0',
  top: 'inset-x-0 top-0',
  bottom: 'inset-x-0 bottom-0'
};

const DrawerHome = ({ side = 'left' }) => {
  const currentAppState = useSelector(appState);
  const dispatch = useDispatch();
  const open = currentAppState && currentAppState.drawerHome;

  const drawerMenuItemClicked = () => {
    const newAppState = {...currentAppState};
    newAppState.drawerHomeMenuItemClicked = !newAppState.drawerHomeMenuItemClicked;
    dispatch(updateAppState(newAppState));
  }

  const toggleDrawer = () => {
    const newAppState = {...currentAppState};
    newAppState.drawerHome = !newAppState.drawerHome;
    if (!newAppState.drawerHome) {
      newAppState.drawerHomeMenuItemClicked = false;
    }
    dispatch(updateAppState(newAppState));
  }

  useEffect(() => {
    if (currentAppState.drawerHomeMenuItemClicked) {
      setTimeout(() => toggleDrawer(), 25)
    }
  }, [currentAppState]);

  return (
    <div
      id={`dialog-${side}`}
      className='relative z-10'
      aria-labelledby='slide-over'
      role='dialog'
      aria-modal='true'
      onClick={toggleDrawer}
    >
      <div
        className={clsx(
          'fixed inset-0 bg-gray-500 bg-opacity-75 transition-all',
          {
            'opacity-100 duration-500 ease-in-out visible': open
          },
          { 'opacity-0 duration-500 ease-in-out invisible': !open }
        )}
      ></div>
      <div className={clsx({ 'fixed inset-0 overflow-hidden': open })}>
        <div className='absolute inset-0 overflow-hidden'>
          <div
            className={clsx(
              'pointer-events-none fixed max-w-full',
              classNames[side]
            )}
          >
            <div
              className={clsx(
                'pointer-events-auto relative w-full h-full transform transition ease-in-out duration-500',
                { [closeClassNames[side]]: !open },
                { [openClassNames[side]]: open }
              )}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            >
              <div
                className={clsx(
                  'flex flex-col h-full w-64 bg-white p-5 shadow-xl bg-blue-400'
                )}
              >
                <div className="flex">
                  <Menu className="mt-[1px]" />
                  <div className="grow">
                    <h5 className="text-base font-medium text-gray-500 uppercase dark:text-gray-400">Menu</h5>
                  </div>
                </div>
                <div className="py-4 overflow-y-auto">
                  <ul className="space-y-2 font-medium">
                    <li>
                      <Link to="/why-diffrently" onClick={drawerMenuItemClicked} className="flex items-center mt-8 pt-2 pb-2 text-gray-900 dark:text-black">
                        <span>Why Diffrently</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/pricing" onClick={drawerMenuItemClicked} className="flex items-center pt-2 pb-2 text-gray-900 dark:text-black">
                        <span>Pricing</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/signin" onClick={drawerMenuItemClicked} className="flex items-center pt-2 pb-2 text-gray-900 dark:text-black">
                        <span>Sign in</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawerHome;