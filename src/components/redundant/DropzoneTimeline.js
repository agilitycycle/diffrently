import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { appState } from '../../app/slices/appSlice';
import {
  fbRemove,
  fbOnValueOrderByKeyLimitToLast,
  fbOnValueOrderByKeyEndAtLimitToLast,
} from '../../services/firebaseService';
import {
  Page,
  Drawer,
  Header,
  Compact,
  ModalShare,
  ModalParachute
} from '../../components';

// https://www.google.com/search?sca_esv=439ed1f28d78315f&rlz=1C5CHFA_enNZ825NZ825&q=css+animated+popup+menu&udm=2&fbs=AEQNm0A633aOWMcGwo5EkodWqZWQxPIwflRJ4Hu3ORx2YNN2hMyLXvg7YutBzzEkH5jrqRZVNqsK5Bw5ddbAfF-taybgSSQV7ogjWSUk63vkbvL-w7wplyYljl--izGla_RJHQhdiGyVfedERY6-5VfW4M7BV3Ud5xzVSoH7Zzd0edbV8j9TFjV_MhEJQhb7WmcnaxJEZCsQrhOzFoPtN07fPg85l8T3FA&sa=X&ved=2ahUKEwjdvbeAvreJAxVEyDgGHataG74QtKgLegQIFxAB&biw=1415&bih=1044&dpr=1

const initialLoaded = {
  postLoaded: false
}

const DropzoneTimeline = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentAppState = useSelector(appState);
  const { photoUrl, displayName, userId } = currentAppState;
  const [openShareModal, setOpenShareModal] = useState(false);
  const [openParachuteModal, setOpenParachuteModal] = useState(false);
  const [postItem, setPostItem] = useState(undefined);
  const [loaded, setLoaded] = useState(initialLoaded);
  const [postTagDetails, setPostTagDetails] = useState([]);
  const [lastId, setLastId] = useState('');
  const [paginationEnd, setPaginationEnd] = useState(false);
  const { postLoaded } = loaded;
  const { pathname } = location;
  const dzId = JSON.parse(atob(pathname.substring(pathname.lastIndexOf('/') + 1)));
  const loadTag = (tag) => {
    const newLoaded = {...loaded};
    newLoaded.postLoaded = false;
    setLoaded(newLoaded);
    setPostTagDetails([]);
    setLastId('');
    navigate(`/timeline/${tag}`);
  }

  const handleDeletePost = (postId) => {
    fbRemove(`/userTimeline/${userId}/post/${postId}`);
    const newPostTagDetails = [...postTagDetails];
    const removeIndex = newPostTagDetails.findIndex(item => item.id === postId);
    newPostTagDetails.splice(removeIndex, 1);
    setPostTagDetails(newPostTagDetails);
  }

  const getPost = async () => {
    const path = `/userDropzoneTimeline/${dzId.id}/post`;

    let result = (lastId === '') ? 
      await fbOnValueOrderByKeyLimitToLast(path, 5) :
      await fbOnValueOrderByKeyEndAtLimitToLast(path, lastId, 6);

    const currentPostTagDetails = [...postTagDetails];
    
    const newPostTagDetails = [];
    for (let i in result) {
      newPostTagDetails.push(Object.assign({ id: i }, result[i]));
    }

    if (newPostTagDetails.length > 0) {
      const newId = newPostTagDetails.reverse()[newPostTagDetails.length - 1].id;

      const merged = currentPostTagDetails.concat(newPostTagDetails.filter(item2 =>
        !currentPostTagDetails.some(item1 => item1.id === item2.id)
      ));

      const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);

      setPostTagDetails(unique(merged));

      switch(true) {
        case newId !== lastId:
          setLastId(newId);
          break;
        case newId === lastId:
          setPaginationEnd(true);
          break;
        default:
          break;
      }
    }

    if (newPostTagDetails.length === 0) {
      setPaginationEnd(true);
    }

    const newLoaded = {...loaded};
    newLoaded.postLoaded = true;
    setLoaded(newLoaded);
  }

  const renderPost = () => {
    if (postTagDetails.length < 1) return;
    return postTagDetails.map(item => {
      const props = {
        item,
        photoUrl,
        displayName,
        loadTag,
        handleDeletePost,
        setPostItem,
        setOpenShareModal,
        setOpenParachuteModal
      }
      return (<Compact {...props} />)
    })
  }

  useEffect(() => {
    if (!postLoaded) {
      getPost();
    }
    // eslint-disable-next-line
  }, [postLoaded])

	return (<>
    <ModalShare open={openShareModal} setOpen={setOpenShareModal} postItem={postItem} />
    <ModalParachute open={openParachuteModal} setOpen={setOpenParachuteModal} postItem={postItem} />
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[500px] sm:w-8/12">
          <div className="min-w-80 pb-7">
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a href={null} className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    <svg className="w-5 h-5 me-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                    {dzId && dzId.title}
                  </a>
                </li>
              </ol>
            </nav>
            <button onClick={() => navigate('/post')} className="block rounded-full mb-10 text-xl uppercase w-48 h-14 border border-white bg-transparent text-[#fff]">
              Post
            </button>
            {postLoaded && renderPost()}
            {!postLoaded && (<div className="flex flex-row text-white mb-5">
              <div>
                <div className="flex items-center justify-center rounded-full w-12 h-12 bg-[#40435a]">
                  &nbsp;
                </div>
              </div>
              <div className="flex-1 text-left text-[#ffffff]">
                <div className="ml-5">
                  <p className="text-lg font-bold">
                    <span className="flex items-center text-white">Title</span>
                  </p>
                  <p className="text-base text-[#A9AAC5] leading-loose">
                    Post loading...
                  </p>
                  <p className="text-sm text-[#A9AAC5] opacity-60">1 day ago</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center rounded-md ml-auto w-12 h-12 border border-gray-700 bg-transparent">
                  &nbsp;
                </div>
              </div>
            </div>)}
            {(postLoaded && postTagDetails.length < 1) && (<div className="flex flex-row text-white mb-5">
              <div>
                <div className="flex items-center justify-center rounded-full w-12 h-12 bg-[#40435a]">
                  &nbsp;
                </div>
              </div>
              <div className="flex-1 text-left text-[#ffffff]">
                <div className="ml-5">
                  <p className="text-lg font-bold">
                    <span className="flex items-center text-white">Title</span>
                  </p>
                  <p className="text-base text-[#A9AAC5] leading-loose">
                    No post avail.
                  </p>
                  <p className="text-sm text-[#A9AAC5] opacity-60">
                    <a href={null} onClick={() => navigate('/post/')} className="cursor-pointer hover:underline">
                      Write your first post.
                    </a>
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-center rounded-md ml-auto w-12 h-12 border border-gray-700 bg-transparent">
                  &nbsp;
                </div>
              </div>
            </div>)}
            {(postLoaded && !paginationEnd) && (
              <div className="flex items-center justify-center mb-3">
                <button type="button" onClick={getPost} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Load More</button>
              </div>
            )}
          </div>
		    </div>
		  </div>
    </Page>
  </>);
};

export default DropzoneTimeline;