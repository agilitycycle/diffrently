import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import {TagsInput} from 'react-tag-input-component';
import moment from 'moment';
import {fbPush} from '../services/firebaseService';
import {subjectState} from '../app/slices/subjectSlice';
import {IoMdPricetag} from 'react-icons/io';

const initialState = {
  body: '',
  saving: false,
  published: false
};

const Post = () => {
  const [postDetails, setPostDetails] = useState(initialState);
  const [imageUrl, setImageUrl] = useState(undefined);
  const [isTag, setIsTag] = useState(false);
  const [titleFormValue, setTitleFormValue] = useState('');
  const currentSubjectState = useSelector(subjectState);
  const {currentSubject} = currentSubjectState;

  const handleChange = (e) => {
    const { value } = e.target;
    const newPostDetails = Object.assign({...postDetails}, {
      body: value
    });
    setPostDetails(newPostDetails);
  }

  const handlePost = () => {
    /**
     * 
     * Requires title
     * Requires body
     * 
     */
    const { body } = postDetails;
    const postItem = {
      dateCreated: moment().valueOf(),
      title: titleFormValue,
      image: imageUrl || null,
      body
    }

    fbPush(`/userTimelineV2/${currentSubject}/post/`, postItem);
  }

  const handlePostAnother = () => {
    setTitleFormValue('');
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

  return (
    <div className="mb-7 mx-auto bg-transparent border border-gray-200 rounded-lg shadow dark:bg-transparent dark:border-gray-700">
      <div className="pt-4 pl-4 pr-4 pb-7">
        <div className="flex items-center h-full">
          <div className="h-full w-full">
            {!isTag && (
              <div>
                <div>
                  <input value={titleFormValue} onChange={handleTitle} className="block pb-2.5 pr-2.5 mb-5 w-full text-base text-white bg-transparent !outline-none" placeholder="Title"/>
                </div>
                <input type="text" value={imageUrl} onChange={handleImage} className="w-full h-[40px] bg-transparent text-white text-base block inline py-2.5 mb-5 !outline-none" placeholder="Image URL" />
                <div className="relative">
                  <TextareaAutosize onChange={handleChange} value={postDetails.body} minRows={3} maxRows={15} className="resize-none block py-2.5 pr-2.5 mb-20 w-full h-fit text-base text-white bg-transparent !outline-none" placeholder="Write something..."/>
                </div>
                <div className="flex">
                  <button onClick={handlePost} className="block-inline rounded-full mt-4 mr-3 text-xl uppercase px-7 py-1.5 bg-[#f87341] text-[#ffffff]">
                    {postDetails.saving ? <span>saving...</span> : <span>publish</span>}
                  </button>
                  <button onClick={() => setIsTag(true)} className="block-inline rounded-full mt-4 text-xl uppercase w-[40px] py-1.5 bg-blue-600 text-[#ffffff]">
                    <IoMdPricetag className="w-10"/>
                  </button>
                </div>
                {postDetails.published && (
                  <p className="sm:mt-0 text-gray-500 dark:text-gray-400">
                    <button onClick={handlePostAnother} className="cursor-pointer mb-16 inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline">
                      Post another?
                    </button>
                  </p>
                )}
              </div>
            )}
            {isTag && (
              <div className="text-white/60">
                <div className="mb-3">
                  <div className="mb-10">
                    <span className="font-bold">Subject:</span> Subject
                  </div>
                  <div className="mb-10">
                    <span className="font-bold">Classified as:</span> Book
                  </div>
                  <div className="mb-10">
                    <span className="font-bold">Category:</span> Actor, Movie
                  </div>
                  <div className="mb-10 w-8/12">
                    <TagsInput
                      value=""
                      onChange={() => {}}
                      placeHolder="chapter-1"
                    />
                  </div>
                  <div className="mb-10 w-8/12">
                    <TagsInput
                      value=""
                      onChange={() => {}}
                      placeHolder="add tags"
                    />
                  </div>
                </div>
                <button onClick={() => setIsTag(false)} type="button" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Update
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post;