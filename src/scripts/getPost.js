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