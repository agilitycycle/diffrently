import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {updateAppState, appState} from '../../app/slices/appSlice';
import {Skeleton} from '../common/Skeleton';

const Placeholder = () => {
  return (<div className="w-full sm:w-72 sm:max-w-72 p-2">
    <div className="relative mb-1 bg-transparent border border-gray-200 rounded-lg shadow theme-dark:bg-transparent theme-dark:border-gray-700">
      <div className="py-3 px-7">
        <h2 className="mb-4 text-xl text-white/60 font-semibold">Chapter 1</h2>
        <p className="text-white/60">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </div>
  </div>);
}

// animation component
const PostCard = ({id, index, item, getPost, clickedElement}) => {
  // if has new 'content'
  if (item && item.content) {
    return (<div key={index} onClick={(e) => getPost(e, id)} className="cursor-pointer w-full min-w-72 sm:w-72 p-3 theme-dark:px-6">
    <div className={`mb-1 bg-primary ${clickedElement === id ? 'border-blue-600 theme-dark:border-blue-600/65' : 'border-transparent theme-dark:border-gray-700'} border-b`}>
      <div className="pt-3 px-3 theme-dark:px-0">
        <div className="pb-7">
          <h2 className="mb-4 text-xl text-secondary/60 font-semibold">No title yet</h2>
          <p className="text-secondary/60 theme-dark:text-secondary/40">
            {item && `${item.content.slice(0, 150 - 1)}...`}
          </p>
        </div>
      </div>
    </div>
  </div>);
  }

  return (<div key={index} onClick={(e) => getPost(e, id)} className="cursor-pointer w-full min-w-72 sm:w-72 p-3 theme-dark:px-6">
    <div className={`mb-1 bg-primary ${clickedElement === id ? 'border-blue-600 theme-dark:border-blue-600/65' : 'border-transparent theme-dark:border-gray-700'} border-b`}>
      <div className="pt-3 px-3 theme-dark:px-0">
        <div className="pb-7">
          <h2 className="mb-4 text-xl text-secondary/60 font-semibold">{item && item.title}</h2>
          <p className="text-secondary/60 theme-dark:text-secondary/40">
            {item && item.body && `${item.body.slice(0, 150 - 1)}...`}
          </p>
        </div>
      </div>
    </div>
  </div>);
}

const Highlights = ({currentTimeline}) => {
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const {isPostCardShow, scrollPos} = currentAppState;
  const [clickedElement, setClickedElement] = useState(undefined);

  const getPost = (e, id) => {
    const {currentTarget} = e;
    const {parentElement} = currentTarget;
    const {scrollLeft} = parentElement;
    setClickedElement(id);
    const newAppState = Object.assign({}, {...currentAppState}, {
      scrollPos: scrollLeft,
      isPostCardShow: id
    });
    dispatch(updateAppState(newAppState));
  }

  const renderPost = () => {
    if (!currentTimeline) return Skeleton();

    const reverseCurrentTimeline = [...currentTimeline].reverse();

    if (currentTimeline && currentTimeline.length < 1) {
      return (<Placeholder/>)
    }

    return reverseCurrentTimeline.map((item, index) => {
      const {id} = item;
      const props = {
        id,
        index,
        item,
        getPost,
        clickedElement
      }
      return (<PostCard {...props}/>)
    })
  }

  useEffect(() => {
    if (!isPostCardShow) {
      document.getElementById('TimelinePostCards').scrollLeft = scrollPos;
    }
  }, [scrollPos, isPostCardShow]);

  return (<div id="TimelinePostCards" className={`${!isPostCardShow ? 'block' : 'hidden'} w-11/12 sm:w-10/12 mx-auto mb-8`}>
    <div className="flex flex-rows w-full h-80 overflow-x-scroll
      overflow-y-hidden"
    >
      {renderPost()}
    </div>
  </div>);
}

export default Highlights;