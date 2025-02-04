const CHAPTER_CONSTANT = 'chapter-';
const CHAPTER_LABEL_CONSTANT = 'Chapter - ';

const getKeys = (item) => {
  return Object.keys(item);
}

export const getSubjectData = ({subjects, activeId, keys}) => {
  let obj = {};
  for (let i in keys) {
    const index = subjects.findIndex(x => x.id === activeId);
    obj[keys[i]] = subjects[index][keys[i]];
  }
  return obj;
}

/**
 * 
 * {
 *  chapter-X: true.
 *  alias: ""
 * }
 */

const getChapter = (object) => {
  for (let i in object) {
    if (object[i].indexOf('chapter-') > -1) {
      return object[i];
    }
  }
}

export const getChapters = (string) => {
  const chaptersArray = [];
  const chapters = JSON.parse(string);

  for (let i in chapters) {
    const chapter = getChapter(getKeys(chapters[i]));
    if (chapters[i].alias) {
      chaptersArray.push({
        key: chapter,
        label: `${chapters[i].alias}`
      });
    }
    if (!chapters[i].alias) {
      chaptersArray.push({
        key: chapter,
        label: `${CHAPTER_LABEL_CONSTANT} ${chapter.split(CHAPTER_CONSTANT)[1]}`
      });
    }
  }

  return chaptersArray;
}