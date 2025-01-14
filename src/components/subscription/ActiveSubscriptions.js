import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Menu,
  Drawer,
  Header
} from '../../components';
import { appState } from '../../app/slices/appSlice';

const ActiveSubScriptions = () => {
	const navigate = useNavigate();
  const currentAppState = useSelector(appState);
  const { subscriptions, credit } = currentAppState;
  const [ percentage, setPercentage ] = useState(undefined);

  useEffect(() => {
    if (!percentage) {
      if (credit > subscriptions.tags) {
        setPercentage(100)
      }
      if (credit < subscriptions.tags) {
        setPercentage(100 * credit / subscriptions.tags);
      } 
    }
  }, percentage)

  console.log(percentage)

	return (<>
		<div className="flex flex-col p-5 h-screen bg-[#000423]">
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="w-auto h-full sm:h-auto">
          {!subscriptions && (
            <div className="flex flex-row text-white mb-6">
              <div className="flex-1 text-left text-[#ffffff]">
                <div className="block w-full p-6 bg-white border border-gray-700 rounded-lg shadow dark:bg-transparent dark:border-gray-700">
                  <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">No active subscriptions</h5>
                  <p className="text-base text-[#A9AAC5] dark:text-[#A9AAC5] leading-loose">{
                    !currentAppState.freeTrial ? (<a href={null} onClick={() => navigate('/subscriptions')} className="cursor-pointer hover:underline">Consider getting a FREE Trial plan.</a>) :
                      (<a href={null} onClick={() => navigate('/subscriptions')} className="cursor-pointer hover:underline">Consider getting a Pay as you go plan</a>)
                  }</p>
                </div>
              </div>
            </div>
          )}
          {subscriptions && (
            <div className="flex flex-col sm:flex-row justify-center">
              <div className="flex flex-col items-start justify-between w-auto min-w-96 overflow-hidden rounded-2xl mb-5 border p-6 border-[#707070] bg-transparent">
                <div className="w-full inline-flex flex-col items-start justify-start">
                  <div className="flex flex-col items-start justify-start mb-8">
                    <p className="text-lg text-white font-normal">
                      {subscriptions.name}
                    </p>
                  </div>
                  <div className="w-full flex flex-col mb-5">
                    <div className="flex flex-col items-start justify-start">
                      <div className="w-full mb-8 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${percentage}%`}}></div>
                      </div>
                      <div className="inline-flex items-center justify-start mb-2">
                        <p className="text-base text-[#A9AAC5]">
                          <span className="text-2xl font-bold mr-2 relative top-[2px]">
                            {
                              credit
                            }
                          </span> tags left
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" className="group inline-flex items-center justify-center h-[42px] min-w-[42px] gap-2 w-full focus:outline-none text-white bg-rose-900 hover:bg-rose-800 dark:bg-rose-900 dark:hover:bg-rose-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Remove</button>
              </div>
            </div>
          )}
		    </div>
		  </div>
	  </div>
  </>);
};

export default ActiveSubScriptions;