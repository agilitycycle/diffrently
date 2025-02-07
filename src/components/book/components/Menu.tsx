import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {subjectState} from '../../../app/slices/subjectSlice';
import {getSubjectData} from '../utils/utils';

const Menu = ({
  children,
  book,
  changeBookMatter
}) => {
  const currentSubjectState = useSelector(subjectState);
  const {activeId, subjects} = currentSubjectState;
  const [chapters, setChapters] = useState('[]');
  const bookMatterArray = [{
    label: 'Cover',
    alias: ''
  },
  {
    label: 'Contents',
    alias: ''
  }];

  const getDropdown = () => {
    if (!chapters) return;
    const chaptersArray = [];
    const parsed = JSON.parse(chapters);
    for (let i in parsed) {
      const getChapter = Object.keys(parsed[i])[0].split('chapter-');

      const newChapterObject = {
        label: getChapter[1],
        alias: ''
      }

      if (parsed[i].alias !== '') {
        newChapterObject.alias = parsed[i].alias;
      }
      
      chaptersArray.push(newChapterObject);
    }
    const newArray = [...bookMatterArray, ...chaptersArray];
    return newArray.map((item) => {
      const {label, alias} = item;
      if (label === 'Cover' || label === 'Contents') {
        return <option value={label} selected={book.selected === label}>{
            label
          }</option>
      }
      return <option value={`chapter-${label}`} selected={book.selected === `chapter-${label}`}>{`${alias !== '' ? `${label}. ${alias}` : `Chapter - ${label}` }`}</option>
    })
  }

  useEffect(() => {
    if(!subjects || !activeId) return;
    const subject = getSubjectData({subjects, activeId, keys: ['chapters']});
    const {chapters} = subject;
    setChapters(chapters);
  }, [subjects, activeId])

  return (<div className="bg-gray-100 theme-dark:bg-secondary/5 text-secondary">
    <div className="flex justify-between w-full px-6">
      <div className="py-3 flex inline-flex items-center">
        {/*<span className="hidden sm:inline text-base mr-2">Go to</span>*/}
        <select onChange={(e) => changeBookMatter(e)} className="w-[200px] bg-primary/50 text-base cursor-pointer !outline-none font-medium px-2.5 mr-2 sm:mr-4 h-[35px] rounded-lg border border-secondary/15 mr-2">
          <option value="" className="disabled hidden">Book Matter</option>
          {getDropdown()}
        </select>
      </div>
    </div>
    {children}
  </div>);
}

export default Menu;