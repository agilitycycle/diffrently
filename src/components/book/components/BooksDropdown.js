import {useEffect, useState, useRef} from 'react';
import {updateSubjectState, subjectState} from '../../../app/slices/subjectSlice';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';

const BooksDropdown = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentSubjectState = useSelector(subjectState);
  const {subjects} = currentSubjectState;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleOptions = (id, url) => {
    const newSubjectState = Object.assign({}, {...currentSubjectState}, {
      activeId: id
    });
    dispatch(updateSubjectState(newSubjectState));
    navigate(url);
    setIsOpen(false);
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

  return (<div className="relative" ref={dropdownRef}>
    <button type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none font-medium rounded-lg text-sm px-3 p-[5px] text-center inline-flex items-center theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700"
      onClick={() => setIsOpen(!isOpen)}
      aria-expanded={isOpen}
      aria-haspopup="true"
      onKeyDown={handleKeyDown}
    >
      Books <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
      </svg>
    </button>
    {isOpen && (
      <div className="absolute right-0 w-48 z-10 bg-white rounded-lg shadow theme-dark:bg-gray-700">
        <ul className="h-48 py-2 overflow-y-auto text-gray-700 theme-dark:text-gray-200">
        {subjects.map(item => {
          const {
            id,
            subject,
            username
          } = item;
          const url = `/create/${username}/${subject}`;
          return (<li>
            <a href={null} onClick={() => handleOptions(id, url)} className="cursor-pointer flex items-center px-4 py-2 hover:bg-gray-100 theme-dark:hover:bg-gray-600 theme-dark:hover:text-white">
              #{subject}
            </a>
          </li>)
        })}
        </ul>
      </div>
    )}
  </div>);
}

export default BooksDropdown;