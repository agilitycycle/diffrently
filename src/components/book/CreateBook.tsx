import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation, useNavigate} from 'react-router-dom';
import {matchPath} from 'react-router';
import {produce} from 'immer';
import {appState} from '../../app/slices/appSlice';
import {updateControlState, controlState} from '../../app/slices/controlSlice';
import {updateSubjectState, subjectState} from '../../app/slices/subjectSlice';
import {fbdb} from '../../app/firebase';
import {ref, query, get, onValue} from 'firebase/database';
import {addId} from './services/subjects';
import {Sidebar, BooksDropdown, Options} from './components';
import {Book} from './Book.tsx';
import {Page, Drawer, Header} from '../';
import {Skeleton} from '../common/Skeleton';
import {bookStates} from '../../configs/constants';

// https://qdus.hashnode.dev/simplifying-react-component-composition-with-dot-notation
// https://purecode.ai/generations/b105581b-8e18-4545-83c2-a328b58b0e7e/0
// https://bobbyhadz.com/blog/typescript-spread-types-may-only-be-created-from-object-types
// https://www.typescriptlang.org/docs/handbook/2/objects.html
// https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
// https://dev.to/osalumense/understanding-type-annotations-in-typescript-j19

const CreateBook = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentAppState = useSelector(appState);
  const currentControlState = useSelector(controlState);
  const currentSubjectState = useSelector(subjectState);
  const {userId, darkMode} = currentAppState;
  const {
    bookControls,
    editor
} = currentControlState;
  const {
    activeId,
    subjects,
    section,
    editorContent
  } = currentSubjectState;

 interface IBook {
  frontCover: boolean,
  state: string,
  editMode: string,
  contentLoaded: object | undefined,
  selected: string | undefined,
  newSection: boolean
 }

  const [book, setBook] = useState<IBook>({
    frontCover: true,
    state: 'NOT_STARTED',
    editMode: 'EDIT',
    contentLoaded: undefined,
    selected: undefined,
    newSection: false
  })

  const { pathname } = location;
  const match = matchPath({
    path: '/create/:username/:title',
    exact: true
  }, pathname);

  const handleNewSection = () => {
    setBook(Object.assign(
      {...book}, {newSection: true}
    ));
    openEditor();
  }

  // services/controls.js
  const handleControls = (newControl: object): void => {
    const key = Object.keys(newControl)[0];
    const value = newControl[key];
    const nextState = produce({
      bookControls,
      editor
    }, draft => {
      draft[key] = value
    })
    dispatch(updateControlState(Object.assign({...currentControlState}, {...nextState}))); 
  }

  // https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/

  // refactor
  const changeBookMatter = (e: React.FormEvent<HTMLInputElement>): void => {
    const {target} = e;
    const {value} = target;
    if (value === 'Contents') {
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
      const newSubjectState = Object.assign({}, {...currentSubjectState}, {
        chapter: value
      });
      dispatch(updateSubjectState(newSubjectState));
    }
  }

  // refactor
  const loadBookMatter = (value: string, state = bookStates.PREVIEW, editMode = bookStates.PREVIEW) => {
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

  // refactor
  const getBookMatter = async (matter: string) => {
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

  const previewEditToggle = (type: string) => {
    if (book.selected && type === 'edit') {
      setBook(Object.assign(
        {...book}, {
          state: 'EDIT',
          editMode: 'EDIT',
          newSection: false
        }
      ));
      handleControls({editor: {isEditor: false}});
    }
    if(book.selected && type === 'preview') {
      const newBook = Object.assign(
        {...book},
        {
          state: bookStates.PREVIEW,
          editMode: bookStates.PREVIEW
        });
      setBook(newBook)
    }
  }

  const getActiveId = () => {
    const {params} = match;
    // subject url
    const {title} = params;
    for (let i in subjects) {
      if(subjects[i].title === title.replace(/%20/g, ' ')) {
        const {
          id
        } = subjects[i];

        // Is There an Easy Way to Update Deeply Nested Objects in React? Bonsai example...
        // https://medium.com/@conboys111/is-there-an-easy-way-to-update-deeply-nested-objects-in-react-acf9301db1c1

        const newSubjectState = Object.assign({}, {...currentSubjectState}, {
          activeId: id
        });

        dispatch(updateSubjectState(newSubjectState));
      }
    }
  }

  // refactor
  const openEditor = () => {
    handleControls({editor: {isEditor: true}})
  }

  //
  // Props

  const sidebarProps  = {
    book,
    previewEditToggle,
    handleControls,
    isLightDark: bookControls.darkMode,
    isExpand: bookControls.isExpand
  }

  const menuProps  = {
    book,
    changeBookMatter
  }

  const notStartedProps = {
    loadBookMatter,
    bookControls
  }

  const editProps = {
    isEditor: editor.isEditor,
    openEditor,
    newSection: book.newSection,
    handleNewSection,
    selected: book.selected,
    content: book.newSection ? '' : book.contentLoaded
  }

  const previewProps = {
    currentSubjectState,
    selected: book.selected,
    content: book.contentLoaded
  }

  /**
   * saga uses get, whereas createBook depends on onValue
   * return realtime updates from Firebase **
   * Hopefully this will resolve having to push everything back to state
   */
  const addSubjectId = () => {
    const userRef = ref(fbdb, `userSubject/${userId}/subjects/`);
    const q = query(userRef);
    onValue(q, (snapshot) => {
      if(snapshot.val()) {
        const newSubjectState = Object.assign({...currentSubjectState}, {subjects: addId(snapshot.val())});
        dispatch(updateSubjectState(newSubjectState)); 
      }
    })
  }

  // add subject id
  useEffect(() => {
    addSubjectId();
  }, []);

  // mode
  useEffect(() => {
    handleControls({bookControls: {darkMode}});
  }, [darkMode])

  // content
  useEffect(() => {
    if (!book.contentLoaded) return;
    const newContentLoaded = {...book.contentLoaded};
    newContentLoaded[section].content = editorContent;

    setBook(Object.assign({}, {
      ...book
    }, {
      contentLoaded: {...newContentLoaded}
    }))
  }, [editorContent])

  // activeId
  useEffect(() => {
    if (!activeId && (subjects && subjects.length > 0)) {
      getActiveId();
    }
  }, [subjects])

  useEffect(() => {
    setBook({
      frontCover: true,
      state: 'NOT_STARTED', // reset book **
      editMode: 'EDIT',
      contentLoaded: undefined,
      selected: undefined, // reset book **
      newSection: false
    })
  }, [location])

	return (
    <Page>
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <Drawer />
      <div className="flex h-full">
        <Sidebar {...sidebarProps}/>
        <Book className={`${bookControls.darkMode !== undefined ? bookControls.darkMode ? 'dark' : 'light' : ''} w-[calc(100%-55px)] ${bookControls.isExpand ? 'md:w-[calc(100%-85px)]' : 'md:w-[600px] lg:w-[700px]'} h-full sm:h-[calc(100%-20px)] sm:mt-[10px] sm:mr-[10px] border border-secondary/10 shadow bg-page/section`}>
          <Book.Menu {...menuProps}/>
          <Book.Content>
            {activeId && (
              <>
                {book.state === bookStates.PRELOAD && (<Skeleton/>)}
                {book.state === bookStates.NOT_STARTED && <Book.NotStarted {...notStartedProps}/>}
                {book.state === bookStates.STARTED && <Book.Started/>}
                {book.state === bookStates.EDIT && <Book.Edit {...editProps}/>}
                {book.state === bookStates.PREVIEW && <Book.Preview {...previewProps}/>}
              </>
            )}
          </Book.Content>
          {
            (
              book.state === bookStates.EDIT &&
              book.selected !== 'Contents' &&
              editor.isEditor
            ) && 
            <Book.Footer/>
          }
        </Book>
        {!bookControls.isExpand ? (<div className="flex-1 grow overflow-hidden">
          <Options/>
        </div>) : (<></>)}
      </div>
    </Page>
  );
};

export default CreateBook;