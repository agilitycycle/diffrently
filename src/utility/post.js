import {ref, query, get} from 'firebase/database';
import {fbdb} from '../app/firebase';
import {
  fbOnValueOrderByKeyLimitToLast,
  fbOnValueOrderByKeyEndAtLimitToLast,
  fbOnValueOrderByChildLimitToLast,
  fbOnValueOrderByChildEndAtLimitToLast
} from '../services/firebaseService';

const getTags = (post) => {
    return Object.keys(post).filter(a => a.indexOf('tag') > -1).map(b => b.replace('tag', ''));
  }

const dbCall = async (type, lastId, path, tag) => {
  let result;
  switch(true) {
    case type === 'ROOT':
      if (lastId === '') {
        result = await fbOnValueOrderByKeyLimitToLast(path, 5)
      } else {
        result = await fbOnValueOrderByKeyEndAtLimitToLast(path, lastId, 6);
      }
      return result;
    case type === 'TAG':
      result = (lastId === '') ? 
        await fbOnValueOrderByChildLimitToLast(path, `tag${tag}`, true, 5) :
        await fbOnValueOrderByChildEndAtLimitToLast(path, `tag${tag}`, lastId, 6);
      return result;
    default:
      break;
  }
}

const getPost = async (postList, lastId, type, path, tag, useStateHook = {
  setPostList: () => {},
  setPaginationEnd: () => {},
  setPostLoaded: () => {},
  setLastId: () => {},
}) => {
  const {
    setPostList,
    setPaginationEnd,
    setPostLoaded,
    setLastId
  } = useStateHook;
  let result = await dbCall(type, lastId, path, tag);
  const currentPostList = [...postList];
  const newPostList = [];
  for (let i in result) {
    newPostList.push(Object.assign({ id: i }, result[i]));
  }
  if (newPostList.length > 0) {
    const newId = newPostList.reverse()[newPostList.length - 1].id;
    const merged = currentPostList.concat(newPostList.filter(item2 =>
      !currentPostList.some(item1 => item1.id === item2.id)
    ));
    const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);
    setPostList(unique(merged));
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
  if (newPostList.length === 0) {
    setPaginationEnd(true);
  }
  setPostLoaded(true);
}

const getPostDetails = async (path, useStateHook = {
  setPostDetails: () => {},
  setPostLoaded: () => {},
}) => {
  const {
    setPostList,
    setPostLoaded
  } = useStateHook;
  const userRef = ref(fbdb, path);
  const q = query(userRef);
  const result = await get(q)
    .then((snapshot) => {
      if (snapshot.val() !== null) {
        return snapshot.val();
      }
    })
    .catch((error) => {
      console.log(error);
    });

  setPostList([result]);
  setPostLoaded(true);
}

const handleAction = (action, arg,
  useStateHook = {
    setOpenShareModal: () => {},
    setPostItem: () => {}
  }) => {
    const {
      setOpenShareModal,
      setPostItem,
    } = useStateHook || {};
    
    switch(action) {
      case 'SHARE_MODAL':
        if (arg.hasOwnProperty('title')) {
          setPostItem(arg);
        }
        setOpenShareModal(true);
        break;
      default:
        break;
    }
}

const hydrateContent = (postList,
  useStateHook = {
    setOpenShareModal: () => {},
    setPostItem: () => {}
  }) => {
  const {
    setOpenShareModal,
    setPostItem,
  } = useStateHook || {}; 
  let content = [];
  if (postList.length < 1) return;
  for (let i in postList) {
    const item = postList[i];
    const {
      id,
      title,
      body,
      dateCreated,
      photoUrl,
      displayName
    } = item;
    const menuOptions = {
      hideEdit: true,
      hideParachute: true,
      hideDelete: true
    };
    const props = {
      id,
      title,
      body,
      dateCreated,
      photoUrl,
      displayName,
      tags: getTags(item),
      handleAction: (action, arg) => {
        handleAction(action, arg, {
          setOpenShareModal,
          setPostItem
        })
      },
      menuOptions,
      size: 'Sm'
    }
    content.push(props);
  }
  return content;
}

export {
  getPost,
  hydrateContent,
  getPostDetails
}