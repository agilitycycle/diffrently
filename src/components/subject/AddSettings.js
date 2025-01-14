import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { appState } from '../../app/slices/appSlice';
import { updateSubjectState, subjectState } from '../../app/slices/subjectSlice';
import { fbUpdate } from '../../services/firebaseService';
import {
  Page,
  Drawer,
  Header
} from '../../components';
import Settings from '../common/cards/type/Settings';

const AddSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId} = currentAppState;
  const {subject, category, tags, username, subjectId} = currentSubjectState;
  const [newSettings, setNewSettings] = useState({
    title: '',
    imageUrl: '',
    blurb: ''
  });
  const {title, imageUrl, blurb} = newSettings;

  const handleChange = (e) => {
    const {target} = e;
    const {value, name} = target;
    const newModel = {...newSettings};
    newModel[name] = value;
    setNewSettings(newModel);
  }

  const updateSettings = () => {
    const {title, imageUrl, blurb} = newSettings;

    fbUpdate(`/userSubject/${userId}/subjects/${subjectId}`, {
      title,
      imageUrl,
      blurb
    });

    const newSubjectState = Object.assign({...currentSubjectState}, {
      subjectTitle: title,
      subjectImageUrl: imageUrl,
      subjectBlurb: blurb
    });
    dispatch(updateSubjectState(newSubjectState));

    // redirect
    navigate(`/create/${username}/${subject}`);
  }

  const settingsProps = {
    title,
    imageUrl,
    blurb,
    subject,
    category,
    tags,
    handleChange,
    updateSettings
  }

	return (<>
		<Page>
			<Drawer />
      <Header />
      <div className="flex flex-col items-center h-3/5 sm:h-4/5">
        <div className="w-full sm:w-3/4 mx-auto pt-20 mb-14">
          <ol className="flex items-center justify-center w-full text-base font-medium text-gray-500 theme-dark:text-gray-400 sm:text-base">
            <li className="flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 theme-dark:after:border-gray-700">
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 theme-dark:after:text-gray-500">
                  <span className="me-2">1</span>
                  <Link to="/subject" className="text-nowrap">
                    Add subject
                  </Link>
                </span>
            </li>
            <li className="flex md:w-full items-center text-blue-600 theme-dark:text-blue-500 after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 theme-dark:after:border-gray-700">
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 theme-dark:after:text-gray-500">
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span className="text-nowrap">Add settings</span>
              </span>
            </li>
            <li className="flex items-center">
              <span className="me-2">3</span>
              <span className="text-nowrap">Generate cards</span>
            </li>
          </ol>
        </div>
        <div>
          <Settings {...settingsProps}/>
        </div>
      </div>
	  </Page>
  </>);
};

export default AddSettings;