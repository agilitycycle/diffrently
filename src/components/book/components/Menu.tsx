import React from 'react';
import {useSelector} from 'react-redux';
import {subjectState} from '../../../app/slices/subjectSlice';
import {bookStates} from '../../../configs/constants';
import {BiFontSize} from 'react-icons/bi';
import {MdEdit} from 'react-icons/md';
import {IoMdEye} from 'react-icons/io';

const Menu = ({
  children,
  book,
  setBook,
  toggleEdit,
  handleControls,
  changeBookMatter,
  expandCollapsePageToggle
}) => {
  const currentSubjectState = useSelector(subjectState);
  const {chapters} = currentSubjectState;
  const isEdit = book.editMode === bookStates.EDIT;
  const bookMatterArray = ['Cover', 'Contents'];

  const getDropdown = () => {
    if (!chapters) return;
    const chaptersArray = [];
    const parsed = JSON.parse(chapters);
    for (let i in parsed) {
      const getChapter = Object.keys(parsed[i])[0].split('chapter-');
      chaptersArray.push(getChapter[1]);
    }
    const newArray = [...bookMatterArray, ...chaptersArray];
    return newArray.map(item => {
      if (item === 'Cover' || item === 'Contents') {
        return <option value={item} selected={book.selected === item}>{item}</option>
      }
      return <option value={`chapter-${item}`} selected={book.selected === `chapter-${item}`}>{`Chapter - ${item}`}</option>
    })
  }

  const isDisabled = () => {
    if (book.selected === 'Contents' ||
      book.state  === 'NOT_STARTED'
    ) {
      return true;
    }
    return false;
  }

  return (<div className="bg-gray-100 theme-dark:bg-secondary/5 text-secondary">
    <div className="flex justify-between w-full px-6">
      <div className="py-3 flex inline-flex items-center">
        <span className="hidden sm:inline text-base mr-2">Go to</span>
        <select onChange={(e) => changeBookMatter(e)} className="bg-primary/50 text-base cursor-pointer !outline-none font-medium px-2.5 mr-2 sm:mr-4 h-[35px] rounded-lg border border-secondary/15 mr-2">
          <option value="" className="disabled hidden">Book Matter</option>
          {getDropdown()}
        </select>
        {isEdit && (
          <button disabled={isDisabled()} onClick={() => setBook(Object.assign(
            {...book},
            {
              state: bookStates.PREVIEW,
              editMode: bookStates.PREVIEW
            }))} className="bg-primary/50 border border-secondary/15 text-secondary mr-2 sm:mr-4 w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
            <IoMdEye />
          </button>
        )}
        {!isEdit && (
          <button disabled={isDisabled()} onClick={() => toggleEdit()} className="bg-primary/50 border border-secondary/15 text-secondary mr-2 sm:mr-4 w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg disabled:opacity-50">
            <MdEdit />
          </button>
        )}
        <button className="bg-primary/50 border border-secondary/15 text-secondary w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg">
          <BiFontSize />
        </button>
      </div>
      <button onClick={() => handleControls({sidebar: {toggleSidebar: !expandCollapsePageToggle}})} type="button" className="py-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
        <svg className={`w-3 h-3 ${!expandCollapsePageToggle ? 'rotate-180' : 'rotate-0'} shrink-0`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
        </svg>
      </button>
    </div>
    {children}
  </div>);
}

export default Menu;