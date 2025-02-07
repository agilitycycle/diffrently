import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useLocation} from 'react-router-dom';
import {matchPath} from 'react-router';
import {bookStates} from '../../configs/constants';
import {appState} from '../../app/slices/appSlice';
import {updateSubjectState, subjectState} from '../../app/slices/subjectSlice';
import {fbdb} from '../../app/firebase';
import {ref, query, get} from 'firebase/database';
import {Book} from './Book.tsx';
import {Page, Drawer, Header} from '../index';
import Highlights from '../highlights/Highlights';
import PublicOptions from './components/public/PublicOptions.tsx';
import {Skeleton} from '../common/Skeleton';

type WrapperProps = {
  children: any
}

const Wrapper = ({children}: WrapperProps) => <div className="flex flex-col w-full">{children}</div>;

const CreateBook = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {darkMode} = currentAppState;
  const {
    subjects,
    currentTimeline
  } = currentSubjectState;
  const [selectedTimeline, setSelectedTimeline] = useState(undefined);

  const getSubjectIndex = (id) => subjects.findIndex(x => x.id === id);

  const [book, setBook] = useState({
    frontCover: true,
    state: 'PREVIEW',
    editMode: 'PREVIEW',
    contentLoaded: undefined,
    selected: 'Cover',
    newSection: false
  })

  const [controls, setControls] = useState({
    sidebar: {
      isOpen: true,
      toggleSidebar: false,
      isExpand: false,
      darkMode: true
    },
    editor: {
      isEditor: false
    }
  })
  const { sidebar } = controls

  const { pathname } = location;
  const match = matchPath({
    path: '/view/:username/:subject',
    exact: true
  }, pathname);

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
    const {sidebar, editor} = controls;
    const types = ['sidebar', 'editor'];
    let newObject;
    for (let i in types) {
      const typeString = types[i];
      if (newControl.hasOwnProperty(typeString)) {
        newObject = deepObjectUpdate(typeString === 'sidebar' ? sidebar : editor, typeString, newControl);
      }
    }
    setControls(Object.assign({}, {...controls}, {...newObject}));
  }

  const changeBookMatter = (e) => {
    const {target} = e;
    const {value} = target;
    if (value === 'Contents') {
      loadContents(value);
    }
    if(value === 'Cover' || value.indexOf('chapter-') > -1) {
      loadBookMatter(value);
    }
  }

  const loadContents = (value) => {
    setBook(Object.assign({...book}, {
      contentLoaded: null,
      state: 'PREVIEW',
      selected: value
    }));
    handleControls({editor: {isEditor: false}})
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
    const {subject} = params;
    for (let i in subjects) {
      if(subjects[i].subject === subject) {
        const {
          id,
          coverUrl,
          chapters,
        } = subjects[i];

        setSelectedTimeline(id);
        const newSubject = [...currentSubjectState.subjects];
        newSubject[getSubjectIndex(id)].id = id;
        newSubject[getSubjectIndex(id)].coverUrl = coverUrl;
        newSubject[getSubjectIndex(id)].chapters = chapters;
        newSubject[getSubjectIndex(id)].subject = subject;

        const newSubjectState = Object.assign({}, {...currentSubjectState}, {
          activeId: id
        }, {
          subjects: newSubject
        });
        dispatch(updateSubjectState(newSubjectState));
      }
    }
  }

  //
  // Props

  const menuProps  = {
    book,
    handleControls,
    changeBookMatter,
    expandCollapsePageToggle: sidebar.toggleSidebar
  }

  const subMenuProps = {
    expandCollapsePageToggle: sidebar.toggleSidebar,
    handleControls,
    isLightDark: sidebar.darkMode,
    isExpand: sidebar.isExpand
  }

  const previewProps = {
    currentSubjectState,
    selected: book.selected,
    content: book.contentLoaded
  }

  const sidebarProps = {
    sidebar,
    handleControls
  }

  useEffect(() => {
    handleControls({sidebar: {darkMode}});
  }, [darkMode])

  useEffect(() => {
    if (selectedTimeline) {
      getTimeline();
    }
  }, [selectedTimeline])

  useEffect(() => {
    if (subjects && subjects.length > 0) {
      getSubject();
    }
  }, [location, subjects])

	return (
    <Page>
      <Header />
      <Drawer />
      <Wrapper>
        <div className="h-[126px]">
          &nbsp;
        </div>
        <Highlights currentTimeline={currentTimeline}/>
        <PublicOptions/>
      </Wrapper>
      <Book>
        <Book.PublicMenu {...menuProps}>
          <Book.SubMenu {...subMenuProps}/>
        </Book.PublicMenu>
        <Book.Content>
          {book.state === bookStates.PRELOAD && (<Skeleton/>)}
          {book.state === bookStates.PREVIEW && <Book.Preview {...previewProps}/>}
        </Book.Content>
      </Book>
    </Page>
  );
};

export default CreateBook;