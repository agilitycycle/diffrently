import React, {useEffect, useState} from 'react';
import {getSubjectData, getChapters} from '../utils/utils';
import '../../common/tiptap/styles.scss';

const Section = ({chapterTitle, item, index}) => {
  const {
    content
  } = item;
  return (<div className="tiptap mb-5">
    <div className="leading-loose text-secondary/60 theme-dark:text-secondary/40 mb-2">
      {index === 0 && (<div className="mt-10 mb-8 text-center text-3xl text-secondary/60 theme-dark:text-secondary/40">
        {chapterTitle}
      </div>)}
      <div dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
  </div>);
}

const Preview = ({
  currentSubjectState,
  selected,
  content
}) => {
  const {activeId, subjects, chapter} = currentSubjectState;
  const [chapterTitle, setChapterTitle] = useState('');
  const [chapters, setChapters] = useState('[]');
  const [coverUrl, setCoverUrl] = useState('');

  let items = [];
  for (let i in content) {
    const newItem = {
      id: i,
      ...content[i]
    }
    items.push(newItem);
  }

  /**
   * chapter only exist once a chapter is selected, hence
   * "active" chapter **
   * 
   */
  useEffect(() => {
    if(!subjects || !activeId || !chapter) return;
    const subject = getSubjectData({subjects, activeId, keys: ['chapters']});
    const {chapters} = subject;
    const chapterObject = JSON.parse(chapters).find(x => x.hasOwnProperty(chapter));
    const {alias} = chapterObject;
    let title = alias ? alias : chapter;
    setChapterTitle(title);
  }, [subjects, activeId, chapter])

  useEffect(() => {
    if(!subjects || !activeId) return;
    const subject = getSubjectData({subjects, activeId, keys: ['chapters', 'coverUrl']});
    const {chapters, coverUrl} = subject;
    setChapters(chapters);
    setCoverUrl(coverUrl);
  }, [subjects, activeId])

  if (selected === 'Cover') {
    return (<div className="w-full h-[calc(100vh-139px)] overflow-y-auto flex items-start">
        <img src={coverUrl} className="" />
      </div>);
  }

  if (selected === 'Contents') {
    return (<div className="h-[calc(100vh-139px)] relative overflow-y-auto">
      <div className="p-8">
        <h1 className="text-secondary text-3xl font-medium mb-12">Contents</h1>
        <ol className="list-decimal list-inside text-blue-600">
          {getChapters(chapters).map((item) => {
            const {label} = item;
            return (<li className="mb-5">
                <a href={null} className="cursor-pointer text-base text-blue-600">{label}</a>
              </li>)
          })}
        </ol>
      </div>
    </div>);
  }

  if (selected && selected.indexOf('chapter-') > -1) {
    return (<div className="h-[calc(100vh-121px)] sm:h-[calc(100vh-141px)] relative overflow-y-auto">
      {items.map((item, index) => {
        return (<Section chapterTitle={chapterTitle} item={item} index={index} />)
      })}
    </div>);
  }
}

export default Preview;