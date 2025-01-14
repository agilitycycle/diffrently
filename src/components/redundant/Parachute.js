import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { appState } from '../../app/slices/appSlice';
import {
  fbOnValueOrderByKeyLimitToLast
} from '../../services/firebaseService';
import {
  Page,
  Drawer,
  Header
} from '../../components';

// https://www.creative-tim.com/twcomponents/component/group-list

const Parachute = () => {
  const navigate = useNavigate();
  const currentAppState = useSelector(appState);
  const {userId} = currentAppState;
  const [dropzonesLoaded, setDropzonesLoaded] = useState(false);
  const [dropzones, setDropzones] = useState(undefined);

  const getDropzones = async () => {
    const result = await fbOnValueOrderByKeyLimitToLast(`/userDropzones/${userId}/dropzones/`, 100);
    setDropzones(result);
    setDropzonesLoaded(true);
  }

  const renderSkeleton = () => {
    return (
      <div role="status" className="max-w-sm animate-pulse">
        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[330px] mb-2.5"></div>
        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[300px] mb-2.5"></div>
        <div cclassNamelass="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  const renderDropzones = () => {
    if (!dropzones) return;
    const items = [];
    for (let i in dropzones) {
      items.push({id: i, ...dropzones[i]});
    }
    return items.map(item => {
      const { id, title, image } = item;
      return (
        <div onClick={() => navigate(`/dz/${btoa(JSON.stringify({id, title}))}`)} className="relative group border border-gray-700 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
          <LazyLoadImage className="w-20 h-20 object-cover object-center rounded-full" referrerpolicy="no-referrer" src={image || 'https://picsum.photos/id/18/300/200'}
            alt={title}
          />
          <h4 className="text-white text-xl font-bold text-center">{title}</h4>
          <p className="text-white/50">5 members</p>
          <p className="absolute top-2 text-white/20 inline-flex items-center text-xs">2 Online <span className="ml-2 w-2 h-2 block bg-green-500 rounded-full group-hover:animate-pulse"></span></p>
        </div>
      )
    })
  }

  useEffect(() => {
    if (dropzonesLoaded) return;
    getDropzones();
    // eslint-disable-next-line
  }, [dropzones])

	return (<>
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[900px]">
          <div className="min-w-80 pb-7 text-white font-sm">
            <div className="mt-9">
              <div className="flex-1 flex flex-col space-y-5 lg:space-y-0 lg:flex-row max-w-6xl sm:rounded-2xl">
                <div className="flex-1 px-2 sm:px-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-extralight text-white/50">Dropzone</h3>
                  </div>
                  <div className="mb-10 sm:mb-0 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <div className="group border border-gray-700 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center justify-center cursor-pointer rounded-md">
                      <a href={null} onClick={() => navigate('/create-dropzone')} className="bg-gray-700/30 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </a>
                      <a href={null} onClick={() => navigate('/create-dropzone')} className="text-white/50 text-center">Create dropzone</a>
                    </div>
                    {dropzonesLoaded && renderDropzones()}
                    {!dropzonesLoaded && renderSkeleton()}
                  </div>
                </div>
              </div>
            </div>
          </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default Parachute;