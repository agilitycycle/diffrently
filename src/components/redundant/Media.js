import React, {useEffect, useState} from 'react';
import { useSelector } from 'react-redux';
import { ref as sRef, getStorage, listAll } from 'firebase/storage';
import {
  Page,
  Drawer,
  Header
} from '../../components';
import { appState } from '../../app/slices/appSlice';

// https://gist.github.com/jamestalmage/2d8d1d5c42157caf349e
// https://firebase.google.com/docs/storage/web/list-files
// https://codesandbox.io/p/sandbox/google-drive-file-ingestion-6g1u8?file=%2Fsrc%2FApp.js%3A16%2C78

const Media = () => {
  const currentAppState = useSelector(appState);
  const { userId } = currentAppState;
  const [toggle, setToggle] = useState(false);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const getMediaFiles = async () => {
    const storage = getStorage();

    const listRef = sRef(storage, `images/${userId}`);

    const result = await listAll(listRef);

    setItems(result.items);
  }

  const renderList = () => {
    return items.map((item, index) => {
      if (index > 4) return;
      return (
        <li className="py-3 sm:py-4">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img className="w-8 h-8 rounded" src={`https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/${encodeURIComponent(item._location.path)}?alt=media`}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                Related to
              </p>
              <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                Christianity
              </p>
            </div>
            <div className="inline-flex items-center text-sm font-normal text-rose-400 dark:text-rose-400">
              Delete
            </div>
          </div>
        </li>
      )
    })
  }

  const renderGrid = () => {
    return items.map((item, index) => {
      if (index > 4) return;
      return (
        <div>
          <img class="h-auto max-w-full rounded-lg" src={`https://firebasestorage.googleapis.com/v0/b/flipbio-1712c.appspot.com/o/${encodeURIComponent(item._location.path)}?alt=media`}/>
        </div>
      )
    })
  }

  useEffect(() => {
    if (loaded) return;
    getMediaFiles();
    setLoaded(true);
  },[loaded])

	return (<>
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[500px] sm:w-8/12">
          <div className="min-w-80 pb-7 text-white font-sm">
            <div className="mx-auto max-w-screen-lg px-4 py-8 sm:px-8">
              <div className="flex items-center justify-between pb-6">
                <div>
                  <h2 className="font-semibold text-white">Media files</h2>
                  <span className="text-xs text-white">Manage your media files</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="ml-10 space-x-8 lg:ml-40">
                    <button className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring hover:bg-blue-700">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="h-4 w-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m0 0l6.75-6.75M12 19.5l-6.75-6.75" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              </div>
              <div className="max-w-2xl mx-auto">
                <div className="p-4 max-w-md bg-transparent rounded-lg border shadow-md sm:p-8 dark:bg-transparent dark:border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Recent</h3>
                    <a href={null} onClick={() => setToggle(!toggle)} className="cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
                      {!toggle ? 'Grid' : 'List'}
                    </a>
                  </div>
                  {!toggle && (<div className="flow-root">
                    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                      {renderList()}
                    </ul>
                  </div>)}
                  {toggle && (<div className="flow-root">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-3">
                      {renderGrid()}
                    </div>
                  </div>)}
                </div>
              </div>
            </div>
          </div>
		    </div>
		  </div>
	  </Page>
  </>);
};

export default Media;