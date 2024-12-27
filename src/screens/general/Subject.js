import React, {useEffect, useState, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {getRandomIndex} from '../../utility/random';
import random from 'random-string-generator';
import { adjectives } from '../../data/adjectives';
import { desserts } from '../../data/desserts';
import { appState } from '../../app/slices/appSlice';
import { updateSubjectState, subjectState, initialState } from '../../app/slices/subjectSlice';
import { fbPush } from '../../services/firebaseService';
import {
  Page,
  Drawer,
  Header
} from '../../components';

const generateUsername = () => {
  const dessertIndex = getRandomIndex(desserts)
  const adjectiveIndex = getRandomIndex(adjectives)
  return `${adjectives[adjectiveIndex]}-${desserts[dessertIndex]}-${random(5).toLowerCase()}`;
}

const Subject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId} = currentAppState;
  const {subjects} = currentSubjectState;
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
  
  const handleSubject = () => {
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

	return (<>
		<Page>
			<Drawer />
      <Header extraButtons={
        <div className="relative" ref={dropdownRef}>
          <button type="button"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-3 p-[5px] text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="true"
            onKeyDown={handleKeyDown}
          >
            Subjects <svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          {isOpen && (
            <div className="absolute right-0 w-48 z-10 bg-white rounded-lg shadow dark:bg-gray-700">
              <ul className="h-48 py-2 overflow-y-auto text-gray-700 dark:text-gray-200">
              {subjects.map(item => {
                const {
                  subject,
                  username
                } = item;
                const url = `/timeline-v2/${username}/${subject}`;
                return (<li>
                  <a href={null} onClick={() => handleOptions(url)} className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                    #{subject}
                  </a>
                </li>)
              })}
              </ul>
            </div>
          )}
        </div>
      } />
      <div className="flex flex-col items-center justify-center h-3/5 sm:h-4/5 px-3">
        <div className="transition-all ease-in-out mb-8 sm:mb-16 lg:mb-20 text-white text-3xl sm:text-6xl font-light">
          What is this about?
        </div>
        <div className="transition-all ease-in-out w-full lg:w-2/3 rounded-full border border-gray-200 dark:border-gray-700 mb-7 sm:mb-14 px-8 py-3.5 sm:px-10 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex w-full">
              <span className="flex-none text-white text-2xl sm:text-5xl mr-4 sm:mr-5">#</span>
              <input value={subject} onChange={handleChange} className="grow-1 w-full pr-5 text-white text-2xl sm:text-5xl font-light bg-transparent !outline-none" placeholder="Who/what/where" />
            </div>
            <button onClick={handleSubject} className="bg-emerald-400 w-11 sm:w-16 text-base sm:text-xl p-2 sm:p-3 rounded-full items-end">
              Go
            </button>
          </div>
        </div>
      </div>
      <div className="hidden flex flex-col items-center justify-center h-3/5 sm:h-4/5">
        <div className="transition-all ease-in-out mb-8 sm:mb-16 lg:mb-20 text-white text-3xl sm:text-6xl font-light">
          Is this a Person?
        </div>
        <div className="transition-all ease-in-out w-full lg:w-2/3 rounded-full border border-gray-200 dark:border-gray-700 px-10 py-5">
          <span className="text-white text-xl sm:text-5xl mr-5">#</span>
          <input className="text-white text-xl sm:text-5xl font-light bg-transparent !outline-none" value="russellcrowe" placeholder="What/who/where" />
        </div>
      </div>
	  </Page>
  </>);
};

export default Subject;