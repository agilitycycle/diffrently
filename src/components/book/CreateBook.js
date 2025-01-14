import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {matchPath} from 'react-router';
import {bookStates} from '../../configs/constants';
import {appState} from '../../app/slices/appSlice.js';
import {updateSubjectState, subjectState} from '../../app/slices/subjectSlice.js';
import {fbdb} from '../../app/firebase.js';
import {ref, query, get} from 'firebase/database';
import {fbRemove} from '../../services/firebaseService.js';
import {Book} from './Book.js';
import Sidebar from './components/Sidebar';
import AddChapter from './components/AddChapter';
import {Page, Drawer, Header} from '../index.js';
import Highlights from '../highlights/Highlights';
import Options from './components/Options';
import {Skeleton} from '../common/Skeleton';

// https://qdus.hashnode.dev/simplifying-react-component-composition-with-dot-notation
// https://purecode.ai/generations/b105581b-8e18-4545-83c2-a328b58b0e7e/0

const Wrapper = ({children}) => <div className="flex flex-col w-full">{children}</div>

const CreateBook = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const currentAppState = useSelector(appState);
  const currentSubjectState = useSelector(subjectState);
  const {userId, darkMode} = currentAppState;
  const {
    subject,
    subjects,
    subjectId, // rename
    // newSubject,
    subjectImageUrl, // rename
    currentSubject,
    currentTimeline
  } = currentSubjectState;
  // does this need to be added back to subjects reducer?
  // const [newSettings, setNewSettings] = useState({
  //   topic1: '', // could user add more than 3 topics?
  //   topic2: '',
  //   topic3: '',
  //   cardCount: 0
  // });
  // const {topic1, topic2, topic3, cardCount} = newSettings;
  // timeline
  const [selectedTimeline, setSelectedTimeline] = useState(undefined);

  const [book, setBook] = useState({
    frontCover: true,
    state: 'NOT_STARTED',
    editMode: 'EDIT',
    contentLoaded: undefined,
    selected: undefined,
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
      isOpen: false,
      isEditor: false
    }
  })
  const { sidebar } = controls

  const { pathname } = location;
  const match = matchPath({
    path: '/create/:username/:subject',
    exact: true
  }, pathname);

  // const handleSubmit = (e) => {
  //   axios.post('https://d9mi4czmx5.execute-api.ap-southeast-2.amazonaws.com/prod/{read+}', JSON.stringify({
  //     option: 'generate-articles',
  //     data: {
  //       cardCount,
  //       text: `${subject}, ${topic1}, ${topic2}, ${topic3}`
  //     }
  //   })).then(resp => {
  //     console.log(resp)
  //     const { data } = resp;
  //     const { response } = data;
  //     const { content } = response;
  //     console.log(content)
  
  //     const newContent = JSON.parse(content);
  //     const {articles} = newContent;

  //     fbUpdate(`/userSubject/${userId}/subjects/${subjectId}`, {
  //       topic1,
  //       topic2,
  //       topic3,
  //       cardCount
  //     });

  //     articles.map((article) => {
  //       const {title, body} = article;
  //       fbPush(`/userTimelineV2/${subjectId}/post/`, {
  //         title,
  //         body
  //       });
  //     })

  //     const newSubjectState = Object.assign({}, {...currentSubjectState}, {
  //       newSubject: false,
  //       topic1: topic1,
  //       topic2: topic2,
  //       topic3: topic3,
  //       cardCount: cardCount,
  //       currentTimeline: articles
  //     });
  //     dispatch(updateSubjectState(newSubjectState));
  
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }

  const handleOptions = (e) => {
    const {target} = e;
    const {value} = target;
    navigate(`/create/${value}`);
  }

  const handleDelete = () => {
    fbRemove(`userSubject/${userId}/subjects/${currentSubject}`);
    fbRemove(`userTimelineV2/${currentSubject}`);

    const newSubjects = subjects.filter(x => x.id !== currentSubject);
    const newSubjectState = Object.assign({...currentSubjectState}, {subjects: newSubjects});
    dispatch(updateSubjectState(newSubjectState));

    navigate('/subject')
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

  const toggleEdit = () => {
    setBook(Object.assign(
      {...book}, {
        state: 'EDIT',
        editMode: 'EDIT',
        newSection: false
      }
    ));
    handleControls({editor: {isEditor: false}});
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
          topic1,
          topic2,
          topic3,
          cardCount,
          coverUrl,
          imageUrl,
          chapters,
          id
        } = subjects[i];

        // setNewSettings({
        //   topic1,
        //   topic2,
        //   topic3,
        //   cardCount
        // })
        setSelectedTimeline(id);
        const newSubjectState = Object.assign({}, {...currentSubjectState}, {
          subjectImageUrl: imageUrl,
          coverUrl,
          subject, 
          chapters,
          currentSubject: id
        });
        dispatch(updateSubjectState(newSubjectState));
      }
    }
  }

  const renderOptions = () => {
    if (subjects.length < 1) return;
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

  const menuProps  = {
    book,
    setBook,
    toggleEdit,
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

  const notStartedProps = {
    loadBookMatter,
    sidebar
  }

  const startedProps = {
    sidebar
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
        <AddChapter/>
        <Highlights currentTimeline={currentTimeline}/>
        <Options {...timelineOptionsProps}/>
      </Wrapper>
      <Sidebar {...sidebarProps}>
        <Book>
          <Book.Menu {...menuProps}>
            <Book.SubMenu {...subMenuProps}/>
          </Book.Menu>
          <Book.Content>
            {book.state === bookStates.PRELOAD && (<Skeleton/>)}
            {book.state === bookStates.NOT_STARTED && <Book.NotStarted {...notStartedProps}/>}
            {book.state === bookStates.STARTED && <Book.Started {...startedProps}/>}
            {book.state === bookStates.EDIT && <Book.Edit {...editProps}/>}
            {book.state === bookStates.PREVIEW && <Book.Preview {...previewProps}/>}
          </Book.Content>
          {
            (book.state === bookStates.EDIT || book.state === bookStates.NEW) && 
            <Book.Footer/>
          }
        </Book>
      </Sidebar>
    </Page>
  );
};

export default CreateBook;