import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { matchPath } from 'react-router';
import axios from 'axios';
import {appState} from '../../app/slices/appSlice';
import {updateSubjectState, subjectState} from '../../app/slices/subjectSlice';
import {fbdb} from '../../app/firebase';
import {ref, query, get} from 'firebase/database';
import {fbUpdate, fbPush, fbRemove} from '../../services/firebaseService';
import {FiX} from 'react-icons/fi';
import {RiExpandLeftRightLine} from 'react-icons/ri';
import {MdArrowBackIos} from 'react-icons/md';
import {
  Page,
  Drawer,
  Header
} from '../../components';
import TimelinePost from '../../components/Timeline/TimelinePost';
import TimelinePostCards from '../../components/Timeline/TimelinePostCards';
import Make from '../../components/Cards/type/Make';
import Post from '../../containers/Post';

// https://purecode.ai/generations/b105581b-8e18-4545-83c2-a328b58b0e7e/0

const TimelineV2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId, darkMode} = currentAppState;
  const {
    subject,
    subjects,
    subjectId, // rename
    // newSubject,
    subjectImageUrl, // rename
    currentSubject,
    currentTimeline
  } = currentSubjectState;
  // does this need to be added back to subjects reducer?
  const [newSettings, setNewSettings] = useState({
    topic1: '', // could user add more than 3 topics?
    topic2: '',
    topic3: '',
    cardCount: 0
  });
  const [selectedTimeline, setSelectedTimeline] = useState(undefined);
  const [isTimeline, setIsTimeline] = useState(false);
  const [isGenerate, setIsGenerate] = useState(true);
  const [isPreferences, setIsPreferences] = useState(false);
  const [isLightDark, setIsLightDark] = useState(true);
  const [isExpand, setIsExpand] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const {topic1, topic2, topic3, cardCount} = newSettings;
  const { pathname } = location;
  const match = matchPath({
    path: '/timeline-v2/:username/:subject',
    exact: true
  }, pathname);

  const handleChange = (e) => {
    const {target} = e;
    const {value, name} = target;
    const newModel = {...newSettings};
    newModel[name] = value;
    setNewSettings(newModel);
  }

  const handleSubmit = (e) => {
    axios.post('https://d9mi4czmx5.execute-api.ap-southeast-2.amazonaws.com/prod/{read+}', JSON.stringify({
      option: 'generate-articles',
      data: {
        cardCount,
        text: `${subject}, ${topic1}, ${topic2}, ${topic3}`
      }
    })).then(resp => {
      console.log(resp)
      const { data } = resp;
      const { response } = data;
      const { content } = response;
      console.log(content)
  
      const newContent = JSON.parse(content);
      const {articles} = newContent;

      fbUpdate(`/userSubject/${userId}/subjects/${subjectId}`, {
        topic1,
        topic2,
        topic3,
        cardCount
      });

      articles.map((article) => {
        const {title, body} = article;
        fbPush(`/userTimelineV2/${subjectId}/post/`, {
          title,
          body
        });
      })

      const newSubjectState = Object.assign({}, {...currentSubjectState}, {
        newSubject: false,
        topic1: topic1,
        topic2: topic2,
        topic3: topic3,
        cardCount: cardCount,
        currentTimeline: articles
      });
      dispatch(updateSubjectState(newSubjectState));
  
    }).catch(error => {
      console.log(error);
    });
  }

  const handleOptions = (e) => {
    const {target} = e;
    const {value} = target;
    navigate(`/timeline-v2/${value}`);
  }

  const handleToggle = () => {
    setIsGenerate(!isGenerate);
  }

  const handleDelete = () => {
    fbRemove(`userSubject/${userId}/subjects/${currentSubject}`);
    fbRemove(`userTimelineV2/${currentSubject}`);

    const newSubjects = subjects.filter(x => x.id !== currentSubject);
    const newSubjectState = Object.assign({...currentSubjectState}, {subjects: newSubjects});
    dispatch(updateSubjectState(newSubjectState));

    navigate('/subject')
  }

  const getTimeline = async () => {
    const subjectId = selectedTimeline;
    const userRef = ref(fbdb, `userTimelineV2/${subjectId}/post`);
    const q = query(userRef);
    const newTimeline = await new Promise(resolve => {
      get(q)
        .then((snapshot) => {
          resolve(snapshot.val());
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // dispatch new results
    const timelineArray = [];
    for (let i in newTimeline) {
      const subjectObject = {id: i};
      for (let j in newTimeline[i]) {
        subjectObject[j] = newTimeline[i][j];
      }
      timelineArray.push(subjectObject);
    }

    const newSubjectState = Object.assign({}, {...currentSubjectState}, {
      currentTimeline: timelineArray
    });
    dispatch(updateSubjectState(newSubjectState));
  }

  const getSubject = () => {
    const {params} = match;
    const {subject} = params;
    for (let i in subjects) {
      if(subjects[i].subject === subject) {
        const {
          topic1,
          topic2,
          topic3,
          cardCount,
          imageUrl,
          id
        } = subjects[i];
        setNewSettings({
          topic1,
          topic2,
          topic3,
          cardCount
        })
        setSelectedTimeline(id);
        const newSubjectState = Object.assign({}, {...currentSubjectState}, {
          subjectImageUrl: imageUrl,
          subject, 
          currentSubject: id
        });
        dispatch(updateSubjectState(newSubjectState));
      }
    }
  }

  const renderOptions = () => {
    if (subjects.length < 1) return;
    return subjects.map((item, index) => {
      const {id, subject, username} = item;
      return (<option key={index} value={`${username}/${subject}`} selected={selectedTimeline === id}>{subject}</option>)
    })
  }

  const makeProps = {
    topic1,
    topic2,
    topic3,
    cardCount,
    imageUrl: subjectImageUrl,
    handleChange,
    handleSubmit
  }

  useEffect(() => {
    setIsLightDark(darkMode);
  }, [darkMode])

  useEffect(() => {
    if (selectedTimeline) {
      getTimeline();
    }
  }, [selectedTimeline])

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      getSubject();
    }
  }, [location, subjects])

	return (
    <Page>
      <Header />
      <Drawer />
      <div
        className="flex">
        <div className="flex flex-col w-full">
          <div className="pt-8 pb-6 text-sm font-medium text-center text-gray-500 theme-text-gray-400">
            <ul className="flex justify-center">
              <li className="me-2">
                <a href={null} onClick={() => setIsTimeline(true)}
                  className={`cursor-pointer inline-block px-4 pb-4 border-b-2 ${isTimeline === true ? 'border-blue-600 active theme-dark:text-blue-500 theme-dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-secondary/40 theme-dark:hover:text-gray-300'}`}>
                  Timeline
                </a>
              </li>
              <li className="me-2">
                <a href={null} onClick={() => setIsTimeline(false)}
                  className={`cursor-pointer inline-block px-4 pb-4 border-b-2 ${isTimeline === false ? 'border-blue-600 active theme-dark:text-blue-500 dark:border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-secondary/40 theme-dark:hover:text-gray-300'}`}>
                  Post
                </a>
              </li>
            </ul>
          </div>
          {isTimeline && (
            <>
              <TimelinePost/>
              <TimelinePostCards currentTimeline={currentTimeline}/>
              <div className="w-11/12 sm:w-10/12 mx-auto">
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <div>
                      <select name="timeline" onChange={handleOptions} className="bg-transparent border border-secondary/25 theme-dark:border-secondary/15 text-secondary/60 text-base rounded-lg block w-72 p-2.5 mb-7 !outline-none">
                        <option value="Select timeline" selected={!selectedTimeline}>Select Timeline</option>
                        {renderOptions()}
                      </select>
                    </div>
                    <div className="text-sm text-[#B3B5CC] mb-2">
                      {`Other reads >`}
                    </div>
                    <ul className="text-sm text-blue-600 leading-loose mb-7">
                      <li>#LeonardoDaVinci1</li>
                      <li>#LeonardoDaVinci2</li>
                      <li>#LeonardoDaVinci3</li>
                      <li>#LeonardoDaVinci4</li>
                    </ul>
                   <div className="w-72 border border-dashed border-secondary/35 theme-dark:border-secondary/15 rounded-sm mb-7 p-8 text-center text-base text-secondary/70 font-light">
                    Promote your book here.
                   </div>
                    <p className="w-72 text-sm text-[#B3B5CC] leading-loose mb-6">
                      Pay a mo. subscription for no Ads, Unlimited books and more control.
                    </p>
                  </div>
                  <button type="button" onClick={handleDelete} className="w-20 text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 mb-8 text-center me-2 mb-2 theme-dark:border-red-500 theme-dark:text-red-500 theme-dark:hover:text-white dark:hover:bg-red-600">
                    Delete
                  </button>
                </div>
              </div>
            </>
          )}
          {!isTimeline && (
            <div className="flex w-full justify-center">
              <div className={`w-11/12 ${isGenerate ? 'sm:w-80' : 'sm:w-[450px]'}`}>
                <label className="w-full mb-6 inline-flex items-center justify-center mb-5 cursor-pointer">
                  <input type="checkbox" onChange={handleToggle} value={isGenerate} className="sr-only peer" checked={isGenerate}/>
                  <div className="relative w-9 h-5 bg-secondary/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all theme-dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 theme-dark:text-gray-300">Generate</span>
                </label>
                {isGenerate && (
                  <Make {...makeProps} />
                )}
                {!isGenerate && (
                  <Post/>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={`${isOpen ? isLightDark ? 'dark' : 'light' : ''} absolute z-40 top-[60px] right-0 ${isOpen ? `w-[calc(100%-55px)] ${isExpand ? 'md:w-[95%]' : 'md:w-[600px] lg:w-[700px]'}` : 'w-6'} h-[calc(100%-60px)] border-l border-secondary/10 shadow bg-page/section`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -left-5 top-7 bg-page/section border border-transparent theme-dark:border-gray-800 shadow p-2 rounded-full hover:bg-page/section focus:outline-none"
        >
          {isOpen ? (
            <FiX className="w-4 h-4 text-secondary/60" />
          ) : (
            <RiExpandLeftRightLine className="w-4 h-4 text-secondary/60"/>
          )}
        </button>
        {isOpen && (
          <>
            <button
              onClick={() => setIsPreferences(!isPreferences)}
              className="absolute right-0 top-0 bottom-0 my-auto p-2 rounded-full focus:outline-none"
            >
              <MdArrowBackIos className="w-4 h-4 text-secondary/60"/>
            </button>
            {isPreferences && (
              <div className={`absolute top-0 bottom-0 right-10 my-auto z-50 w-64 sm:w-72 h-72 p-5 bg-page/section border border-gray-800 rounded`}>
                <div className="text-secondary/85 text-sm font-medium">
                  Preferences
                </div>
                <hr className="h-px my-5 border-0 bg-gray-700"></hr>
                <div>
                  <div className="flex flex-row mb-5">
                    <div className="w-1/2 text-sm text-secondary/60">
                      Chapter
                    </div>
                    <div className="w-1/2">
                      <select name="chapter" onChange={() => {}} className="bg-transparent border border-gray-700 text-secondary/60 text-base rounded-lg block w-full p-1 !outline-none">
                        <option value="Chapter" selected={true}>Chapter</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-row mb-5">
                    <div className="w-1/2 text-sm text-secondary/60">
                      Increase font
                    </div>
                    <div className="w-1/2 text-secondary/60">
                      + / -
                    </div>
                  </div>
                  <div className="flex flex-row mb-5">
                    <div className="w-1/2 text-sm text-secondary/60">
                      Light/dark
                    </div>
                    <div className="w-1/2">
                      <label className="w-full inline-flex items-center cursor-pointer">
                        <input type="checkbox" onChange={() => setIsLightDark(!isLightDark)} className="sr-only peer" checked={isLightDark} />
                        <div className="relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all theme-dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-row mb-5">
                    <div className="w-1/2 text-sm text-secondary/60">
                      Expand
                    </div>
                    <div className="w-1/2">
                      <label className="w-full inline-flex items-center cursor-pointer">
                        <input type="checkbox" onChange={() => setIsExpand(!isExpand)} value="" className="sr-only peer" checked={isExpand} />
                        <div className="relative w-9 h-5 peer-focus:outline-none rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all theme-dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="p-14">
              <div className="text-secondary/85 text-3xl mb-8">
                Book title here.
              </div>
              <div className="text-secondary/60 leading-loose">
                It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                <br />
                <br />
                Popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop.
              </div>
            </div>
          </>
        )}
      </div>
    </Page>
  );
};

export default TimelineV2;