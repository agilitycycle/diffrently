import React, {useEffect, useState} from 'react';
import {getSubjectData, getChapters} from '../utils/utils';
import '../../common/tiptap/styles.scss';

const Section = ({chapterTitle, item, index, resize}) => {
  const {
    content
  } = item;

  const resizeArrayMap = [
    '2rem',
    '3.2rem',
    '4.8rem'
  ]

  return (<div className={resize.className}>
    <div className="tiptap mb-5">
      <div className="leading-loose text-secondary/60 theme-dark:text-secondary/40 mb-2">
        {index === 0 && (<div className="mt-10 mb-8 text-center text-secondary theme-dark:text-secondary/40"
          style={{
            fontSize: resizeArrayMap[resize.index]
          }}>
          {chapterTitle}
        </div>)}
        <div dangerouslySetInnerHTML={{__html: content}}></div>
      </div>
    </div>
  </div>);
}

const Preview = ({
  currentSubjectState,
  selected,
  content
}) => {
  const {activeId, subjects, chapter, resize} = currentSubjectState;
  const [title, setTitle] = useState('');
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
    const subject = getSubjectData({subjects, activeId, keys: ['chapters', 'coverUrl', 'title']});
    const {chapters, coverUrl, title} = subject;
    setTitle(title);
    setChapters(chapters);
    setCoverUrl(coverUrl);
  }, [subjects, activeId])

  if (selected === 'Cover') {
    return (<div className="w-full h-[calc(100vh-139px)] overflow-y-auto flex items-start">
        {coverUrl && (<img src={coverUrl} className="" />)}
        {!coverUrl && (
          <div className="w-full flex flex-col items-center">
            <h1 className="w-3/4 mt-20 mb-14 font-light text-3xl text-center">{title}</h1>
            <div className="w-fit flex items-center p-4 mb-4 text-sm border border-blue-600 text-blue-600 rounded-lg bg-transparent" role="alert">
              <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
              </svg>
              <div>
                Click edit to upload an image cover.
              </div>
            </div>
          </div>
        )}
      </div>);
  }

  if (selected === 'Contents') {
    return (<div className="h-[calc(100vh-139px)] relative overflow-y-auto">
      <div className="p-8">
        <h1 className="text-secondary text-3xl font-medium mb-10">Contents</h1>
        <ol className="list-decimal list-inside text-blue-600 mb-12">
          {getChapters(chapters).map((item) => {
            const {label} = item;
            return (<li className="mb-5">
                <a href={null} className="cursor-pointer text-base text-blue-600">{label}</a>
              </li>)
          })}
        </ol>
        <div className="w-fit flex items-center p-4 mb-4 text-sm border border-blue-600 text-blue-600 rounded-lg bg-transparent" role="alert">
          <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
          </svg>
          <div>
            Click edit to update chapter names
          </div>
        </div>
      </div>
    </div>);
  }

  if (selected && selected.indexOf('chapter-') > -1) {
    return (<div className="h-[calc(100vh-121px)] sm:h-[calc(100vh-140px)] relative overflow-y-auto">
      {items.map((item, index) => {
        return (<Section
          chapterTitle={chapterTitle}
          item={item}
          index={index}
          resize={resize}
        />)
      })}
    </div>);
  }
}

export default Preview;