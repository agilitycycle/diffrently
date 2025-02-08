import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {fbUpdate, fbPush} from '../../../services/firebaseService';
import {appState} from '../../../app/slices/appSlice';
import {updateSubjectState, subjectState} from '../../../app/slices/subjectSlice';
import {getSubjectData} from '../utils/utils';
import {BsQuestionCircleFill} from 'react-icons/bs';

const AddChapter = () => {
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const [chapters, setChapters] = useState(undefined);
  const [chapter, setChapter] = useState(undefined);
  const [chaptersHydrated, setChaptersHydrated] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const {userId} = currentAppState;
  const {subjects, activeId} = currentSubjectState;

  const getSubjectIndex = (id) => subjects.findIndex(x => x.id === id);

  const sort = (a, b) => {
		const propA = Object.keys(a)[0];
		const propB = Object.keys(b)[0];
    return +propA.match(/\d+/)[0] - +propB.match(/\d+/)[0];
  }

  const updateIsValid = () => {
    setIsValid(true); // reset
    const chaptersArray = chapters ? JSON.parse(chapters) : [];
    for (let i in chaptersArray) {
      const value = chaptersArray[i][Object.keys(chaptersArray[i])[0]];
      const number = Number(Object.keys(chaptersArray[i])[0].split('chapter-')[1]);
      if (number === chapter && value) {
        setIsValid(false);
      }
    }
  }

  const handleOnChange = (e) => {
    const {target} = e;
    const {value} = target;
    setChapter(Number(value));
  }

  const handleSubmit = () => {
    if (isValid) {
      let newChapters = [...chaptersHydrated];
      if (chaptersHydrated.filter(e => Object.keys(e)[0] !== `chapter-${chapter}`).length > 0) {
        newChapters.push({[`chapter-${chapter}`]: true, alias: ''});
      }
      // temporary measurement until chapter-1 has been resolved **
      if (chaptersHydrated.length < 1) {
        newChapters.push({'chapter-1': true, alias: ''});
      }

      const sorted = newChapters.sort(sort);
      const stringified = JSON.stringify(sorted);

      setChaptersHydrated(sorted);

      const itemIndex = getSubjectIndex(activeId);

      const newSubject = subjects.map((item, index) => {
        if (index === itemIndex) {
          return {
            ...item,
            chapters: stringified
          }
        } else {
           return item;
        }
      })

      const newSubjectState = Object.assign(
        {...currentSubjectState},
        {
          subjects: newSubject
        }
      );
      
      dispatch(updateSubjectState(newSubjectState));

      fbPush(`/userBooks/${activeId}/pages/chapter-${chapter}`, {
        content: '',
        dateCreated: moment().valueOf(),
        order: 0,
      });

      fbUpdate(`/userSubject/${userId}/subjects/${activeId}`, {
        chapters: stringified
      });
    }
  }

  // search and find **
  const handleChapters = () => {
    const subject = getSubjectData({subjects, activeId, keys: ['chapters']});
    const {chapters} = subject;
    setChapters(chapters);

    const parsed = JSON.parse(chapters);
    const getKeys = Object.keys(parsed[parsed.length - 1]);
    setChapter(Number(getKeys[0].split('chapter-')[1]) + 1);
    setChaptersHydrated(parsed);
  }

  // runs once if both conditions are met **
  useEffect(() => {
    if(!subjects || !activeId) return;
    handleChapters();
  }, [subjects, activeId])

  useEffect(() => {
    updateIsValid();
  }, [chapter, chapters])

  return (<div className="max-w-sm py-[45px] mx-auto">
    <div className="flex items-center justify-center relative">
      <div className="w-[90px] mr-3 relative">
        <input
          type="number"
          value={chapter}
          onChange={handleOnChange}
          className={`w-full h-9 pl-4 pr-3 bg-transparent placeholder:text-secondary/40 ${isValid ? 'text-secondary/60' : 'text-blue-600'} text-base font-bold border border-secondary/25 rounded-xl focus:outline-none shadow-sm focus:shadow-md`}
          placeholder="1"
        />
      </div>
      <button onClick={handleSubmit} type="button" className="px-3 w-fit h-[30px] text-base font-medium text-center flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Next chapter
      </button>
      <BsQuestionCircleFill className="ml-2.5 text-blue-600 text-xl cursor-pointer"/>
    </div>
  </div>)
}

export default AddChapter;