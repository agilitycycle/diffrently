import { fbdb } from '../app/firebase';
import {
  push,
  update,
  remove,
  set,
  ref,
  query,
  orderByKey,
  limitToLast,
  orderByChild,
  equalTo,
  onValue,
  endAt
} from 'firebase/database';

const fbPush = (path, values) => {
  return push(ref(fbdb, path), values).key;
}

const fbUpdate = (path, values) => {
  return update(ref(fbdb, path), values);
}

// path/id
const fbRemove = (path) => {
  remove(ref(fbdb, path));
}

const fbSet = (path, values) => {
  set(ref(fbdb, path), values);
}

/**
 * 
 * Tag pagination
 *  
 */
const fbOnValueOrderByChildLimitToLast = (path, orderByChildValue, equalToValue, limit) => {
  const r = ref(fbdb, path);
  const q = query(r, orderByChild(orderByChildValue), equalTo(equalToValue), limitToLast(limit));
  return new Promise((resolve) => {
    onValue(q, (snapshot) => {
      if(snapshot.val()) {
        resolve(snapshot.val());
      }
      if(snapshot.val() === null) {
        resolve(false);
      }
    });
  })
}

/**
 * 
 * Tag pagination
 *  
 */
const fbOnValueOrderByChildEndAtLimitToLast = (path, orderByChildValue, lastId, limit) => {
  const r = ref(fbdb, path);
  const q = query(r, orderByChild(orderByChildValue), endAt(lastId), limitToLast(limit));
  return new Promise((resolve) => {
    onValue(q, (snapshot) => {
      if(snapshot.val()) {
        resolve(snapshot.val());
      }
      if(snapshot.val() === null) {
        resolve(false);
      }
    });
  }) 
}

/**
 * 
 * Feed, Tags / pagination
 *  
 */
const fbOnValueOrderByKeyLimitToLast = (path, limit) => {
  const r = ref(fbdb, path);
  const q = query(r, orderByKey(), limitToLast(limit));
  return new Promise(resolve => {
    onValue(q, (snapshot) => {
      if(snapshot.val()) {
        resolve(snapshot.val());
      }
      if(snapshot.val() === null) {
        resolve(false);
      }
    });
  })
}

/**
 * 
 * Feed, Tags / pagination next
 *  
 */
const fbOnValueOrderByKeyEndAtLimitToLast = (path, lastId, limit) => {
  const r = ref(fbdb, path);
  const q = query(r, orderByKey(), endAt(lastId), limitToLast(limit));
  return new Promise((resolve) => {
    onValue(q, (snapshot) => {
      if(snapshot.val()) {
        resolve(snapshot.val());
      }
      if(snapshot.val() === null) {
        resolve(false);
      }
    });
  })
}

export {
  fbPush,
  fbUpdate,
  fbRemove,
  fbSet,
  fbOnValueOrderByChildLimitToLast,
  fbOnValueOrderByChildEndAtLimitToLast,
  fbOnValueOrderByKeyLimitToLast,
  fbOnValueOrderByKeyEndAtLimitToLast
}