/**
 * Example code only **
 * 
 */
const changeBookMatter = (e) => {
  const {target} = e;
  const {value} = target;
  if (value === 'Contents') {
    // put into its own slice
    setBook(Object.assign({...book}, {
      contentLoaded: undefined,
      editMode: bookStates.PREVIEW,
      state: 'PREVIEW',
      selected: value
    }));
    handleControls({editor: {isEditor: false}})
  }
  if(value === 'Cover' || value.indexOf('chapter-') > -1) {
    loadBookMatter(value);
  }
  if (value.indexOf('chapter-') > -1) {
    // capture chapter no. loaded **
    const newSubjectState = Object.assign({}, {...currentSubjectState}, {
      chapter: value
    });
    dispatch(updateSubjectState(newSubjectState));
  }
}

const loadBookMatter = (value, state = bookStates.PREVIEW, editMode = bookStates.PREVIEW) => {
  // put into its own slice
  setBook(Object.assign({...book}, {state: bookStates.PRELOAD}));
  getBookMatter(value).then(resp => {
    setBook(Object.assign({...book}, {
      contentLoaded: resp,
      state,
      editMode,
      selected: value
    }));
  });
  handleControls({editor: {isEditor: value !== 'Cover'}})
}

const getBookMatter = async (matter) => {
  const userRef = ref(fbdb, `userBooks/${activeId}/pages/${matter.toLowerCase()}`);
  const q = query(userRef);
  return await new Promise(resolve => {
    get(q)
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((error) => {
        console.log(error);
      });
  });
}