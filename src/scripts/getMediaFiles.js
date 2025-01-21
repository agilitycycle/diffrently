import { ref as sRef, getStorage, listAll } from 'firebase/storage';
  
// https://gist.github.com/jamestalmage/2d8d1d5c42157caf349e
// https://firebase.google.com/docs/storage/web/list-files
// https://codesandbox.io/p/sandbox/google-drive-file-ingestion-6g1u8?file=%2Fsrc%2FApp.js%3A16%2C78

const getMediaFiles = async () => {
  const storage = getStorage();
  const listRef = sRef(storage, `images/${userId}`);
  const result = await listAll(listRef);
  setItems(result.items);
}