import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import moment from 'moment';
import {fbUpdate, fbPush} from '../../../services/firebaseService';
import {appState} from '../../../app/slices/appSlice';
import {subjectState} from '../../../app/slices/subjectSlice';
import {BsQuestionCircleFill} from 'react-icons/bs';

const MinusIcon = () => {
  return (<svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke-width="1.5" 
      stroke="currentColor" 
      className="w-4 h-4 text-[#000423]/90 theme-dark:text-white"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
    </svg>)
}

const PlusIcon = () => {
  return (<svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke-width="1.5" 
      stroke="currentColor" 
      className="w-4 h-4 text-[#000423]/90 theme-dark:text-white"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>);
}

const AddChapter = () => {
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const [chapter, setChapter] = useState(1);
  const [isValid, setIsValid] = useState(true);
  const {userId} = currentAppState;
  const {currentSubject, chapters} = currentSubjectState;

  const updateChapters = () => {

  }

  const updateValid = () => {
    setIsValid(true); // reset
    const chaptersArray = chapters ? JSON.parse(chapters) : [];
    for (let i in chaptersArray) {
      const number = Number(Object.keys(chaptersArray[i])[0].split('chapter-')[1]);
      if (number === chapter) {
        setIsValid(false);
      }
    }
  }

  const handleOnChange = (e) => {
    const {target} = e;
    const {value} = target;
    setChapter(Number(value));
  }

  const handleOnClick = (e) => {
    const {currentTarget} = e;
    const {id} = currentTarget;
    let newChapter = chapter;
    
    if (id === 'minus') {
      if (chapter > 1) {
        newChapter = newChapter - 1;
        setChapter(newChapter);
      }
    }
    if (id === 'plus') {
      newChapter = newChapter + 1;
      setChapter(newChapter);
    }
  }

  const handleSubmit = () => {
    if (isValid) {
      fbPush(`/userBooks/${currentSubject}/pages/chapter-${chapter}`, {
        content: '',
        dateCreated: moment().valueOf(),
        order: 0,
      });

      fbUpdate(`/userSubject/${userId}/subjects/${currentSubject}`, {
        chapters: updateChapters()
      });
    }
  }

  useEffect(() => {
    updateValid();
  }, [chapter, chapters])

  return (<div className="max-w-sm py-[45px] mx-auto">
    <div className="flex items-center justify-center relative">
      <div className="w-[110px] mr-3 relative">
        <input
          type="number"
          value={chapter}
          onChange={handleOnChange}
          className={`w-full h-9 pl-4 pr-3 bg-transparent placeholder:text-secondary/40 ${isValid ? 'text-secondary/60' : 'text-blue-600'} text-base font-bold border border-secondary/25 rounded-xl focus:outline-none shadow-sm focus:shadow-md`}
          placeholder="1"
        />
        <button
          id="minus"
          onClick={handleOnClick}
          className="absolute top-[6px] right-[35px] h-6 w-6 flex items-center justify-center bg-[#d7dce3] theme-dark:bg-[#252940] rounded-md"
          type="button"
        >
          <MinusIcon/>
        </button>
        <button
          id="plus"
          onClick={handleOnClick}
          className="absolute top-[6px] right-[6px] h-6 w-6 flex items-center justify-center bg-[#d7dce3] theme-dark:bg-[#252940] rounded-md"
          type="button"
        >
          <PlusIcon/>
        </button>
      </div>
      <button onClick={handleSubmit} type="button" className="px-3 w-fit h-[30px] text-base font-medium text-center flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Add
      </button>
      <BsQuestionCircleFill className="ml-2.5 text-blue-600 text-xl cursor-pointer"/>
    </div>
  </div>)
}

export default AddChapter;