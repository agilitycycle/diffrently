import axios from 'axios';
import { takeEvery, select, call, put, all } from 'redux-saga/effects';
import { fbdb } from './firebase';
import { ref, query, get } from 'firebase/database';
import { updateAppState, appState } from './slices/appSlice';
import { updateSubjectState, subjectState } from './slices/subjectSlice';

let called = false;

// watch all
export default function* mySaga () {
  yield all([
    yield takeEvery(updateAppState.type, app)
  ])
}

// redux, update tag categories **
function getTagCategories (userId) {
  axios
    .get(`https://request-bf66wb3ria-ue.a.run.app?userId=${userId}`, {
      responseType: 'text',
    })
    .then(function (response) {
      console.log(response.data);
    });
}

function getSubjects (userId) {
  const userRef = ref(fbdb, `userSubject/${userId}/subjects/`);
  const q = query(userRef);
  return new Promise(resolve => {
    get(q)
      .then((snapshot) => {
        const result = snapshot.val();
        const subjectArray = [];
        for (let i in result) {
          const subjectObject = {id: i};
          for (let j in result[i]) {
            subjectObject[j] = result[i][j];
          }
          subjectArray.push(subjectObject);
        }
        resolve(subjectArray);
      })
      .catch((error) => {
        console.log(error);
      });
  })
}

function getSubscriptions (activeSubscriptions, userId) {
  const userRef = ref(fbdb, `userSubscriptions/${userId}/subscriptions/${activeSubscriptions}`);
  const q = query(userRef);
  return new Promise((resolve) => {
    get(q)
      .then((snapshot) => {
        resolve(snapshot.val());
      })
      .catch((error) => {
        console.log(error);
      });
  })
}

function* app () {
  if (!called) {
    called = true;
    const currentAppState = yield select(appState);
    const {activeSubscriptions, loggedIn, userId} = currentAppState;
    if (!loggedIn) return; // do no sagas
    /**
     * 
     * Subscriptions
     * 
     */
    const subscriptions = yield call(getSubscriptions, activeSubscriptions, userId);
    const newAppState = Object.assign({...currentAppState}, {subscriptions});
    updateAppState(newAppState);
    yield put(updateAppState(newAppState));
    /**
     * 
     * Subjects
     * 
     */
    const subjects = yield call(getSubjects, userId);
    const newSubjectState = Object.assign({...subjectState}, {subjects});
    updateSubjectState(newSubjectState); // do I need this?
    yield put(updateSubjectState(newSubjectState));
    /**
     * 
     * Tag categories
     * 
     */
    yield call(getTagCategories, userId);
  }
}