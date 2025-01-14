import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { appState } from '../../app/slices/appSlice';
import { fbdb } from '../../app/firebase';
import { ref, query, get } from 'firebase/database';
import { fbSet, fbUpdate } from '../../services/firebaseService';
import Modal from '../common/Modal';

/**
 * 
 * https://react-select.com/home
 * 
 */

const spinner = () => {
  return (<svg aria-hidden="true" className="w-4 h-4 mx-4 text-blue-500 animate-spin dark:text-blue-500 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
  </svg>)
}

const ModalParachute = ({open, setOpen, postItem}) => {
  const currentAppState = useSelector(appState);
  const { userId } = currentAppState;
  const [dropzones, setDropzones] = useState(undefined);
  const [selectedDropzones, setSelectedDropzones] = useState({});
  const [dropzonesLoaded, setDropzonesLoaded] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);

  const unique = arr => arr.filter((el, i, array) => array.indexOf(el) === i);

  const getDropzones = async () => {
    const path = `/userDropzones/${userId}/dropzones`;
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
    setDropzones(result);
    setDropzonesLoaded(true)
  }

  const onClose = () => {
    setSelectedDropzones({});
    setPublishing(false);
    setPublished(false);
    setOpen(false);
  }

  const handleCheckbox = (item) => {
    const { id } = item;
    const newSelectedDropzones = {...selectedDropzones};
    (newSelectedDropzones[id]) ? delete newSelectedDropzones[id] : newSelectedDropzones[id] = true;
    setSelectedDropzones(newSelectedDropzones);
  }

  const handleSubmit = () => {
    setPublishing(true);
    const { id, dropzoneAlias } = postItem;
    const newAlias = dropzoneAlias && JSON.parse(dropzoneAlias) || [];
    for (let i in selectedDropzones) {
      newAlias.push(i);
      const newPost = {...postItem};
      delete newPost.id;
      fbSet(`/userDropzoneTimeline/${i}/post/${id}`, newPost);
    }
    // update original post
    fbUpdate(`/userTimeline/${userId}/post/${id}`, {
      dropzoneAlias: JSON.stringify(unique(newAlias))
    });
    setPublishing(false);
    setPublished(true);
  }

  const renderDropzones = () => {
    const items = [];
    for (let i in dropzones) {
      items.push({id: i, ...dropzones[i]});
    }
    return items.map(item => {
      const { title, id } = item;
      return (<div className="relative flex w-56 items-center rounded bg-gray-50 py-1 px-4 pl-8 font-normal text-gray-700">
        <input onChange={() => handleCheckbox(item)} className="peer hidden" type="checkbox" name={title} id={title} checked={selectedDropzones[id]} />
        <label className="absolute left-0 top-0 h-full w-56 cursor-pointer rounded border peer-checked:border-blue-600 peer-checked:bg-blue-100" for={title}></label>
        <div className="absolute left-3 h-2 w-2 rounded-sm border border-gray-300 bg-gray-200 ring-blue-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-blue-600 peer-checked:ring-2"></div>
        <span className="pointer-events-none z-10">{title}</span>
      </div>);
    })
  }

  useEffect(() => {
    if (!dropzonesLoaded) {
      getDropzones();
    }
    // eslint-disable-next-line
  }, [dropzonesLoaded])

  return(<Modal open={open} onClose={onClose}>
    <div className="w-full">
      <div className="mx-auto mt-3 mb-4 w-full">
        <p className="text-sm text-gray-500">
          <div
            className="resize-none block whitespace-pre-line break-words overflow-scroll overflow-x-hidden w-full h-[250px] text-base text-gray-500 bg-transparent !outline-none">
            <div className="flex flex-col sm:flex-row">
              <div className="w-full space-y-2 pr-7">
                <h2 className="font-normal text-2xl text-gray-700">Select dropzones</h2>
                {dropzonesLoaded && renderDropzones()}
              </div>
            </div>
          </div>
        </p>
      </div>
      <div className="flex gap-4 justify-end">
        {!published && (<button type="button"
          onClick={handleSubmit}
          disabled={Object.keys(selectedDropzones).length === 0}
          className="relative group inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 align-middle text-sm font-semibold leading-none disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 stroke-white text-white h-[32px] gap-2 w-auto disabled:text-white/50">
          {!publishing && (<span>Parachute</span>)}
          {publishing && spinner()}
        </button>)}
        {published && (<button type="button"
          onClick={onClose}
          className="relative group inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-2 align-middle text-sm font-semibold leading-none disabled:cursor-not-allowed bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 stroke-white text-white h-[32px] gap-2 w-auto disabled:text-white/50">
          Done
        </button>)}
      </div>
    </div>
  </Modal>);
}

export default ModalParachute;