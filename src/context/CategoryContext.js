import React, { useState, useEffect, createContext } from 'react';
import { useSelector } from 'react-redux';
import { fbOnValueOrderByKeyLimitToLast } from '../services/firebaseService';
import { appState } from '../app/slices/appSlice';

export const CategoryContext = createContext(null);

const CategoryContextProvider = (props) => {
  const { Component } = props;
  const currentAppState = useSelector(appState);
  const { userId } = currentAppState;

  const hasOrder = (item) => {
    return item.hasOwnProperty('order');
  }

  const getPost = async (categoryName) => {
    const result = await fbOnValueOrderByKeyLimitToLast(`/userTags/${userId}/post/${categoryName}`, 100);
    if (result) {
      return Object.keys(result).length;
    }
    return 0;
  }

  const getCategories = async (userId) => {
    const newCategories = {...categories};
    const postResult = await getPost('Default');

    newCategories.categories = [{
      post: postResult,
      categoryName: 'Default'
    }];
    const result = await fbOnValueOrderByKeyLimitToLast(`/userCategories/${userId}/categories/`, 100);

    if (result) {
      for (let value in result) {
        const postResult = await getPost(value);
  
        if (value !== 'Default') {
          newCategories.categories.push({
            post: postResult,
            categoryName: value
          });
        }

        // has order
        if (hasOrder(result[value])) {
          const order = result[value].order;
          value !== 'Default' ?
            newCategories.categories[newCategories.categories.length - 1].order = order :
            newCategories.categories[0].order = order;
        }
      }

      if (hasOrder(newCategories.categories[0])) {
        newCategories.categories = newCategories.categories.sort(({ order:a }, { order:b }) => b - a).reverse();
      }
      
    }

    newCategories.loaded = true;
    setCategories(newCategories);
  }

  const setLoading = () => {
    const newCategories = Object.assign(categories, {
      loaded: false
    })
    setCategories(newCategories);
  }

  const initialState = {
    categories: [],
    loaded: false,
    loading: setLoading,
    getCategories: getCategories
  }

  const [categories, setCategories] = useState(initialState);

  useEffect(() => {
    if (categories.loaded) return;
    getCategories(userId);
    // eslint-disable-next-line
  }, [categories])

  return (<CategoryContext.Provider value={categories}>
      <Component />
    </CategoryContext.Provider>);
}

export const CategoryContextHOC = Component => {
  return () => <CategoryContextProvider Component={Component} />
}

export default CategoryContext;