import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {controlState} from '../../../app/slices/controlSlice';
import {subjectState} from '../../../app/slices/subjectSlice';
import {getSubjectData} from '../utils/utils';

const NotStarted = ({
  loadBookMatter
}) => {
  const currentControlState = useSelector(controlState);
	const currentSubjectState = useSelector(subjectState);
  const {bookControls} = currentControlState;
  const {subjects, activeId} = currentSubjectState;
  const [meta, setMeta] = useState({
    title: '',
    coverUrl: undefined
  });
  const {title, coverUrl} = meta;

  useEffect(() => {
    if(!subjects || !activeId) return;
    const subject = getSubjectData({subjects, activeId, keys: ['title', 'coverUrl']});
    const {title, coverUrl} = subject;
    setMeta({
      title,
      coverUrl
    });
  }, [subjects, activeId]);

  return (
    <>
      <div className="w-full">
        <div className="bg-violet-900 text-center py-5 lg:px-4 mb-5">
          <div className="p-2 bg-violet-700/90 items-center text-white leading-none lg:rounded-full flex lg:inline-flex" role="alert">
            <span className="flex rounded-full bg-violet-500 uppercase px-2 py-1 text-xs font-bold mr-3">New</span>
            <span className="font-semibold mr-2 text-left flex-auto">
              Discover your articles inside.
            </span>
            <svg className="fill-current opacity-75 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z"/></svg>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row text-secondary/60 text-xl p-9">
          <div className="w-48 mb-8 mx-auto sm:mb-0">
            {!coverUrl && (
              <div className="w-48 h-60 mx-auto flex items-center justify-center bg-secondary/10 rounded p-2">
                Cover
              </div>
            )}
            {coverUrl && (
              <div className="w-48 h-60 mx-auto flex items-center justify-center rounded">
                <img src={coverUrl} className="max-h-full border border-secondary/20" />
              </div> 
            )}
          </div>
          <div className="grow flex flex-col justify-center mx-auto text-center">
            <p className={`mb-7 ${bookControls.isExpand ? 'text-4xl' : 'text-3xl'} font-bold text-[#000] theme-dark:text-secondary leading-relaxed px-3.5 pt-3.5`}>
              {title}
            </p>
            <p className="text-base tracking-wide">
              By James Star
            </p>
            <hr className="w-4/5 h-[1px] mx-auto my-8 bg-slate-400 border-0 theme-dark:bg-secondary"></hr>
            <div className="text-base mb-7">
              2% complete
            </div>
            <button onClick={() => loadBookMatter('chapter-1', 'EDIT', 'EDIT')} type="button" className={`${bookControls.isExpand ? 'px-7 px-2 text-xl' : 'px-5 py-2 text-base'} w-fit mx-auto h-11 font-medium inline-flex items-center justify-center text-white bg-blue-600 rounded-md`}>
              Start writing
            </button>
          </div>
        </div>
      </div>
    </>)
  }

  export default NotStarted;