import {useEffect} from 'react';
import {useSelector, useDispatch } from 'react-redux';
import {updateAppState, appState} from '../app/slices/appSlice';

// https://www.reddit.com/r/reduxjs/comments/oqjvz7/how_do_i_avoid_usedispatch_in_every_component/

export const useAppState = (key) => {
  const currentAppState = useSelector((state) => {
    return state.app.value, state.app.value[key];
  });
  useEffect(() => {
    //
  }, [key]);
  return currentAppState;
}

export const useDispatchAppState = (data) => {
  const currentAppState = useSelector(appState);
  const newAppState = Object.assign({}, {...currentAppState}, data);
  const dispatch = useDispatch();
  useEffect(() => {
    // Whenever this next line runs, the redux state will eventually 
    // change causing the useSelector function above to rerun and update 
    // the value stored in currentAppState

    dispatch(updateAppState(newAppState));

  }, [data]);
  return currentAppState;
}