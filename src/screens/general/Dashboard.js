import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { appState } from '../../app/slices/appSlice';
import {
  Page,
  Drawer,
  Header
} from '../../components';

const Dashboard = () => {
  const navigate = useNavigate();
  const currentAppState = useSelector(appState);
  const {userId} = currentAppState;

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
                    <h3 className="text-3xl font-extralight text-white/50">Dashboard</h3>
                  </div>
                  <div className="mb-10 sm:mb-20 mt-10 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {/* -NrnSwk-t38iZWOB76Lt */}
                    {userId === 'batman' && (
                      <>
                        <div onClick={() => navigate('/timeline')} className="relative group border border-gray-700 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                          <a href={null} className="bg-gray-700/30 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 fill-white/50" viewBox="0 0 640 512">
                            <path d="M128 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm32 97.3c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80S48 51.8 48 96c0 32.8 19.7 61 48 73.3L96 224l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0 0 54.7c-28.3 12.3-48 40.5-48 73.3c0 44.2 35.8 80 80 80s80-35.8 80-80c0-32.8-19.7-61-48-73.3l0-54.7 256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0 0-54.7c28.3-12.3 48-40.5 48-73.3c0-44.2-35.8-80-80-80s-80 35.8-80 80c0 32.8 19.7 61 48 73.3l0 54.7-320 0 0-54.7zM488 96a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM320 392a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/>
                          </svg>
                          </a>
                          <h4 className="text-white text-xl font-bold capitalize text-center">Timeline</h4>
                          <p className="text-white/50">5000 post</p>
                        </div>
                        <div onClick={() => navigate('/parachute')} className="relative group border border-gray-700 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                          <a href={null} className="bg-gray-700/30 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 fill-white/50" viewBox="0 0 512 512">
                            <path d="M383.5 192c.3-5.3 .5-10.6 .5-16c0-51-15.9-96-40.2-127.6C319.5 16.9 288.2 0 256 0s-63.5 16.9-87.8 48.4C143.9 80 128 125 128 176c0 5.4 .2 10.7 .5 16L240 192l0 128-32 0c-7 0-13.7 1.5-19.7 4.2L68.2 192l28.3 0c-.3-5.3-.5-10.6-.5-16c0-64 22.2-121.2 57.1-159.3C62 49.3 18.6 122.6 4.2 173.6C1.5 183.1 9 192 18.9 192l6 0L165.2 346.3c-3.3 6.5-5.2 13.9-5.2 21.7l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-7.8-1.9-15.2-5.2-21.7L487.1 192l6 0c9.9 0 17.4-8.9 14.7-18.4C493.4 122.6 450 49.3 358.9 16.7C393.8 54.8 416 112.1 416 176c0 5.4-.2 10.7-.5 16l28.3 0L323.7 324.2c-6-2.7-12.7-4.2-19.7-4.2l-32 0 0-128 111.5 0z"/>
                          </svg>
                          </a>
                          <h4 className="text-white text-xl font-bold capitalize text-center">Parachute</h4>
                          <p className="text-white/50">4 dropzones</p>
                        </div>
                        <div onClick={() => navigate('/hosting')} className="relative group border border-gray-700 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                          <a href={null} className="bg-gray-700/30 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white/50" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
                          </a>
                          <h4 className="text-white text-xl font-bold capitalize text-center">Hosting</h4>
                          <p className="text-white/50">Active</p>
                        </div>   
                      </>
                    )}
                    <div onClick={() => navigate('/subject')} className="relative group border border-emerald-800 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                      <a href={null} className="bg-emerald-800 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white/50" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
                      </a>
                      <h4 className="text-white text-xl font-bold capitalize text-center">Subject</h4>
                      <p className="text-white/50">5 subjects</p>
                    </div>
                    <div onClick={() => navigate('/timeline-v2')} className="relative group border border-emerald-800 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                      <a href={null} className="bg-emerald-800 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white/50" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
                      </a>
                      <h4 className="text-white text-xl font-bold capitalize text-center">Timeline</h4>
                      <p className="text-white/50">5 timelines</p>
                    </div>
                    <div onClick={() => navigate('/hosting-v2')} className="relative group border border-indigo-800 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                      <a href={null} className="bg-indigo-800 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white/50" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
                      </a>
                      <h4 className="text-white text-xl font-bold capitalize text-center">Hosting</h4>
                      <p className="text-white/50">2 hosted</p>
                    </div>
                    <div onClick={() => navigate('/api')} className="relative group border border-indigo-800 bg-transparent py-10 px-4 flex flex-col space-y-2 items-center cursor-pointer rounded-md">
                      <a href={null} className="bg-indigo-800 text-white/50 flex w-20 h-20 rounded-full items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 fill-white/50" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 32zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64l0 64c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-64c0-35.3-28.7-64-64-64L64 288zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"/></svg>
                      </a>
                      <h4 className="text-white text-xl font-bold capitalize text-center">API</h4>
                      <p className="text-white/50">3 api's</p>
                    </div>
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

export default Dashboard;