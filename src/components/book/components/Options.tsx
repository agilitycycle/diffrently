import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';
import {appState} from '../../../app/slices/appSlice';
import {updateSubjectState, subjectState} from '../../../app/slices/subjectSlice';
import {fbRemove} from '../../../services/firebaseService';

const Options = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId} = currentAppState;
  const {activeId, subjects} = currentSubjectState;

  // later, delete cover img
  const handleDelete = () => {
    if (!activeId || !userId) return;
    fbRemove(`userBooks/${activeId}`);
    fbRemove(`userSubject/${userId}/subjects/${activeId}`);
    fbRemove(`userTimelineV2/${activeId}`);

    const newSubjects = subjects.filter(x => x.id !== activeId);
    const newSubjectState = Object.assign({...currentSubjectState}, {subjects: newSubjects});
    dispatch(updateSubjectState(newSubjectState));

    navigate('/start')
  }

  return (<div className="hidden lg:flex justify-start xl:justify-center ml-[25px] mt-36">
    <div className="flex flex-col justify-between">
      <div>
        <div className="text-sm text-[#B3B5CC] mb-2">
          {`Other reads >`}
        </div>
        <ul className="text-sm text-blue-600 leading-loose mb-7">
          <li>+ Add a book URL</li>
          <li>+ Add a book URL</li>
          <li>+ Add a book URL</li>
        </ul>
        <div className="w-56 border border-dashed border-secondary/35 theme-dark:border-secondary/15 rounded-sm mb-7 p-8 text-center text-base text-secondary/70 font-light">
          Advertise here
        </div>
        <p className="w-72 text-sm text-[#B3B5CC] leading-loose mb-6">
          Pay a mo. subscription for no Ads, Unlimited books and more control.
        </p>
      </div>
      <button type="button" onClick={handleDelete} className="w-20 text-red-600 hover:text-white border border-red-600 hover:bg-red-700 focus:outline-none font-medium rounded-lg text-xs px-3 py-1.5 mb-8 text-center me-2 mb-2 theme-dark:border-red-500 theme-dark:text-red-500 theme-dark:hover:text-white dark:hover:bg-red-600">
        Delete
      </button>
    </div>
  </div>)
}

export default Options;