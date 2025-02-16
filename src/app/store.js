import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from '@redux-saga/core';
import appReducer from './slices/appSlice';
import subjectReducer from './slices/subjectSlice';
import conrolReducer from './slices/controlSlice';
import mySaga from './sagas';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    app: appReducer,
    subject: subjectReducer,
    control: conrolReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware)
});

sagaMiddleware.run(mySaga);