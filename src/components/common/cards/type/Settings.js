import React, {useEffect, useState} from 'react';
import { TagsInput } from 'react-tag-input-component';

const defaultImage = 'https://placehold.co/600x400';

const Settings = (props) => {
  const {
    title,
    imageUrl,
    blurb,
    subject,
    category,
    tags,
    handleChange,
    updateSettings
  } = props;
  const [selected, setSelected] = useState(tags);
  const [image, setImage] = useState(defaultImage);

  const isImageValid = (imageUrl) => {
    return new Promise(resolve => {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
    });
  }

  const getImage = async () => {
    const isImage = await isImageValid(imageUrl).then(res => res);
    if (isImage) {
      setImage(imageUrl);
    } else {
      setImage(defaultImage);
    }
  }

  useEffect(() => {
    getImage();
  }, [imageUrl])

  return (<div className="relative mb-7 mx-auto bg-transparent border border-gray-200 rounded-lg shadow dark:bg-transparent dark:border-gray-700">
    <div className="w-full sm:max-w-96 pt-3 pb-8 px-3">
      <div className="flex mb-6">
        <img src={image} className="rounded-2xl w-full" />
      </div>
      <div>
        <input value={title} name="title" onChange={handleChange} className="block py-1 pr-2.5 mb-2.5 w-full text-base text-white bg-transparent !outline-none" placeholder="Title"/>
        <input value={imageUrl} name="imageUrl" onChange={handleChange} className="block py-1 pr-2.5 mb-2.5 w-full text-base text-white bg-transparent !outline-none" placeholder="Image URL"/>
        <input value={blurb} name="blurb" onChange={handleChange} className="block py-1 pr-2.5 mb-2.5 w-full text-base text-white bg-transparent !outline-none" placeholder="Write a blurb"/>
        <div className="cursor-default block leading-loose py-1 pr-2.5 mb-3.5 w-full text-base text-white/60 bg-transparent !outline-none">
          #{subject} <span className="text-emerald-400 font-normal">ranks as</span> #{category}
        </div>
        <div style={{
          marginBottom: '35px'
        }}>
          <TagsInput
            value={selected}
            onChange={setSelected}
            beforeAddValidate={() => selected.length < 2 ? true : false}
            placeHolder="add two tags"
          />
        </div>
        <button onClick={() => updateSettings()} className="block rounded-full mt-4 mb-4 text-xl uppercase w-48 h-14 bg-[#f87341] text-[#ffffff]">
          Update
        </button>
      </div>
    </div>
  </div>);
}

export default Settings;