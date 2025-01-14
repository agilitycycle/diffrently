import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {fbPush} from '../../services/firebaseService';
import {generateImage} from '../../utility';
import {
  Page,
  Drawer,
  Header,
  SecondaryActionButton
} from '../../components';
import { appState } from '../../app/slices/appSlice';

const spinner = () => {
  return (<svg aria-hidden="true" className="absolute top-[25px] right-[25px] w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
  </svg>)
}

const CreateDropzone = () => {
  const currentAppState = useSelector(appState);
  const {userId} = currentAppState;
  const [dropzoneTitle, setDropzoneTitle] = useState(undefined);
  const [dropzoneImageUrl, setDropzoneImageUrl] = useState(undefined);
  const [dropzoneImageText, setDropzoneImageText] = useState(undefined);
  const [generatedImage, setGeneratedImage] = useState(undefined);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [published, setPublished] = useState(false);

  const handleDropzoneTitle = (e) => {
    const { value } = e.target;
    setDropzoneTitle(value);
    // setDropzoneImageText(value);
  }

  const handleDropzoneImageUrl = (e) => {
    const { value } = e.target;
    setDropzoneImageUrl(value);
    //setDropzoneImageText(value);
  }

  // const handleDropzoneImageText = (e) => {
  //   const { value } = e.target;
  //   setDropzoneImageText(value);
  // }

  // const handleGenerateDropzoneImage = async () => {
  //   if (dropzoneImageText.length < 3) return;
  //   setGeneratingImage(true);
  //   const resp = await generateImage(dropzoneImageText);
  //   setGeneratedImage(resp.data.response.data[0].b64_json);
  //   setGeneratingImage(false);
  // }

  const handleCreateDropzone = () => {
    const dropzone = {
      title: dropzoneTitle,
      image: dropzoneImageUrl
    }
    fbPush(`/userDropzones/${userId}/dropzones/`, dropzone);
    setPublished(true);
  }

  const isCreateDisabled = () => {
    if (dropzoneTitle && dropzoneTitle.length > 3) {
      return false;
    }
    return true;
  }

	return (<>
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[500px] sm:w-8/12">
          <div className="w-10/12 text-center">
            <div>
              <input value={dropzoneTitle} onChange={handleDropzoneTitle} maxlength="25" className="block py-2.5 pr-2.5 mb-1.5 w-full text-lg text-white bg-transparent !outline-none" placeholder="Title (25)"/>
              <input value={dropzoneImageUrl} onChange={handleDropzoneImageUrl} className="block py-2.5 pr-2.5 mb-5 w-full text-lg text-white bg-transparent !outline-none" placeholder="Image URL"/>
            </div>
            {/*
            <div className="relative w-fit flex items-center mb-9 bg-white dark:border dark:border-gray-700 dark:bg-transparent rounded-lg px-12 py-5 sm:px-20">
              <div className="relative">
                <img className="w-20 h-20 object-cover object-center rounded-full" src={generatedImage && 'data:image/jpeg;base64,' + generatedImage || 'https://picsum.photos/id/18/300/200'} />
                {generatingImage && spinner()}
              </div>
              <div className="flex justify-center">
                <SecondaryActionButton onClick={handleGenerateDropzoneImage} disabled={generatingImage} css="ml-5 disabled:opacity-50" label="Generate" />
              </div>
            </div>
            */}
            <button onClick={handleCreateDropzone} disabled={isCreateDisabled() || published} className="block rounded text-base uppercase w-24 h-9 bg-[#f87341] text-[#ffffff] justify-center disabled:opacity-50">
              Create
            </button>
          </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default CreateDropzone;