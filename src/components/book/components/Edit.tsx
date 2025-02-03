import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ref as sRef, uploadBytesResumable} from 'firebase/storage';
import {fbStorage} from '../../../app/firebase';
import {ref, update} from 'firebase/database';
import {fbdb} from '../../../app/firebase';
import { InlineEdit } from 'rsuite';
import Resizer from 'react-image-file-resizer';
import {appState} from '../../../app/slices/appSlice';
import {updateSubjectState, subjectState} from '../../../app/slices/subjectSlice';
import {Editor} from '../../common/tiptap/Editor';
import {MdPhotoCamera} from 'react-icons/md';
import {getChapters} from '../utils/utils';
import '../../common/tiptap/styles.css';

const Section = ({
  handleNewSection,
  openEditor,
  item
}) => {
  const {
    id,
    content
  } = item;
  const dispatch = useDispatch();
  const currentSubjectState = useSelector(subjectState);

  const handleOpenEditor = () => {
    const newSubjectState = Object.assign({...currentSubjectState}, {section: id});
    dispatch(updateSubjectState(newSubjectState));
    openEditor();
  }

  return (<div className="tiptap mb-5">
    <div className="leading-loose text-secondary/60 theme-dark:text-secondary/40 mb-2">
      <div className="p-7" dangerouslySetInnerHTML={{__html: content}}></div>
    </div>
    <button onClick={handleOpenEditor} type="button" className="px-1.5 py-1 text-sm font-medium text-center inline-flex items-center text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
      Edit
    </button>
    <div className="w-full flex items-center justify-center">
      <div className="absolute left-0 right-0 m-auto">
        <div className="flex flex-row items-center justify-center">
          <button onClick={() => handleNewSection()} type="button" className="px-1.5 py-1 text-sm font-medium text-center inline-flex items-center text-white bg-blue-700 rounded hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            + section
          </button>
        </div>
      </div>
      <hr className="w-full h-[1px] my-8 bg-gray-200 border-0 theme-dark:bg-gray-700"></hr>
    </div>
  </div>);
}

const Edit = ({
  content,
  selected,
  isEditor,
  openEditor,
  newSection,
  handleNewSection
}) => {
  const currentAppState = useSelector(appState);
	const currentSubjectState = useSelector(subjectState);
  const [newChapterValue, setNewChapterValue] = useState(undefined);
  const [uploadPreview, setUploadPreview] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const {userId} = currentAppState;
  const {
    activeId,
    subjects
  } = currentSubjectState;
  const [chapters, setChapters] = useState('[]');
  const [coverUrl, setCoverUrl] = useState('');

  const getSubjectIndex = (id) => subjects.findIndex(x => x.id === id);

  const uploadImage = (e) => {
    const file = e.target.files[0];
    setUploadPreview(URL.createObjectURL(file));
    Resizer.imageFileResizer(
      file,
      1410,
      2250,
      'JPEG',
      100,
      0,
      (uri) => {
        const coverRef = `cover/${userId}/${activeId}/cover.png`;
        const storageRef = sRef(fbStorage, coverRef);
        const uploadTask = uploadBytesResumable(storageRef, uri);
        uploadTask.on('state_changed',
          (snapshot) => {
            setSaving(true);
            // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      
            switch (snapshot.state) {
              case 'paused':
                break;
              case 'running':
                break;
            }
      
          }, 
          (error) => {
            // Unsuccessful
          }, 
          () => {
            const coverUrl = `https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/${encodeURIComponent(coverRef)}?alt=media`;
            update(ref(fbdb, `userSubject/${userId}/subjects/${activeId}/`),{coverUrl});
            setSaving(false);
            console.log('done');
          }
        );
      },
      'blob'
    );
  }

  const handleOnChange = (value) => {
    setNewChapterValue(value);
  }

  const handleOnSave = (key) => {
    const newChapters = [...JSON.parse(chapters)];
    for (let i in newChapters) {
      if(Object.keys(newChapters[i])[0] === key) {
        newChapters[i].alias = newChapterValue;
      }
    }

    //console.log(currentSubjectState.subjects)
    const newSubject = [...currentSubjectState.subjects];
    const subjectIndex = getSubjectIndex(activeId);
    newSubject[subjectIndex] = {
      ...newSubject[subjectIndex],
      chapters: JSON.stringify(newChapters)
    }

    update(ref(fbdb, `userSubject/${userId}/subjects/${activeId}/`), {
      chapters: JSON.stringify(newChapters)
    });
  }

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
    const index = subjects.findIndex(x => x.id === activeId);
    setChapters(subjects[index].chapters);
    setCoverUrl(subjects[index].coverUrl);
  }, [subjects, activeId])

  if (!isEditor && selected && selected.indexOf('chapter-') > -1) {
    return (<div className="h-[calc(100vh-232px)] relative overflow-y-auto">
      {items.map((item) => {
        const sectionProps = {
          handleNewSection,
          openEditor,
          item
        }
        return (<Section {...sectionProps} />)
      })}
    </div>);
  }

  if (selected === 'Cover') {
    return (<div className="h-[calc(100vh-232px)] relative overflow-y-auto">
      {(!uploadPreview && !coverUrl) && (<div className="max-w-80 mx-auto mt-3.5 text-secondary/60 border border-secondary/40 rounded-lg">
        <div className="relative">
          <input
            id="FileUpload"
            accept="image/*"
            className="opacity-0 absolute z-40 w-full h-full cursor-pointer"
            onChange={uploadImage}
            type="file"
          />
          <div className="p-5 flex items-center justify-center">
            <MdPhotoCamera className="text-secondary/60 text-2xl mr-5" />
            <span>Choose a cover to upload</span>
          </div>
        </div>
      </div>)}
      {(uploadPreview || coverUrl) && (
        <div className="max-w-md h-full mx-auto flex items-start sm:items-center justify-center">
          <img src={uploadPreview || coverUrl} className="max-h-full border border-secondary/20" />
        </div>
      )}
    </div>)
  }

  if (selected === 'Contents') {
    return (<div className="h-[calc(100vh-174px)] relative overflow-y-auto">
      <div className="p-8">
        <h1 className="text-secondary text-3xl font-medium mb-12">Contents</h1>
        <ol className="list-decimal list-inside text-blue-600">
          {getChapters(chapters).map((item) => {
            const {key, label} = item;
            return (<li className="mb-5">
              <div className="inline-block">
                <InlineEdit defaultValue={label}
                  onChange={handleOnChange}
                  onSave={() => handleOnSave(key)}
                  className="w-fit flex flex-col items-end cursor-pointer text-base text-blue-600"/>
              </div>
            </li>)
          })}
        </ol>
      </div>
    </div>);
  }

  return (<>
    <Editor items={newSection ? undefined : items}/>
  </>);
}

export default Edit;