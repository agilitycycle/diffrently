import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {updateSubjectState, subjectState} from '../../app/slices/subjectSlice';
import {BooksDropdown} from './components';
import {Page, Drawer, Header} from '../';

const Discover = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentSubjectState = useSelector(subjectState);
  const {subjects} = currentSubjectState;

  const handleOptions = (url) => {
    const newSubjectState = Object.assign({}, {...currentSubjectState}, {
      activeId: ''
    });
    dispatch(updateSubjectState(newSubjectState));
    navigate(url);
  }


  // trigger load subjects **
  useEffect(() => {
    if (subjects && subjects.length > 0) return;
    const newSubjectState = Object.assign({}, {...currentSubjectState});
    dispatch(updateSubjectState(newSubjectState));
  }, [subjects])

	return (
    <Page>
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <Drawer />
      <div className="flex h-full">
        <div className="p-10">
          <div className="mb-5 text-3xl text-secondary font-medium">
            My Shelf
          </div>
          <div className="mb-5">
            <div className="max-w-sm sm:max-w-6xl overflow-x-auto">
              <div className="flex pb-5 space-x-8">
                {subjects.map(item => {
                  const {
                    title,
                    coverUrl,
                    username
                  } = item;
                  const url = `/create/${username}/${title}`;
                  return (
                    <div className="min-w-[200px] w-[200px] bg-primary p-5 rounded-lg">
                      <a href={null} onClick={() => handleOptions(url)} className="w-full cursor-pointer flex flex-col items-center">
                        <img src={coverUrl} className="w-full mb-2.5 rounded-md" />
                        <div>
                          {title.slice(0, 50)}{title.length > 50 ? '...' : ''}
                        </div>
                      </a>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="mb-5 text-3xl text-secondary font-medium">
            Recommended
          </div>
          <div>
            <div className="max-w-lg p-4 mb-4 text-base text-secondary rounded-lg bg-primary">
              New and recommended books will appear here.
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Discover;