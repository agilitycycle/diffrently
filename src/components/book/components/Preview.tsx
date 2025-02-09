import React, {useEffect, useState} from 'react';
import {getSubjectData, getChapters} from '../utils/utils';
import '../../common/tiptap/styles.css';

const Section = ({chapterTitle, item}) => {
  const {
    content
  } = item;
  return (<div className="tiptap mb-5">
    <div className="leading-loose text-secondary/60 theme-dark:text-secondary/40 mb-2">
      <div className="mt-10 mb-8 text-center text-3xl text-secondary/60 theme-dark:text-secondary/40">
        {chapterTitle}
      </div>
      <div className="pl-7 pr-7 pb-7" dangerouslySetInnerHTML={{__html: content}}></div>
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

  useEffect(() => {
    if(!subjects || !activeId) return;
    const subject = getSubjectData({subjects, activeId, keys: ['chapters', 'coverUrl']});
    const {chapters, coverUrl} = subject;
    const chapterObject = JSON.parse(chapters).find(x => x.hasOwnProperty(chapter));
    const {alias} = chapterObject;
    let title = alias ? alias : chapter;
    setChapterTitle(title);
    setChapters(chapters);
    setCoverUrl(coverUrl);
  }, [subjects, activeId])

  if (selected === 'Cover') {
    return (<div className="w-full h-[calc(100vh-139px)] overflow-y-auto flex items-start">
        <img src={coverUrl} className="" />
      </div>);
  }

  if (selected === 'Contents') {
    return (<div className="h-[calc(100vh-174px)] relative overflow-y-auto">
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
    return (<div className="h-[calc(100vh-174px)] relative overflow-y-auto">
      {items.map(item => {
        return (<Section chapterTitle={chapterTitle} item={item} />)
      })}
    </div>);
  }
}

export default Preview;