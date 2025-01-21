import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {appState} from '../../app/slices/appSlice';
import {updateSubjectState, subjectState, initialState} from '../../app/slices/subjectSlice';
import {fbPush} from '../../services/firebaseService';
import {generateUsername} from './utils/utils';
import BooksDropdown from  './BooksDropdown';
import {TbSquareArrowRight} from 'react-icons/tb';
import {
  Page,
  Drawer,
  Header
} from '../';
import {getRandomIndex} from './utils/utils';
import randomSubjects from './utils/data/subjects';

const api = 'https://d9mi4czmx5.execute-api.ap-southeast-2.amazonaws.com/prod/{read+}';

const placeholder = randomSubjects[getRandomIndex(randomSubjects)];

const Subject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId} = currentAppState;
  const {subjects} = currentSubjectState;
  const [loading, setLoading] = useState(false);
  const [hasTopics, setHasTopics] = useState(false);
  const [active, setActive] = useState(false);
  const [subject, setSubject] = useState('');

  const handleChange = (e) => {
    const {target} = e;
    const {value} = target;
    setSubject(value);
  }
  
  /**
   * 
   * subject
   * category, {category: 'Person', tags: ['actor', 'film']}
   * tags
   * username
   * 
   */
  const handleSubjectType = (index) => {
    if (subject.length > 2) {
      setLoading(true);
      axios.post(api, JSON.stringify({
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
        const title = hasTopics[index].title;
        const chapters = JSON.stringify([{'chapter-1': true,'alias': ''}]);
        const username = generateUsername();

        // save to firebase

        const base = {
          subject: hydrateTag(subject),
          title,
          category: hydrateTag(category),
          tags: JSON.stringify(tags.map(tag => hydrateTag(tag))),
          username
        };

        const id = fbPush(`/userSubject/${userId}/subjects/`, base); 

        // local

        const newSubjects = [...subjects];
        newSubjects.push({
          id,
          subject: hydrateTag(subject)
        });

        const additional = {
          id,
          ...base,
          subjects: newSubjects,
          newSubject: true, // required??
          chapters
        };

        const amendedState = {};
        amendedState.value = {...initialState.value};
        amendedState.value.subjects = subjects || [];

        const newSubjectState = Object.assign(
          {}, {...amendedState.value}, {...additional}
        );
        dispatch(updateSubjectState(newSubjectState));

        setLoading(false);

        // redirect
        navigate('/start/next-step');
    
    }).catch(error => {
      console.log(error);
    });
  }
  }

  const handleSubject = () => {
    if(!subject || subject.length < 3) return;
    setActive(!active);
    axios.post(api, JSON.stringify({
      option: 'generate-titles',
      data: {
        text: subject
      }
    })).then(resp => {
      const {data} = resp;
      const {response} = data;
      const {content} = response;
      setHasTopics(JSON.parse(content).titles);
    }).catch(error => {
      console.log(error);
    });
  }

  const hydrateTag = (tag) => {
    // remove space, special characters
    const hydrated = tag.replace(/\w+/g, (a) =>
    `${a.charAt(0).toUpperCase()}${a.substr(1)}`).replace(/\s/g, '').replace(/[^\w\s]/gi, '');
    return [hydrated].filter(a => a.toLowerCase() && a.length < 25)[0];
  }

  const renderPreloader = () => {
    const items = Array.from({length:4});
    return items.map(() => {
      return (<li className="w-96 flex items-center justify-center px-5 py-3 mb-5 bg-secondary/5 block-inline rounded-2xl">
        <div role="status">
          <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
        <div className="ml-3">
          Loading...
        </div>
      </li>);
    })
  }

  const renderTopics = () => {
    return hasTopics.map((item, index) => {
      return (<li className="flex justify-between px-5 py-3 mb-5 bg-secondary/5 block-inline rounded-2xl">
        {item.title}
        <div className="ml-2.5 w-[24px]">
          <TbSquareArrowRight onClick={() => handleSubjectType(index)} className="cursor-pointer text-2xl text-emerald-400" />
        </div>
      </li>);
    });
  }

  if (loading) {
    return (<Page>
			<Drawer />
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <div className="flex flex-col justify-center h-3/5 sm:h-4/5">
        <div className="w-fit mx-auto" role="status">
          <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600/20 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </Page>);
  }

	return (<>
		<Page>
			<Drawer />
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <div className={`${active ? 'flex flex-col justify-center h-3/5 sm:h-4/5' : 'h-full'}`}>
        <div className={`flex flex-col px-9 ${active ? 'items-center' : 'items-center h-3/5 sm:h-4/5 justify-center'}`}>
          <div className={`text-secondary ${active ? 'text-3xl sm:text-5xl text-center pt-9 mb-6 sm:mb-8 lg:mb-8' : 'text-3xl sm:text-6xl mb-8 sm:mb-16 lg:mb-20'} font-light`}>
            What's this about?
          </div>
          <div className={`rounded-full border border-secondary/20 mb-7 sm:mb-14 w-full lg:w-2/3 ${active ? 'px-4 sm:px-5 py-3 sm:px-5' : 'px-8 sm:px-10 py-3.5 sm:py-5'}`}>
            <div className="flex items-center justify-between">
              <div className="flex w-full">
                <span className={`flex-none text-secondary ${active ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-5xl'} mr-4 sm:mr-5`}>#</span>
                <input value={subject} disabled={active} onChange={handleChange} className={`grow-1 w-full pr-5 text-secondary ${active ? 'text-xl sm:text-3xl' : 'text-2xl sm:text-5xl'} font-light bg-transparent !outline-none`} placeholder={placeholder} />
              </div>
              <button onClick={handleSubject} disabled={active} className="bg-emerald-400 w-11 sm:w-16 text-base sm:text-xl p-2 sm:p-3 rounded-full items-end">
                Go
              </button>
            </div>
          </div>
        </div>
        {active && (
          <div className="text-secondary/60 max-w-2xl px-9 mx-auto">
            <p className={`${active ? 'text-center' : ''} mb-5 sm:mb-9 text-lg sm:text-2xl`}>
              <span className="font-bold">Select</span> a title to customize:
            </p>
            <ol className="w-full text-secondary/60 text-base sm:text-lg mb-9">
              {!hasTopics && renderPreloader()}
              {hasTopics && renderTopics()}
            </ol>
            <button className="w-fit text-blue-700 text-base sm:text-lg mx-auto block">Reset</button>
          </div>
        )}
      </div>
	  </Page>
  </>);
};

export default Subject;