import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {subjectState} from '../../../../app/slices/subjectSlice';
import {getSubjectData} from '../../utils/utils';
import {BiFontSize} from 'react-icons/bi';

const PublicMenu = ({
  children,
  book,
  handleControls,
  changeBookMatter,
  expandCollapsePageToggle
}) => {
  const currentSubjectState = useSelector(subjectState);
  const {activeId, subjects} = currentSubjectState;
  const [chapters, setChapters] = useState('[]');
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

  useEffect(() => {
    if(!subjects || !activeId) return;
    const subject = getSubjectData({subjects, activeId, keys: ['chapters']});
    const {chapters} = subject;
    setChapters(chapters);
  }, [subjects, activeId])

  return (<div className="bg-gray-100 theme-dark:bg-secondary/5 text-secondary">
    <div className="flex justify-between w-full px-6">
      <div className="py-3 flex inline-flex items-center">
        <span className="hidden sm:inline text-base mr-2">Go to</span>
        <select onChange={(e) => changeBookMatter(e)} className="bg-primary/50 text-base cursor-pointer !outline-none font-medium px-2.5 mr-2 sm:mr-4 h-[35px] rounded-lg border border-secondary/15 mr-2">
          <option value="" className="disabled hidden">Book Matter</option>
          {getDropdown()}
        </select>
        <button className="bg-primary/50 border border-secondary/15 text-secondary w-[35px] h-[35px] font-medium inline-flex items-center justify-center rounded-full text-lg">
          <BiFontSize />
        </button>
      </div>
      <button onClick={() => handleControls({sidebar: {showOptions: !expandCollapsePageToggle}})} type="button" className="py-5 font-medium rtl:text-right text-gray-500 dark:text-gray-400 gap-3">
        <svg className={`w-3 h-3 ${!expandCollapsePageToggle ? 'rotate-180' : 'rotate-0'} shrink-0`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5 5 1 1 5"/>
        </svg>
      </button>
    </div>
    {children}
  </div>);
}

export default PublicMenu;