const CHAPTER_CONSTANT = 'chapter-';
const CHAPTER_LABEL_CONSTANT = 'Chapter - ';

const getKeys = (item) => {
  return Object.keys(item);
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
    chaptersArray.push(`${CHAPTER_LABEL_CONSTANT} ${chapter.split(CHAPTER_CONSTANT)[1]}`);
  }

  return chaptersArray;
}