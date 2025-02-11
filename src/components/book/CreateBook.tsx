import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {matchPath} from 'react-router';
import {bookStates} from '../../configs/constants';
import {appState} from '../../app/slices/appSlice';
import {
  updateSubjectState,
  subjectState
} from '../../app/slices/subjectSlice';
import {fbdb} from '../../app/firebase';
import {ref, query, get, onValue} from 'firebase/database';
import {fbRemove} from '../../services/firebaseService';
import Sidebar from './components/Sidebar.tsx';
import {Book} from './Book.tsx';
import BooksDropdown from  './components/BooksDropdown';
import {Page, Drawer, Header} from '../';
import Highlights from '../highlights/Highlights';
import Options from './components/Options.tsx';
import {Skeleton} from '../common/Skeleton';

// https://qdus.hashnode.dev/simplifying-react-component-composition-with-dot-notation
// https://purecode.ai/generations/b105581b-8e18-4545-83c2-a328b58b0e7e/0

type WrapperProps = {
  children: any
}

const Wrapper = ({children}: WrapperProps) => <div className="flex flex-col w-full">{children}</div>;

const CreateBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId, darkMode} = currentAppState;
  const {
    activeId,
    subjects,
    section,
    editorContent,
    currentTimeline
  } = currentSubjectState;
  const [selectedTimeline, setSelectedTimeline] = useState(undefined);

 // https://bobbyhadz.com/blog/typescript-spread-types-may-only-be-created-from-object-types
 // https://www.typescriptlang.org/docs/handbook/2/objects.html
 // https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
 // https://dev.to/osalumense/understanding-type-annotations-in-typescript-j19

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

  const [controls, setControls] = useState({
    bookControls: {
      showOptions: false,
      isExpand: false,
      darkMode: undefined
    },
    editor: {
      isEditor: false
    }
  })
  const { bookControls } = controls

  const { pathname } = location;
  const match = matchPath({
    path: '/create/:username/:subject',
    exact: true
  }, pathname);

  const handleOptions = (e) => {
    const {target} = e;
    const {value} = target;
    setBook(Object.assign({}, {
      ...book
    },
    {
      state: 'NOT_STARTED',
      selected: undefined
    }));
    navigate(`/create/${value}`);
  }

  // later, delete cover img
  const handleDelete = () => {
    // cannot afford to lose data again **
    if (!activeId || !userId) return;
    fbRemove(`userBooks/${activeId}`);
    fbRemove(`userSubject/${userId}/subjects/${activeId}`);
    fbRemove(`userTimelineV2/${activeId}`);

    const newSubjects = subjects.filter(x => x.id !== activeId);
    const newSubjectState = Object.assign({...currentSubjectState}, {subjects: newSubjects});
    dispatch(updateSubjectState(newSubjectState));

    navigate('/start')
  }

  const handleNewSection = () => {
    setBook(Object.assign(
      {...book}, {newSection: true}
    ));
    openEditor();
  }

  const deepObjectUpdate = (object, prop, newValue) => {
    let newObject = {
      [prop]: {}
    };
    for (let i in object) {
      newObject[prop][i] = newValue[prop].hasOwnProperty(i) ? newValue[prop][i] : object[i];
    }
    return newObject;
  }

  const handleControls = (newControl) => {
    const {bookControls, editor} = controls;
    const types = ['bookControls', 'editor'];
    let newObject;
    for (let i in types) {
      const typeString = types[i];
      if (newControl.hasOwnProperty(typeString)) {
        newObject = deepObjectUpdate(typeString === 'bookControls' ? bookControls : editor, typeString, newControl);
      }
    }
    setControls(Object.assign({}, {...controls}, {...newObject}));
  }

  const changeBookMatter = (e) => {
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
      // capture chapter no. loaded **
      const newSubjectState = Object.assign({}, {...currentSubjectState}, {
        chapter: value
      });
      dispatch(updateSubjectState(newSubjectState));
    }
  }

  const loadBookMatter = (value, state = bookStates.PREVIEW, editMode = bookStates.PREVIEW) => {
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
    const userRef = ref(fbdb, `userBooks/${selectedTimeline}/pages/${matter.toLowerCase()}`);
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

  const previewEditToggle = (type) => {
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

  const getTimeline = async () => {
    const subjectId = selectedTimeline;
    const userRef = ref(fbdb, `userTimelineV2/${subjectId}/post`);
    const q = query(userRef);
    const newTimeline = await new Promise(resolve => {
      get(q)
        .then((snapshot) => {
          resolve(snapshot.val());
        })
        .catch((error) => {
          console.log(error);
        });
    });

    // dispatch new results
    const timelineArray = [];
    for (let i in newTimeline) {
      const subjectObject = {id: i};
      for (let j in newTimeline[i]) {
        subjectObject[j] = newTimeline[i][j];
      }
      timelineArray.push(subjectObject);
    }

    const newSubjectState = Object.assign({}, {...currentSubjectState}, {
      currentTimeline: timelineArray
    });
    dispatch(updateSubjectState(newSubjectState));
  }

  const getSubject = () => {
    const {params} = match;
    // subject url
    const {subject} = params;
    for (let i in subjects) {
      if(subjects[i].subject === subject) {
        const {
          id
        } = subjects[i];

        // Is There an Easy Way to Update Deeply Nested Objects in React? Bonsai example...
        // https://medium.com/@conboys111/is-there-an-easy-way-to-update-deeply-nested-objects-in-react-acf9301db1c1
        // could try immer later??

        setSelectedTimeline(id);

        const newSubjectState = Object.assign({}, {...currentSubjectState}, {
          activeId: id
        });

        dispatch(updateSubjectState(newSubjectState));
      }
    }
  }

  const renderOptions = () => {
    if (!subjects || subjects && subjects.length < 1) return;
    return subjects.map((item, index) => {
      const {id, subject, username} = item;
      return (<option key={index} value={`${username}/${subject}`} selected={selectedTimeline === id}>{subject}</option>)
    })
  }

  const openEditor = () => {
    handleControls({editor: {isEditor: true}})
  }

  //
  // Props

  const timelineOptionsProps = {
    renderOptions,
    handleOptions,
    selectedTimeline,
    handleDelete
  }

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

  const subMenuProps = {
    expandCollapsePageToggle: bookControls.showOptions,
    handleControls,
    isLightDark: bookControls.darkMode,
    isExpand: bookControls.isExpand
  }

  const notStartedProps = {
    loadBookMatter,
    bookControls
  }

  const startedProps = {
    bookControls
  }

  const editProps = {
    isEditor: controls.editor.isEditor,
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
  useEffect(() => {
    const userRef = ref(fbdb, `userSubject/${userId}/subjects/`);
    const q = query(userRef);
    onValue(q, (snapshot) => {
      if(snapshot.val()) {
        const result = snapshot.val();
        const subjectArray = [];
        for (let i in result) {
          const subjectObject = {id: i};
          for (let j in result[i]) {
            subjectObject[j] = result[i][j];
          }
          subjectArray.push(subjectObject);
        }
        const newSubjectState = Object.assign({...currentSubjectState}, {subjects: subjectArray});
        dispatch(updateSubjectState(newSubjectState)); 
      }
    })
  }, [])

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

  // timeline
  useEffect(() => {
    if (selectedTimeline) {
      getTimeline();
    }
  }, [selectedTimeline])

  // subjects
  useEffect(() => {
    if (!activeId && (subjects && subjects.length > 0)) {
      getSubject();
    }
  }, [subjects])

	return (
    <Page>
      <Header extraButtons={
        <BooksDropdown/>
      } />
      <Drawer />
      {/*
      <Wrapper>
        <Highlights currentTimeline={currentTimeline}/>
      </Wrapper>
      */}
      <div className="flex h-full">
        <Sidebar {...sidebarProps}/>
        <Book className={`${bookControls.darkMode !== undefined ? bookControls.darkMode ? 'dark' : 'light' : ''} w-[calc(100%-55px)] ${bookControls.isExpand ? 'md:w-[calc(100%-85px)]' : 'md:w-[600px] lg:w-[700px]'} h-full sm:h-[calc(100%-20px)] sm:mt-[10px] sm:mr-[10px] border border-secondary/10 shadow bg-page/section`}>
          <Book.Menu {...menuProps}/>
          <Book.Content>
            {book.state === bookStates.PRELOAD && (<Skeleton/>)}
            {book.state === bookStates.NOT_STARTED && <Book.NotStarted {...notStartedProps}/>}
            {book.state === bookStates.STARTED && <Book.Started {...startedProps}/>}
            {book.state === bookStates.EDIT && <Book.Edit {...editProps}/>}
            {book.state === bookStates.PREVIEW && <Book.Preview {...previewProps}/>}
          </Book.Content>
          {
            (
              book.state === bookStates.EDIT &&
              book.selected !== 'Contents' &&
              controls.editor.isEditor
            ) && 
            <Book.Footer/>
          }
        </Book>
        {!bookControls.isExpand ? (<div className="flex-1 grow overflow-hidden">
          <Options {...timelineOptionsProps}/>
        </div>) : (<></>)}
      </div>
    </Page>
  );
};

export default CreateBook;