import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {updateAppState, appState} from '../../app/slices/appSlice';
import {
  getPost,
  hydrateContent,
  getPostDetails
} from '../../utility';
import PageRouter from '../router/PageRouter';
import CardContainer from '../cards/containers/CardContainer';
import {
  Page,
  Header,
  ModalShareV2
} from '..';

/**
 * 
 * This page alone should handle:
 * 
 * - Root
 * - Tag
 * - Post
 * 
 */

// route paths
const paths = [
  {
    type: 'ROOT',
    path: '/h/:siteid'
  },
  {
    type: 'TAG',
    path: '/h/:siteid/:tagid'
  },
  {
    type: 'POST',
    path: '/h/:siteid/:tagid/:postid'
  }
];

// db path
const path = '/userHost/agility-cycle-blog/post';

const Site = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const {cardComponent} = currentAppState;
  const {type, siteid, tagid, postid} = cardComponent;
  const [openShareModal, setOpenShareModal] = useState(false);
  const [paginationEnd, setPaginationEnd] = useState(false);
  const [postItem, setPostItem] = useState({
    title: undefined,
    body: undefined,
    tags: undefined});
  const [postLoaded, setPostLoaded] = useState(false);
  const [postList, setPostList] = useState([]);
  const [lastId, setLastId] = useState('');
  const tag = tagid;

  // browser's back/forward button
  const switchPage = (tagid, postid) => {
    setLastId('');
    setPostList([]);
    setPostLoaded(false);
    setPaginationEnd(false);
    const cardComponent = {
      type: '',
      siteid: undefined,
      tagid: undefined,
      postid: undefined
    }
    const newAppState = Object.assign({...currentAppState}, {
      cardComponent
    });
    dispatch(updateAppState(newAppState));
    navigate(`/h/${siteid}/${tagid}/${postid || ''}`);
  }

  useEffect(() => {
    if (!postLoaded && siteid !== undefined && postid === undefined ||
      !postLoaded && siteid !== undefined && tagid !== undefined && postid === undefined
    ) {
      getPost(postList, lastId, type, path, tag, {
        setPostList,
        setPaginationEnd,
        setPostLoaded,
        setLastId,
      });
    }
    if(!postLoaded && siteid !== undefined && postid !== undefined) {
      const pathPostid = `${path}/${postid}`;
      getPostDetails(pathPostid, {setPostList, setPostLoaded});
    }
    // eslint-disable-next-line
  }, [postLoaded, type, tagid]);


  const noPost = postLoaded && postList.length < 1;

  const cardContainerProps = {
    content: hydrateContent(postList, {
      setOpenShareModal,
      setPostItem
    }) || [],
    getPost: () =>
      getPost(postList, lastId, type, path, tag, {
        setPostList,
        setPaginationEnd,
        setPostLoaded,
        setLastId,
      }),
    postLoaded,
    noPost,
    switchPage,
    paginationEnd,
  }

  const pageRouterProps = {
    paths,
    currentLocation: location.pathname
  }

	return (<>
    <ModalShareV2 open={openShareModal} setOpen={setOpenShareModal} postItem={postItem} />
		<Page>
      <PageRouter {...pageRouterProps}>
        <Header noMenu />
        <div className="flex items-center justify-center h-full">
          <div className="h-full w-full max-w-[500px] sm:w-8/12">
            <div className="min-w-80 pb-7">
              <nav className="flex mb-8" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                    <a href={null} className="cursor-pointer inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                      <svg className="w-5 h-5 me-2.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM64 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L96 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"/></svg>
                      Abc
                    </a>
                  </li>
                </ol>
              </nav>
              <CardContainer {...cardContainerProps} />
            </div>
          </div>
        </div>
      </PageRouter>
    </Page>
  </>);
};

export default Site;