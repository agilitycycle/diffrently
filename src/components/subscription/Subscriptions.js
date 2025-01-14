import React, { useState } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Drawer,
  Header
} from '../../components';
import { fbUpdate, fbPush, fbSet } from '../../services/firebaseService';
import { updateAppState, appState } from '../../app/slices/appSlice';

const initialPriceCredit = 25;

const Subscriptions = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const { freeTrial, userId } = currentAppState;
  const [quantity, setQuanitity] = useState(1);
  const [priceCredit, setPriceCredit] = useState(initialPriceCredit);

  const handleQuantity = (num) => {
    const newQuantity = quantity + num;
    const newPriceCredit = newQuantity * initialPriceCredit;
    if (newQuantity > 0) {
      setQuanitity(newQuantity);
      setPriceCredit(newPriceCredit);
      const newAppState = Object.assign({...currentAppState}, {
        checkOut: newPriceCredit
      });
      dispatch(updateAppState(newAppState));
    }
  }

  const handleSubscriptions = () => {
    const dateCreated = moment().valueOf();
    fbPush(`/userSubscriptionsHistory/${userId}/subscriptions`, {
      name: 'FREE Trial',
      tags: 5,
      dateCreated
    });
    const pushKey = fbPush(`/userSubscriptions/${userId}/subscriptions`, {
      name: 'FREE Trial',
      tags: 5,
      dateCreated
    });
    fbUpdate(`/users/${userId}/`, {
      activeSubscriptions: pushKey,
      freeTrial: true,
      credit: 5
    });
    fbSet(`userStatus/${userId}`, {
      subscriber: true,
      lastUpdated: moment().valueOf()
    });
    const newAppState = Object.assign({...currentAppState}, {
      subscriptions: {
        dateCreated,
        name: 'FREE Trial',
        tags: 5
      },
      activeSubscriptions: pushKey,
      freeTrial: true,
      credit: 5
    });
    dispatch(updateAppState(newAppState));
    navigate('/profile')
  }

	return (<>
		<div className="flex flex-col p-5 h-screen bg-[#000423]">
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full sm:w-7/12 sm:h-auto">
          <h2 className="text-2xl text-white text-left leading-snug mb-8">
            Choose your plan
          </h2>
          <div className="w-11/12 lg:w-7/12 flex flex-col justify-center">
            <div className="flex flex-col items-start gap-12 overflow-hidden rounded-2xl mb-5 border p-6 border-[#707070] bg-transparent">
              <div className="inline-flex flex-col items-start justify-start gap-6">
                <div className="flex flex-col items-start justify-start gap-4">
                  <p className="text-lg text-white font-normal">FREE Trial - $0 (one-time)</p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-start justify-start gap-4">
                    <div className="inline-flex items-center justify-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                        <path
                          d="M7.40274 9.33332L9.73734 11.6667L17.5 3.75M16.9975 8.2176C17.4019 9.90307 17.2206 11.6793 16.4848 13.2438C15.7489 14.8083 14.5039 16.0641 12.9619 16.7974C11.4199 17.5306 9.67622 17.696 8.02809 17.2651C6.37996 16.8343 4.9293 15.834 3.92329 14.4346C2.91727 13.0352 2.41815 11.3235 2.51095 9.59091C2.60376 7.85832 3.28276 6.21216 4.43225 4.9329C5.58175 3.65365 7.13063 2.82044 8.81497 2.57527C10.4993 2.33008 12.2149 2.6881 13.6694 3.5883">
                        </path>
                      </svg>
                      <p className="text-base text-[#A9AAC5]">25 tags / 5 images</p>
                    </div>
                    <div className="inline-flex items-center justify-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                        <path
                          d="M7.40274 9.33332L9.73734 11.6667L17.5 3.75M16.9975 8.2176C17.4019 9.90307 17.2206 11.6793 16.4848 13.2438C15.7489 14.8083 14.5039 16.0641 12.9619 16.7974C11.4199 17.5306 9.67622 17.696 8.02809 17.2651C6.37996 16.8343 4.9293 15.834 3.92329 14.4346C2.91727 13.0352 2.41815 11.3235 2.51095 9.59091C2.60376 7.85832 3.28276 6.21216 4.43225 4.9329C5.58175 3.65365 7.13063 2.82044 8.81497 2.57527C10.4993 2.33008 12.2149 2.6881 13.6694 3.5883">
                        </path>
                      </svg>
                      <p className="text-base text-[#A9AAC5]">Publish / export 1-2 post</p>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button"
                onClick={handleSubscriptions}
                disabled={freeTrial}
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-lg py-2 align-middle text-sm font-semibold leading-none transition-all duration-300 ease-in-out disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 stroke-white px-6 text-white h-[42px] min-w-[42px] gap-2 w-full disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100">
                <span>Try now</span>
              </button>
            </div>
            <div className="flex flex-col gap-x-4 justify-center">
              <div className="flex flex-col items-start justify-between gap-12 overflow-hidden rounded-2xl mb-5 border p-6 border-[#707070] bg-transparent">
                <div className="inline-flex flex-col items-start justify-start gap-6">
                  <div className="flex flex-col items-start justify-start gap-4">
                    <p className="text-lg text-white font-normal">Extra - $5 NZD</p>
                    <div className="inline-flex items-end justify-start gap-2">
                      <form className="max-w-xs">
                        <label htmlFor="counter-input" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
                        <div className="relative flex items-center">
                          <button type="button" onClick={() => handleQuantity(-1)} id="decrement-button" data-input-counter-decrement="counter-input" className="flex-shrink-0 bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-600 dark:border-slate-700 hover:bg-slate-300 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                          </button>
                          <input type="text" id="counter-input" data-input-counter className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center" placeholder="" value={quantity} required />
                          <button type="button" onClick={() => handleQuantity(+1)} id="increment-button" data-input-counter-increment="counter-input" className="flex-shrink-0 bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-600 dark:border-slate-700 hover:bg-slate-300 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                          </button>
                      </div>
                    </form>
                    </div>
                  </div>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-start justify-start gap-4">
                      <div className="inline-flex items-center justify-start gap-3">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                          <path
                            d="M7.40274 9.33332L9.73734 11.6667L17.5 3.75M16.9975 8.2176C17.4019 9.90307 17.2206 11.6793 16.4848 13.2438C15.7489 14.8083 14.5039 16.0641 12.9619 16.7974C11.4199 17.5306 9.67622 17.696 8.02809 17.2651C6.37996 16.8343 4.9293 15.834 3.92329 14.4346C2.91727 13.0352 2.41815 11.3235 2.51095 9.59091C2.60376 7.85832 3.28276 6.21216 4.43225 4.9329C5.58175 3.65365 7.13063 2.82044 8.81497 2.57527C10.4993 2.33008 12.2149 2.6881 13.6694 3.5883">
                          </path>
                        </svg>
                        <p className="text-base text-[#A9AAC5]">5 generated images</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button"
                  disabled
                  onClick={() => navigate('/subscriptions/payment')}
                  className="group inline-flex items-center justify-center whitespace-nowrap rounded-lg py-2 align-middle text-sm font-semibold leading-none transition-all duration-300 ease-in-out disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 stroke-white px-6 text-white h-[42px] min-w-[42px] gap-2 w-full disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100">
                  <span>Add</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-12 overflow-hidden rounded-2xl mb-5 border p-6 border-[#707070] bg-transparent">
              <div className="inline-flex flex-col items-start justify-start gap-6">
                <div className="flex flex-col items-start justify-start gap-4">
                  <p className="text-lg text-white font-normal">Booster - ${priceCredit} NZD</p>
                  <div className="inline-flex items-end justify-start gap-2">
                    <form className="max-w-xs">
                      <label htmlFor="counter-input" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Choose quantity:</label>
                      <div className="relative flex items-center">
                          <button type="button" onClick={() => handleQuantity(-1)} id="decrement-button" data-input-counter-decrement="counter-input" className="flex-shrink-0 bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-600 dark:border-slate-700 hover:bg-slate-300 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                            </svg>
                          </button>
                          <input type="text" id="counter-input" data-input-counter className="flex-shrink-0 text-gray-900 dark:text-white border-0 bg-transparent text-sm font-normal focus:outline-none focus:ring-0 max-w-[2.5rem] text-center" placeholder="" value={quantity} required />
                          <button type="button" onClick={() => handleQuantity(+1)} id="increment-button" data-input-counter-increment="counter-input" className="flex-shrink-0 bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-600 dark:border-slate-700 hover:bg-slate-300 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                            <svg className="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                            </svg>
                          </button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-start justify-start gap-4">
                    <div className="inline-flex items-center justify-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                        <path
                          d="M7.40274 9.33332L9.73734 11.6667L17.5 3.75M16.9975 8.2176C17.4019 9.90307 17.2206 11.6793 16.4848 13.2438C15.7489 14.8083 14.5039 16.0641 12.9619 16.7974C11.4199 17.5306 9.67622 17.696 8.02809 17.2651C6.37996 16.8343 4.9293 15.834 3.92329 14.4346C2.91727 13.0352 2.41815 11.3235 2.51095 9.59091C2.60376 7.85832 3.28276 6.21216 4.43225 4.9329C5.58175 3.65365 7.13063 2.82044 8.81497 2.57527C10.4993 2.33008 12.2149 2.6881 13.6694 3.5883">
                        </path>
                      </svg>
                      <p className="text-base text-[#A9AAC5]">25 tags / 25 images</p>
                    </div>
                    <div className="inline-flex items-center justify-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                        <path
                          d="M7.40274 9.33332L9.73734 11.6667L17.5 3.75M16.9975 8.2176C17.4019 9.90307 17.2206 11.6793 16.4848 13.2438C15.7489 14.8083 14.5039 16.0641 12.9619 16.7974C11.4199 17.5306 9.67622 17.696 8.02809 17.2651C6.37996 16.8343 4.9293 15.834 3.92329 14.4346C2.91727 13.0352 2.41815 11.3235 2.51095 9.59091C2.60376 7.85832 3.28276 6.21216 4.43225 4.9329C5.58175 3.65365 7.13063 2.82044 8.81497 2.57527C10.4993 2.33008 12.2149 2.6881 13.6694 3.5883">
                        </path>
                      </svg>
                      <p className="text-base text-[#A9AAC5]">Publish / export 4-5 post</p>
                    </div>
                    <div className="inline-flex items-center justify-start gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="stroke-white">
                        <path
                          d="M7.40274 9.33332L9.73734 11.6667L17.5 3.75M16.9975 8.2176C17.4019 9.90307 17.2206 11.6793 16.4848 13.2438C15.7489 14.8083 14.5039 16.0641 12.9619 16.7974C11.4199 17.5306 9.67622 17.696 8.02809 17.2651C6.37996 16.8343 4.9293 15.834 3.92329 14.4346C2.91727 13.0352 2.41815 11.3235 2.51095 9.59091C2.60376 7.85832 3.28276 6.21216 4.43225 4.9329C5.58175 3.65365 7.13063 2.82044 8.81497 2.57527C10.4993 2.33008 12.2149 2.6881 13.6694 3.5883">
                        </path>
                      </svg>
                      <p className="text-base text-[#A9AAC5]">Functions</p>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button"
                disabled
                onClick={() => navigate('/subscriptions/payment')}
                className="group inline-flex items-center justify-center whitespace-nowrap rounded-lg py-2 align-middle text-sm font-semibold leading-none transition-all duration-300 ease-in-out disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 stroke-white px-6 text-white h-[42px] min-w-[42px] gap-2 w-full disabled:bg-slate-100 disabled:stroke-slate-400 disabled:text-slate-400 disabled:hover:bg-slate-100">
                <span>Add</span>
              </button>
            </div>
          </div>
		    </div>
		  </div>
	  </div>
  </>);
};

export default Subscriptions;