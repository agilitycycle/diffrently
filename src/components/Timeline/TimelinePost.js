import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppState, useDispatchAppState} from '../../hooks/state';
import {subjectState} from '../../app/slices/subjectSlice';

// https://stackoverflow.com/questions/65472666/calling-custom-hook-in-event-handler
// https://stackoverflow.com/questions/13349579/how-to-slowly-move-to-migrate-to-typescript-in-an-existing-javascript-system

const TimelinePost = () => {
  const currentSubjectState = useSelector(subjectState);
  const {currentTimeline} = currentSubjectState;
  const isPostCardShow = useAppState('isPostCardShow');
  const [content, setContent] = useState({
    title: 'Loading...',
    body: 'Loading...'
  });
  const {title, body} = content;
  const [data, setData] = useState(undefined);
  const [paginationIndex, setPaginationIndex] = useState(undefined);
  useDispatchAppState(data);

  const getContent = () => {
    if (isPostCardShow) {
      const result = currentTimeline.filter(item => {
        return item.id === isPostCardShow
      })

      const index = currentTimeline.findIndex(item => item.id === isPostCardShow);
      setPaginationIndex(index);
      setContent({
        title: result[0].title,
        body: result[0].body
      });
    }
  }

  const handleBack = () => {
    setData({
      isPostCardShow: undefined
    });
  }

  const handleUseInBook = () => {
    // what is required to use this component in the book?
  }

  const handlePrevious = () => {
    if (paginationIndex !== 0) {
      const content = currentTimeline[paginationIndex - 1];
      const {title, body} = content;
      setContent({
        title,
        body
      });
      setPaginationIndex (paginationIndex - 1);
    }
  }

  const handleNext = () => {
    if (paginationIndex < currentTimeline.length - 1) {
      const content = currentTimeline[paginationIndex + 1];
      const {title, body} = content;
      setContent({
        title,
        body
      });
      setPaginationIndex (paginationIndex + 1);
    }
  }

  useEffect(() => {
    getContent();
  }, [isPostCardShow])

  return (<div className={`w-11/12 mx-auto ${isPostCardShow ? 'block' : 'hidden'}`}>
    <div className="flex flex-col sm:flex-row justify-center mb-7">
      <div className="cursor-pointer w-11/12 sm:min-w-96 sm:w-96 sm:p-2 sm:mr-24">
        <div className="relative mb-1 bg-[#fbfbfc] border border-transparent theme-dark:border-gray-700 rounded-lg theme-dark:bg-transparent">
          <div className="py-3 px-7 h-96 overflow-y-auto">
            <h2 className="mb-4 text-xl text-secondary/60 font-semibold">
              {title}
            </h2>
            <p className="text-secondary/60">
              {body}
            </p>
          </div>
        </div>
      </div>
      <div className="w-11/12 sm:w-auto mt-3.5 sm:mt-0">
        <div className="flex flex-row sm:flex-col justify-center h-full">
          <button type="button" onClick={handleBack} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xs px-1.5 py-1 sm:px-3 sm:py-2 text-center me-2 sm:mb-5 theme-dark:border-blue-500 theme-dark:text-blue-500 theme-dark:hover:text-white theme-dark:hover:bg-blue-500 theme-dark:focus:ring-blue-800">
            Back
          </button>
          <button type="button" onClick={handleUseInBook} className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-xs px-1.5 py-1 sm:px-3 sm:py-2 text-center me-2 sm:mb-5 theme-dark:border-blue-500 theme-dark:text-blue-500 theme-dark:hover:text-white theme-dark:hover:bg-blue-500 theme-dark:focus:ring-blue-800">
            Use in book
          </button>
          <button type="button" onClick={handlePrevious} disabled={paginationIndex === 0} className="px-1.5 py-1 sm:px-5 sm:py-2.5 me-2 sm:mb-5 sm:me-0 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700 theme-dark:focus:ring-blue-800">
            Previous
          </button>
          <button type="button" onClick={handleNext} disabled={currentTimeline && paginationIndex === currentTimeline.length - 1} className="px-1.5 py-1 sm:px-5 sm:py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700 theme-dark:focus:ring-blue-800">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>);
}

export default TimelinePost;