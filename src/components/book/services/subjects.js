const addId = (snapshot) => {
  const obj = {...snapshot};
  const array = [];
  for (let i in obj) {
    obj[i].id = i;
    array.push(obj[i]);
  }
  return array;
}

export {addId};