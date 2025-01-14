import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { appState } from '../../app/slices/appSlice';
import {
  fbRemove,
  fbOnValueOrderByKeyLimitToLast,
  fbOnValueOrderByChildLimitToLast,
  fbOnValueOrderByChildEndAtLimitToLast
} from '../../services/firebaseService';
import {
  Page,
  Drawer,
  Header,
  Compact,
  ModalShare
} from '../../components';

const initialLoaded = {
  tagCategoryLoaded: false,
  postLoaded: false
}

const Tag = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentAppState = useSelector(appState);
  const { photoUrl, userId } = currentAppState;
  const [open, setOpen] = useState(false);
  const [postItem, setPostItem] = useState(undefined);
  const [loaded, setLoaded] = useState(initialLoaded);
  const [postTagDetails, setPostTagDetails] = useState([]);
  const [tagCategories, setTagCategories] = useState(undefined);
  const [lastId, setLastId] = useState('');
  const [paginationEnd, setPaginationEnd] = useState(false);
  const { pathname } = location;
  const { tagCategoryLoaded, postLoaded } = loaded;
  const tagRoute = pathname.substring(pathname.lastIndexOf('/') + 1);

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

  const handleDynamicTags = (event) => {
    const { target } = event;
    const { value } = target;
    navigate(`/timeline/${value}`);
  }

  const getTags = (tagEl) => {
    return tagEl.map((tag, index) => {
      const highlightStyles = tagRoute === tag ? 'border border-emerald-600 text-emerald-600' : 'opacity-40 border border-[#A9AAC5] text-[#A9AAC5]';
      return <button key={`tag${index}`} className="mb-4" onClick={() => loadTag(tag)}>
        <span key={tag} className={`${highlightStyles} bg-transparent text-sm font-medium me-2 px-2.5 py-0.5 rounded`}>
          {tag}
        </span>
      </button>
    })
  }

  const getPost = async () => {
    const path = `/userTimeline/${userId}/post`;

    let result = (lastId === '') ? 
      await fbOnValueOrderByChildLimitToLast(path, `tag${tagRoute}`, true, 5) :
      await fbOnValueOrderByChildEndAtLimitToLast(path, `tag${tagRoute}`, lastId, 6);

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

  const getTagCategory = async () => {
    const path = `/userTagFrequency/${userId}`;

    const tagCategories = await fbOnValueOrderByKeyLimitToLast(path, 25);

    if (tagCategories) {
      setTagCategories(tagCategories);
    }

    const newLoaded = {...loaded};
    newLoaded.tagCategoryLoaded = true;
    setLoaded(newLoaded);
  }

  const renderTagCategories = () => {
    let tags = []
    for (let i in tagCategories) {
      tags.push(i.replace('tag',''));
    }

    return <div className="mb-9">
      {tags.map((tag, index) => {
        return <button key={`tag${index}`} className="mb-4" onClick={() => handleDynamicTags(tag)}>
          <span className="opacity-40 border border-[#A9AAC5] text-[#A9AAC5] bg-transparent text-sm font-medium me-2 px-2.5 py-0.5 rounded">
            {tag}
          </span>
        </button>
      })}
    </div>
  }

  const renderPost = () => {
    if (postTagDetails.length < 1) return;
    return postTagDetails.map(item => {
      const props = {
        item,
        photoUrl,
        loadTag,
        handleDeletePost,
        setPostItem,
        setOpen,
        getTags
      }
      return (<Compact {...props} />)
    })
  }

  useEffect(() => {
    if (!tagCategoryLoaded) {
      getTagCategory();
    }
    // eslint-disable-next-line
  }, [tagCategoryLoaded])

  useEffect(() => {
    if (!postLoaded) {
      getPost();
    }
    // eslint-disable-next-line
  }, [loaded, postLoaded])

	return (<>
    <ModalShare open={open} setOpen={setOpen} postItem={postItem} />
		<Page>
			<Drawer />
      <Header />
		  <div className="flex items-center justify-center h-full">
		    <div className="h-full w-full max-w-[500px] sm:w-8/12">
          <div className="min-w-80 pb-7">
            <nav className="flex mb-8" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a href={null} onClick={() => navigate('/timeline')} className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    <svg className="w-5 h-5 me-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                    Timeline
                  </a>
                </li>
              </ol>
            </nav>
            <button onClick={() => navigate('/post')} className="block rounded-full mb-10 text-xl uppercase w-48 h-14 border border-white bg-transparent text-[#fff]">
              Post
            </button>
            {tagCategories && (renderTagCategories())}
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
                    <span className="flex items-center text-white">Tag Name</span>
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
                    <span className="flex items-center text-white">{tagRoute}</span>
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
            {(!paginationEnd && postTagDetails.length > 4) && (
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

export default Tag;