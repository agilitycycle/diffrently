import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ref as sRef, uploadBytesResumable } from 'firebase/storage';
import { fbStorage } from '../../app/firebase';
import { ref, update } from 'firebase/database';
import { fbdb } from '../../app/firebase';
import Resizer from 'react-image-file-resizer';
import { appState } from '../../app/slices/appSlice';
import {
  Page,
  Drawer,
  Header
} from '../../components';

const Profile = () => {
	const currentAppState = useSelector(appState);
  const {
    photoUrl,
    email,
    displayName,
    activeSubscriptions,
    userId
  } = currentAppState;
  const [uploadPreview, setUploadPreview] = useState(undefined);
  const [saving, setSaving] = useState(false);

  const renderProfileStyle = () => {
    let usePhoto = uploadPreview || photoUrl;
    return {
      backgroundImage: `url(${usePhoto})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat'
    };
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    setUploadPreview(URL.createObjectURL(file));
    Resizer.imageFileResizer(
      file,
      500,
      500,
      'JPEG',
      100,
      0,
      (uri) => {
        const photoRef = `profile/${userId}/profile.png`;
        const storageRef = sRef(fbStorage, photoRef);
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
              const photoUrl = `https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/${encodeURIComponent(photoRef)}?alt=media`;
              update(ref(fbdb, `users/${userId}`), { photoUrl });
              setSaving(false);
          }
        );
      },
      'blob'
    );
  }

	return (<>
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full sm:h-auto">
		      <h2 className="text-2xl text-secondary text-left leading-snug mb-8">
		      	1. Set up your profile
		      </h2>
          <div className="relative w-32 mb-8 ml-auto mr-auto">
            <div className="rounded-full w-32 h-32 bg-secondary/35 border border-secondary/35" style={renderProfileStyle()}>
              {saving && (
                <svg aria-hidden="true" className="absolute bottom-0 top-0 left-0 right-0 m-auto w-8 h-8 text-gray-200 animate-spin theme-dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              )}
            </div>
            <label htmlFor="FileUpload" className="bottom-0 right-0 absolute cursor-pointer text-lg text-white text-center w-8 h-8 bg-[#f87341] rounded-full">
              <div className="relative">
                <input
                  id="FileUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChange}
                  type="file"
                />
                <div className="flex items-center justify-center w-8 h-8">
                  <span>+</span>
                </div>
              </div>
            </label>
          </div>
		      <div className="text-center">
            <div className="mb-5">
              <input type="text" defaultValue={displayName} className="bg-transparent text-secondary text-lg block w-fit p-2.5 border-b border-secondary/35 !outline-none" placeholder="Full Name" disabled />
            </div>
            <div className="mb-10">
              <input type="text" defaultValue={email} className="bg-transparent text-secondary text-lg block w-fit p-2.5 border-b border-secondary/35 !outline-none" placeholder="Email Address" disabled />
            </div>
            <div className="mb-2.5">
              <Link to="/subscriptions" className="font-medium text-sm text-blue-600 theme-dark:text-blue-500 hover:underline pb-10 mb-20">
                Subscriptions
              </Link>
            </div>
            <div className="mb-10">
              <Link to="/subscriptions/active-subscriptions" className="font-medium text-sm text-blue-600 theme-dark:text-blue-500 hover:underline pb-10 mb-20">
                Active Subscriptions ({activeSubscriptions ? 1 : 0})
              </Link>
            </div>
          </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default Profile;