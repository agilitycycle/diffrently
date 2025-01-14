import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {appState} from '../../app/slices/appSlice';
import {updateSubjectState, subjectState, initialState} from '../../app/slices/subjectSlice';
import {fbPush} from '../../services/firebaseService';
import {generateUsername} from './utils/utils';
import {TbSquareArrowRight} from 'react-icons/tb';
import { HiMiniCog6Tooth } from 'react-icons/hi2';
import {
  Page,
  Drawer,
  Header
} from '../';

const Subject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId} = currentAppState;
  const {subjects} = currentSubjectState;
  const [nextStep, setNextStep] = useState(false);
  const [hasTopics, setHasTopics] = useState(false);
  const [active, setActive] = useState(false);
  const [subject, setSubject] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleChange = (e) => {
    const {target} = e;
    const {value} = target;
    setSubject(value);
  }
  
  const handleSubjectV1 = () => {
    if (subject.length > 3) {
      axios.post('https://d9mi4czmx5.execute-api.ap-southeast-2.amazonaws.com/prod/{read+}', JSON.stringify({
        option: 'subject-type',
        data: {
          text: subject
        }
      })).then(resp => {
        const { data } = resp;
        const { response } = data;
        const { content } = response;
    
        const newContent = JSON.parse(content);
        const {category, tags} = newContent;

        // {category: 'Person', tags: ['actor', 'film']}

        const username = generateUsername();

        const fbHydrated = {
          subject: hydrateTag(subject),
          category: hydrateTag(category),
          tags: JSON.stringify(tags.map(tag => hydrateTag(tag))),
          username
        };

        const hydrated = {
          subject: hydrateTag(subject),
          category: hydrateTag(category),
          chapters: JSON.stringify([{'chapter-1': true,'alias': ''}]),
          tags: tags.map(tag => hydrateTag(tag)),
          username
        };

        const subjectId = fbPush(`/userSubject/${userId}/subjects/`, fbHydrated);

        const amendedState = {};
        amendedState.value = {...initialState.value};
        amendedState.value.subjects = subjects || [];

        const newSubjects = [...subjects];
        newSubjects.push({
          id: subjectId,
          subject: hydrateTag(subject)
        });

        const newSubjectState = Object.assign(
          {}, {...amendedState.value}, hydrated, {subjectId}, {newSubject: true}, {subjects: newSubjects}
        );
        dispatch(updateSubjectState(newSubjectState));

        // redirect
        navigate('/add-settings');
    
    }).catch(error => {
      console.log(error);
    });
  }
  }

  const handleSubject = () => {
    setActive(!active);
    setHasTopics(!hasTopics);
  }

  const handleOptions = (url) => {
    const newSubjectState = Object.assign(
      {}, {...currentSubjectState}, {
        subject: '',
        currentSubject: '',
        currentTimeline: undefined
      });
    dispatch(updateSubjectState(newSubjectState));

    navigate(url);
  }

  const hydrateTag = (tag) => {
    // remove space, special characters
    const hydrated = tag.replace(/\w+/g, (a) =>
    `${a.charAt(0).toUpperCase()}${a.substr(1)}`).replace(/\s/g, '').replace(/[^\w\s]/gi, '');
    return [hydrated].filter(a => a.toLowerCase() && a.length < 25)[0];
  }

  const navigateNextStep = (index) => {
    navigate('/start/next-step');
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.pathname === '/start/next-step') {
      setNextStep(true);
    }
  }, location);

	return (<>
		<Page>
			<Drawer />
      <Header extraButtons={
        <div className="relative" ref={dropdownRef}>
          <button type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-3 p-[5px] text-center inline-flex items-center theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onKeyDown={handleKeyDown}
          >
            Books <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 w-48 z-10 bg-white rounded-lg shadow theme-dark:bg-gray-700">
              <ul className="h-48 py-2 overflow-y-auto text-gray-700 theme-dark:text-gray-200">
              {subjects.map(item => {
                const {
                  subject,
                  username
                } = item;
                const url = `/create/${username}/${subject}`;
                return (<li>
                  <a href={null} onClick={() => handleOptions(url)} className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100 theme-dark:hover:bg-gray-600 theme-dark:hover:text-white">
                    #{subject}
                  </a>
                </li>)
              })}
              </ul>
            </div>
          )}
        </div>
      } />
      {!nextStep && (
        <div className={`${active ? 'flex flex-col justify-center h-3/5 sm:h-4/5' : 'h-full'}`}>
          <div className={`flex flex-col px-9 ${active ? 'items-center' : 'items-center h-3/5 sm:h-4/5 justify-center'}`}>
            <div className={`text-secondary ${active ? 'text-3xl sm:text-5xl text-center pt-9 mb-6 sm:mb-8 lg:mb-8' : 'text-3xl sm:text-6xl mb-8 sm:mb-16 lg:mb-20'} font-light`}>
              What's this about?
            </div>
            <div className={`rounded-full border border-secondary/20 mb-7 sm:mb-14 w-full lg:w-2/3 ${active ? 'px-4 sm:px-5 py-3 sm:px-5' : 'px-8 sm:px-10 py-3.5 sm:py-5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex w-full">
                  <span className={`flex-none text-secondary ${active ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-5xl'} mr-4 sm:mr-5`}>#</span>
                  <input value={subject} onChange={handleChange} className={`grow-1 w-full pr-5 text-secondary ${active ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-5xl'} font-light bg-transparent !outline-none`} placeholder="World War II" />
                </div>
                <button onClick={handleSubject} className="bg-emerald-400 w-11 sm:w-16 text-base sm:text-xl p-2 sm:p-3 rounded-full items-end">
                  Go
                </button>
              </div>
            </div>
          </div>
          {/**
           * 
           * Has topics?
           * 
           */}
          {hasTopics && (
            <div className="text-secondary/60 max-w-2xl px-9 mx-auto">
              <p className={`${active ? 'text-center' : ''} mb-5 sm:mb-9 text-lg sm:text-2xl`}>
                <span className="font-bold">Select</span> a topic to customize:
              </p>
              <ol className="w-full text-secondary/60 text-base sm:text-lg">
                <li className="flex justify-between px-5 py-3 mb-5 bg-secondary/5 block-inline rounded-2xl">
                  The Turning Tides: A Comprehensive History of World War II
                  <div className="ml-2.5 w-[24px]">
                    <TbSquareArrowRight onClick={() => navigateNextStep(0)} className="cursor-pointer text-2xl text-emerald-400" />
                  </div>
                </li>
                <li className="flex justify-between px-5 py-3 mb-5 bg-secondary/5 block-inline rounded-2xl">
                  Heroes and Villains: Defining Characters of World War II
                  <div className="ml-2.5 w-[24px]">
                    <TbSquareArrowRight onClick={() => navigateNextStep(1)} className="cursor-pointer text-2xl text-emerald-400" />
                  </div>
                </li>
                <li className="flex justify-between px-5 py-3 mb-5 bg-secondary/5 block-inline rounded-2xl">
                  The Battlefields of Europe: Key Conflicts of World War II
                  <div className="ml-2.5 w-[24px]">
                    <TbSquareArrowRight onClick={() => navigateNextStep(2)} className="cursor-pointer text-2xl text-emerald-400" />
                  </div>
                </li>
                <li className="flex justify-between px-5 py-3 mb-5 bg-secondary/5 block-inline rounded-2xl">
                  The Home Fronts: Civilian Life During World War II
                  <div className="ml-2.5 w-[24px]">
                    <TbSquareArrowRight onClick={() => navigateNextStep(3)} className="cursor-pointer text-2xl text-emerald-400" />
                  </div>
                </li>
              </ol>
            </div>
          )}
        </div>
      )}
      {nextStep && (
        <div className="w-full lg:w-6/12 mx-auto flex flex-col items-center justify-center h-3/5 sm:h-4/5 py-9 text-secondary/60">
          <ol className="w-4/5 text-secondary/60 mb-16">
            <li className="flex items-top justify-center block-inline rounded-xl">
              <input type="text" id="large-input" value="The Turning Tides: A Comprehensive History of World War II" placeholder="Title" className="block w-full pb-2.5 bg-transparent text-2xl text-secondary/60 border-b-2 border-emerald-400 !outline-none"/>
              <HiMiniCog6Tooth className="relative top-[1px] ml-3.5 text-secondary/60 text-2xl sm:text-3xl"/>
            </li>
          </ol>
          <div className="w-4/5 flex items-center justify-center mb-16">
            <label for="bordered-checkbox-2" className="text-base leading-loose">
              <input checked id="bordered-checkbox-2" type="checkbox" value="" name="bordered-checkbox" className="w-4 h-4 mr-3 text-blue-600 border-secondary/60 rounded"/>
              Your <span className="text-blue-600">settings</span> will generate up to <select className="block-inline py-1 px-2 mx-1 w-fit leading-none text-base text-secondary/60 bg-transparent border-b-2 border-blue-600 appearance-none focus:outline-none peer">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3" selected>3</option>
              </select> articles
              </label>&nbsp;and 30+ tags.
          </div>
          <button onClick={() => {}} className="block rounded-full mt-4 mb-4 text-xl uppercase w-48 h-14 bg-[#f87341] text-[#ffffff]">
            Create
          </button>
        </div>
      )}
	  </Page>
  </>);
};

export default Subject;