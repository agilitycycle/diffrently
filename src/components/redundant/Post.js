import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Buffer from 'buffer';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { generateImage } from '../../utility';
import { ref as sRef, uploadBytes } from 'firebase/storage';
import { fbSet, fbPush } from '../../services/firebaseService';
import { fbStorage } from '../../app/firebase';
import moment from 'moment';
import {
  Page,
  Drawer,
  Header,
  Fullscreen
} from '../../components';
import { updateAppState, appState } from '../../app/slices/appSlice';

const initialState = {
  body: '',
  error: false,
  errorResponse: '',
  tags: [
    {
      tag: 'Person'
    },
    {
      tag: 'Place'
    },
    {
      tag: 'Thing'
    }
  ],
  selected: [],
  autoTagging: [],
  generating: false,
  generatingImage: false,
  saving: false,
  published: false
};

const characters = 0;

const Post = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const { credit, userId } = currentAppState;
  const [characterCount, setCharacterCount] = useState(characters);
  const [postDetails, setPostDetails] = useState(initialState);
  const [fullScreen, setFullScreen] = useState(false);
  const [tagFormValue, setTagFormValue] = useState('');
  const [titleFormValue, setTitleFormValue] = useState('');
  const [primaryImageTagFormValue, setPrimaryImageTagFormValue] = useState('');
  const [imageTagFormValue, setImageTagFormValue] = useState('');
  const [generatedImage, setGeneratedImage] = useState(undefined);
  const [imageUrl, setImageUrl] = useState(undefined);

  const capitalizeFirstLetter = (tagName) => {
    return `${tagName.charAt(0).toUpperCase()}${tagName.slice(1)}`;
  }

  const generateTags = () => {
    const { body, tags } = postDetails;
    if (body.length < 3) return;
    if (body.length > 35) {
      setPostDetails(Object.assign({...postDetails}, {
        published: false,
        saving: false,
        autoTagging: [],
        generating: true
      }));

      // check whether user has any tags...
      axios.post('https://d9mi4czmx5.execute-api.ap-southeast-2.amazonaws.com/prod/{read+}', JSON.stringify({
          option: 'zero-shot-classifier',
          data: {
            tags: tags.map(item => `\n- ${item.tag}`).join(',').replace(',', ''),
            text: body
          }
        })).then(resp => {
          const { data } = resp;
          const { response } = data;
          const { content } = response;
          console.log(resp);

          const newContent = JSON.parse(content);

          if(newContent.hasOwnProperty('categories')) {
            const tagArray = [...newContent.categories.map(item => hydrateTag(item))];

            setPostDetails(Object.assign({...postDetails}, {
              autoTagging: tagArray,
              error: false,
              generating: false
            }));
          }

          if(newContent.hasOwnProperty('error')) {
            setPostDetails(Object.assign({...postDetails}, {
              error: true,
              errorResponse: newContent.error.message,
              generating: false
            }));
          }

      }).catch(error => {
        console.log(error);
      });
    }
  }

  const hydrateTag = (tag) => {
    // remove space, special characters
    const hydrated = tag.replace(/\w+/g, (a) =>
    `${a.charAt(0).toUpperCase()}${a.substr(1)}`).replace(/\s/g, '').replace(/[^\w\s]/gi, '');
    return [hydrated].filter(a => a.toLowerCase() && a.length < 25);
  }

  const handleChange = (e) => {
    const { value } = e.target;
    setCharacterCount(value.length);
    const newPostDetails = Object.assign({...postDetails}, {
      body: value,
      autoTagging: []
    });
    setPostDetails(newPostDetails);
  }

  const handlePostAnother = () => {
    setTagFormValue('');
    setTitleFormValue('');
    setGeneratedImage(undefined);
    setPostDetails(initialState);
  }

  const handleTitle = (e) => {
    const { value } = e.target;
    setTitleFormValue(value);
  }

  const handleImage = (e) => {
    const { value } = e.target;
    setImageUrl(value);
  }

  const handlePost = async () => {
    const { body } = postDetails;
    if (body.length < 3) return;
    if (body.length > 35 && body.length < 851) {
      // remove credit
      // const tagsCredit = credit - postDetails.autoTagging.length;
      // fbSet(`/users/${userId}/credit`, tagsCredit);
      // const newAppState = Object.assign({...currentAppState}, {
      //   credit: tagsCredit
      // });
      // dispatch(updateAppState(newAppState));

      setPostDetails(Object.assign({...postDetails}, { saving: true }));

      const newPostDetails = Object.assign({...postDetails}, {
        published: true,
        error: false,
        saving: true
      });

      const postItem = {
        dateCreated: moment().valueOf(),
        predefinedTags: JSON.stringify(postDetails.selected), // selected tags
        title: titleFormValue,
        image: imageUrl || null,
        body
      }

      // if (generatedImage) {
      //   const image = `images/${userId}/image${Date.now()}.jpg`;
      //   const storageRef = sRef(fbStorage, image);
      //   const buffer = new Buffer.Buffer(generatedImage, 'base64');
      //   const blob = new Blob([buffer], { type: 'image/jpeg' });
      //   postItem.image = image;
      //   await uploadBytes(storageRef, blob);
      // }

      for (const key of postDetails.autoTagging) {
        postItem[`tag${key}`] = true;
      }

      fbPush(`/userTimeline/${userId}/post/`, postItem);

      // success
      setPostDetails(newPostDetails);
    }
  }
  
  const handleNewImageTag = (e) => {
    const { value } = e.target;
    setImageTagFormValue(value);
  }
  
  const handleAddImageTag = async () => {
    // testing for space
    let newImageTagFormValue = /\s/.test(imageTagFormValue) ?
    imageTagFormValue.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()).replace(/\s/g, '') :
    imageTagFormValue;

    // remove any special characters
    newImageTagFormValue = newImageTagFormValue.replace(/[^\w\s]/gi, '');
    
    // capitalize first letter
    newImageTagFormValue = capitalizeFirstLetter(newImageTagFormValue);

    setPrimaryImageTagFormValue(newImageTagFormValue);

    // new tag
    if (newImageTagFormValue.length > 1) {
      const newTags = [...postDetails.tags];
      const newSelected = [...postDetails.selected];

      if (!postDetails.tags.some(obj => obj.tag === newImageTagFormValue)) {
        newTags.push({
          tag: newImageTagFormValue
        });

        newSelected.push({
          tag: newImageTagFormValue
        });
      }
      
      const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);

      const newPostDetails = Object.assign({...postDetails}, {
        tags: unique(newTags),
        selected: unique(newSelected),
        generatingImage: true
      });

      setPostDetails(newPostDetails);

      setImageTagFormValue('');

      const resp = await generateImage(newImageTagFormValue);

      setGeneratedImage(resp.data.response.data[0].b64_json);
    }
  }

  const handleNewTag = (e) => {
    const { value } = e.target;
    setTagFormValue(value);
  }

  const handleAddTag = async () => {
    // testing for space
    let newTagFormValue = /\s/.test(tagFormValue) ?
      tagFormValue.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()).replace(/\s/g, '') :
      tagFormValue;

    // remove any special characters
    newTagFormValue = newTagFormValue.replace(/[^\w\s]/gi, '');
      
    // capitalize first letter
    newTagFormValue = capitalizeFirstLetter(newTagFormValue);

    // no duplicates
    if (postDetails.tags.some(obj => obj.tag === newTagFormValue)) return;

    // new tag
    if (tagFormValue.length > 1) {
      const newTags = [...postDetails.tags];
      newTags.push({
        tag: newTagFormValue
      });

      // selected
      const newSelected = [...postDetails.selected];
      newSelected.push({
        tag: newTagFormValue
      });
      const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);

      const newPostDetails = Object.assign({...postDetails}, {
        tags: newTags,
        selected: unique(newSelected)
      });

      setPostDetails(newPostDetails);

      setTagFormValue('');
    }
  }

  const toggleFullscreen = () => {
    setFullScreen(!fullScreen);
  }

  const removeAutoTag = (tagName) => {
    let newAutoTagging = [...postDetails.autoTagging];
    newAutoTagging = newAutoTagging.filter(e => e !== tagName);
    const newPostDetails = Object.assign({...postDetails}, {
      autoTagging: newAutoTagging
    });

    // Remove from selected
    if ((postDetails.selected && postDetails.selected.some(obj => obj.tag === tagName))) {
      let newSelected = [...postDetails.selected];
      newSelected = newSelected.filter(x => x.tag != tagName);
      newPostDetails.selected = newSelected;
    }

    setPostDetails(newPostDetails);
  }

  const addSelected = (tagName) => {
    const newSelected = [...postDetails.selected];
    newSelected.push({
      tag: tagName
    });
    const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);
    const newPostDetails = Object.assign({...postDetails}, {
      selected: unique(newSelected)
    });
    setPostDetails(newPostDetails);
  }

  const removeSelected = (tagName) => {
    let newSelected = [...postDetails.selected];
    newSelected = newSelected.filter(x => x.tag != tagName);
    const newPostDetails = Object.assign({...postDetails}, {
      selected: newSelected
    });
    setPostDetails(newPostDetails);
  }

  const renderClickableTags = () => {
    return postDetails.tags.map((item, index) => {
      if ((postDetails.selected && postDetails.selected.some(obj => obj.tag === item.tag))) {
        return (<span key={`tag${index}`} onClick={() => removeSelected(item.tag)} className="inline-block border border-blue-500 text-blue-500 bg-transparent cursor-pointer text-sm font-medium me-2 mb-2 px-2.5 py-0.5 rounded">- {item.tag}</span>)
      }
      return (<span key={`tag${index}`} onClick={() => addSelected(item.tag)} className="inline-block border border-neutral-400 text-neutral-400 bg-transparent cursor-pointer text-sm font-medium me-2 mb-2 px-2.5 py-0.5 rounded">+ {item.tag}</span>)
    })
  }

  const renderGeneratedTags = () => {
    return postDetails.autoTagging.map((item, index) => {
      const highlight = (postDetails.selected.some(obj => obj.tag === item)) ? 'border-violet-400 text-violet-400' : 'border-emerald-300 text-emerald-300';
      return (<span key={`tag${index}`} className={`${highlight} cursor-pointer inline-block border bg-transparent text-sm font-medium me-2 mb-2 pr-2.5 py-0.5 rounded`}>
        <a href={null} onClick={() => removeAutoTag(item)} className="pl-2.5 pr-2">x</a> {item}
      </span>)
    }) 
  }

  useEffect(() => {
    if (generatedImage) {
      setPostDetails(Object.assign({...postDetails}, {
        generatingImage: false
      }));
    }
  }, [generatedImage])

  // https://www.tailwindtoolbox.com/components/fullscreen-modal

	return (<>
		<Page>
			<Drawer />
      <Header />
      <Fullscreen
        fullScreen={fullScreen}
        setFullScreen={setFullScreen}
        handleChange={handleChange}
        body={postDetails.body}
        characterCount={characterCount}
      />
		  <div className="flex items-center justify-center h-full">
		    <div className="w-[500px] h-full">
          <div className="w-10/12 text-center">
            <p className="sm:mt-0 mb-5 text-gray-500 theme-dark:text-gray-400 text-right">
              <button onClick={() => {}} className="cursor-pointer inline-flex items-center text-blue-600 theme-dark:text-blue-500 hover:underline ml-5">
                Preview
              </button>
            </p>
            <div>
              <input value={titleFormValue} onChange={handleTitle} maxlength="25" className="block py-2.5 pr-2.5 mb-5 w-full text-lg text-lg text-white bg-transparent !outline-none" placeholder="Title (25)"/>
            </div>
            <input type="text" value={imageUrl} onChange={handleImage} className="w-full h-[40px] bg-transparent text-white text-lg block inline py-2.5 mb-5 !outline-none" placeholder="Image URL" />
            <div className="relative">
              <TextareaAutosize onChange={handleChange} value={postDetails.body} minRows={3} maxRows={15} className="resize-none block py-2.5 pr-2.5 mb-20 w-full h-fit text-lg text-lg text-white bg-transparent !outline-none" placeholder="Write something..."/>
              <button onClick={() => toggleFullscreen()} className="border border-gray-400/35 absolute top-3.5 right-1 rounded cursor-pointer">
                <div className="p-[2px]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-3.5 h-3.5 fill-gray-400/45">
                    <path d="M200 32L56 32C42.7 32 32 42.7 32 56l0 144c0 9.7 5.8 18.5 14.8 22.2s19.3 1.7 26.2-5.2l40-40 79 79-79 79L73 295c-6.9-6.9-17.2-8.9-26.2-5.2S32 302.3 32 312l0 144c0 13.3 10.7 24 24 24l144 0c9.7 0 18.5-5.8 22.2-14.8s1.7-19.3-5.2-26.2l-40-40 79-79 79 79-40 40c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8l144 0c13.3 0 24-10.7 24-24l0-144c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2l-40 40-79-79 79-79 40 40c6.9 6.9 17.2 8.9 26.2 5.2s14.8-12.5 14.8-22.2l0-144c0-13.3-10.7-24-24-24L312 32c-9.7 0-18.5 5.8-22.2 14.8s-1.7 19.3 5.2 26.2l40 40-79 79-79-79 40-40c6.9-6.9 8.9-17.2 5.2-26.2S209.7 32 200 32z"/>
                  </svg>
                </div>
              </button>
            </div>
            {postDetails.autoTagging.length > 0 && (
              <div className="pb-8 mt-4">
                <div className="mt-8">
                  {renderGeneratedTags()}
                </div>
              </div>
            )}
            <div className="sm:mt-0 mb-6 text-gray-500 theme-dark:text-gray-400">
              (<span className={characterCount > 850 ? 'text-red-700' : ''}>{characterCount}</span>/850)
            </div>
            <div className="p-6 mb-8 mt-4 mx-auto block text-gray-500 rounded border border-gray-700">
              <div className="space-y-1">
                <div className="h-[32px]">
                  <div className="flex justify-between">
                    <input value={imageTagFormValue} onChange={handleNewImageTag} maxlength="25" className="pe-4 mb-5 mr-2 w-8/12 h-[32px] text-base text-white bg-[#000423] bg-opacity-70 rounded !outline-none" placeholder={primaryImageTagFormValue || `A representation image of...`}/>
                    <button type="button" onClick={handleAddImageTag} className={`h-[32px] opacity-${!generatedImage ? '100' : '50'} text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 pt-.5 theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700 focus:outline-none theme-dark:focus:ring-blue-800`}>
                      Generate
                    </button>
                  </div>
                </div>
                {generatedImage && (
                  <>
                    <div className="py-5">
                      <div className="rounded-lg w-[100px] h-[100px] bg-contain bg-center" style={{
                        backgroundImage: `url('${generatedImage && 'data:image/jpeg;base64,' + generatedImage ||
                          'https://picsum.photos/id/18/300/200'
                        }')`
                      }}>
                        &nbsp;
                      </div>
                    </div>
                    <button type="button" onClick={() => {}} className="cursor-pointer inline-flex items-center font-medium text-blue-600 theme-dark:text-blue-500 hover:underline">
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>
            {/*<div className="mx-auto bg-transparent border border-gray-200 rounded-lg shadow theme-dark:bg-transparent theme-dark:border-gray-700">
              <a href={null} className="relative w-full block">
                {postDetails.generatingImage && (
                  <svg aria-hidden="true" className="absolute top-[25px] right-[25px] w-8 h-8 text-gray-200 animate-spin theme-dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                  </svg>
                )}
                <div className="h-[32px] absolute top-0 bottom-0 left-0 right-0 m-auto">
                  <div className="flex justify-center">
                    <input value={imageTagFormValue} onChange={handleNewImageTag} maxlength="25" className="px-4 mb-5 mr-2 w-7/12 h-[32px] text-base text-white bg-[#000423] bg-opacity-70 rounded !outline-none" placeholder={primaryImageTagFormValue || `A representation image of...`}/>
                    <button type="button" onClick={handleAddImageTag} className="h-[32px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 pt-.5 theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700 focus:outline-none theme-dark:focus:ring-blue-800">
                      Generate
                    </button>
                  </div>
                </div>
                <div className="rounded-t-lg h-[245px] bg-cover bg-center" style={{
                  backgroundImage: `url('${generatedImage && 'data:image/jpeg;base64,' + generatedImage ||
                    'https://picsum.photos/id/18/300/200'
                  }')`
                }}>
                  &nbsp;
                </div>
              </a>
              <div className="p-5">
                <a href={null}>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 theme-dark:text-white">
                    {titleFormValue || 'Title'}
                  </h5>
                </a>
                <p className="mb-8 font-normal text-gray-700 theme-dark:text-gray-400" style={{wordBreak: 'break-word'}}>
                  {postDetails.body.length > 0 ? postDetails.body : 'Write something...'}
                </p>
                // Render generated tags
                {postDetails.autoTagging.length > 0 && (
                  <div className="pb-8 mt-4">
                    <div className="mt-8">
                      {renderGeneratedTags()}
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <svg className="opacity-25 w-[20px] h-[20px] text-gray-800 theme-dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M13.135 6H15V3h-1.865a4.147 4.147 0 0 0-4.142 4.142V9H7v3h2v9.938h3V12h2.021l.592-3H12V6.591A.6.6 0 0 1 12.592 6h.543Z" clip-rule="evenodd"/>
                  </svg>
                  <svg className="opacity-25 w-[22px] h-[22px] mr-2 text-gray-800 theme-dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd" d="M3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm5-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3H8Zm7.597 2.214a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2h-.01a1 1 0 0 1-1-1ZM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm-5 3a5 5 0 1 1 10 0 5 5 0 0 1-10 0Z" clip-rule="evenodd"/>
                  </svg>
                  <svg className="opacity-25 w-[22px] h-[22px] mr-2 text-gray-800 theme-dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clip-rule="evenodd"/>
                  </svg>
                  <svg className="opacity-25 w-[18px] h-[18px] mr-1.5 text-gray-800 theme-dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
                  </svg>
                  <svg className="opacity-25 w-[23px] h-[23px] text-gray-800 theme-dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
                    <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
                  </svg>
                </div>
              </div>
            </div>
            */}
            <div className="p-6 mb-10 mt-4 mx-auto block text-gray-500 rounded border border-gray-700">
              <div className="space-y-1">
                <ul className="w-full">
                  <li>
                    <div className="flex flex-row space-x-4 rtl:space-x-reverse">
                      <div className="grow mb-8">
                        <input type="text" value={tagFormValue} onChange={handleNewTag} className="w-full h-[40px] bg-transparent text-white text-lg block inline py-2.5 border-b border-b-sky-100 !outline-none" placeholder="Help your AI learn" />
                      </div>
                      <div className="flex-none">
                        <button type="button" onClick={handleAddTag} disabled={postDetails.tags.length > 25} className="h-[40px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700 focus:outline-none theme-dark:focus:ring-blue-800">Add tags</button>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              {renderClickableTags()}
              {(postDetails.autoTagging.length === 0) && (
                <button type="button" onClick={generateTags} disabled={postDetails.generating || postDetails.selected.length == 0} className={`opacity-${postDetails.generating || (postDetails.body.length < 36 || postDetails.body.length > 850 || characterCount < 0 || postDetails.selected.length == 0) ? '50' : '100'} block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-lg text-base mt-5 mx-auto px-5 py-2 theme-dark:bg-blue-600 theme-dark:hover:bg-blue-700 focus:outline-none theme-dark:focus:ring-blue-800 justify-center`}>
                  {postDetails.generating ? <span>Generating...</span> : <span>Generate</span>}
                </button>
              )}
            </div>
            <p className="sm:mt-0 mb-10 text-gray-500 theme-dark:text-gray-400 text-center">
              <button onClick={() => {}} className="cursor-pointer text-xs font-medium inline-flex border border-emerald-500 rounded-full px-4 py-1.5 text-emerald-500 theme-dark:text-emerald-500 hover:underline">
                900 Credit - Upgrade
              </button>
            </p>
            {/** Feed button **/}
            {postDetails.published && (
              <button onClick={() => navigate('/timeline')} className="block rounded-full mb-4 mx-auto text-xl uppercase w-48 h-14 bg-[#f87341] text-[#ffffff] justify-center">
                <svg className="w-5 h-5 mt-[-3px] me-2.5 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                timeline
              </button>
            )}
            {/** Publish **/}
            {(!postDetails.published) && (
              <button onClick={handlePost} disabled={postDetails.selected.length === 0} className={`opacity-${postDetails.selected.length > 0 ? '100' : '50'} block rounded-full mb-4 mx-auto text-xl uppercase w-48 h-14 bg-[#f87341] text-[#ffffff] justify-center`}>
                {postDetails.saving ? <span>saving...</span> : <span>publish</span>}
              </button>
            )}
            <div className="h-6">&nbsp;</div>
            {/** Generate again **/}
            {!postDetails.published && postDetails.autoTagging.length > 0 && (<>
              <div className="w-full mb-16 flex flex-col items-center justify-center font-normal text-blue-600 theme-dark:text-blue-500">
                <div className="text-base">
                  {/* {credit - postDetails.autoTagging.length >= 0 && (
                    <span className="text-neutral-400">Yes, you can publish. ({credit})</span>
                  )} */}
                  {/* {credit !== 0 && credit - postDetails.autoTagging.length < 0 && (
                    <span className="text-neutral-400">Please remove some tags, you only have - {credit} credits</span>
                  )}
                  {!credit && (
                    <span className="text-neutral-400">Sorry, you have no credit to publish. (0)</span>
                  )} */}
                </div>
                <div className="mb-8">
                  <span className="text-base font-sm">Unhappy?</span>&nbsp;<a href={null} onClick={generateTags} className="cursor-pointer underline">Generate again</a>.
                </div>
              </div>
            </>)}
            {/** Post another **/}
            {postDetails.published && (
              <p className="sm:mt-0 text-gray-500 theme-dark:text-gray-400">
                <button onClick={handlePostAnother} className="cursor-pointer mb-16 inline-flex items-center font-medium text-blue-600 theme-dark:text-blue-500 hover:underline">
                  Post another?
                </button>
              </p>
            )}
            {/** Render error **/}
            {!postDetails.published && postDetails.error && (
              <>
                <div className="p-4 mb-6 text-base text-red-800 rounded-lg bg-red-50 theme-dark:bg-gray-800 theme-dark:text-red-400" role="alert">
                  {(postDetails.error && postDetails.errorResponse === '') && (<span>Could not auto-tag. Try again.</span>)}
                  {(postDetails.error && postDetails.errorResponse !== '') && (<span><span className="font-bold">Suggestion:</span> {
                    postDetails.errorResponse
                  }</span>)}
                </div>
                <div className="w-full flex items-center justify-center font-medium text-blue-600 theme-dark:text-blue-500">
                  <a href={null} onClick={generateTags} className="cursor-pointer underline">Generate again</a>&nbsp;or add tags
                  <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </div>
                <div>&nbsp;</div>
              </>
            )}
		      </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default Post;