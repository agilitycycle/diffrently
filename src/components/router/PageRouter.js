import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';
import { updateAppState, appState } from '../../app/slices/appSlice';

const PageRouter = (props) => {
  const {paths, currentLocation, children} = props;
  const location = useLocation();
  const dispatch = useDispatch();
  const currentAppState = useSelector(appState);
  const [prevLocation, setPrevLocation] = useState('');
  const [loaded, setLoaded] = useState(false);
  const { pathname } = location;
  
  const checkRouter = () => {
    for (let i in paths) {
      const { path, type } = paths[i];
      const match = matchPath({ path, exact: true }, pathname);
      if (match) {
        const { params } = match;
        const { siteid, tagid, postid } = params;
        const cardComponent = {
          type,
          siteid,
          tagid,
          postid
        }
        const newAppState = Object.assign({...currentAppState}, {
          cardComponent
        });
        dispatch(updateAppState(newAppState));
      }
    }
    setPrevLocation(pathname);
    setLoaded(true);
  }

  useEffect(() => {
    if (prevLocation !== currentLocation) {
      setLoaded(false);
    }
  }, [currentLocation])

  useEffect(() => {
    if (loaded) return;
    checkRouter();
  }, [loaded]);

  return(<div>
    {children}
  </div>)
}
  
export default PageRouter