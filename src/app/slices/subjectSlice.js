import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  value: {
    activeId: '',
    // activeSubject: [],
    subjects: [],
    chapter: '', // active chapter
    section: undefined,
    editorContent: '',
    currentTimeline: undefined
  },
}

// why did i do this for?
const amendedState = {};
amendedState.value = {...initialState.value};
amendedState.value.subjects = [];

// https://syedsajjadkazmii.medium.com/implementing-redux-toolkit-with-redux-sagas-in-react-js-b959492f7053

export const subjectSlice = createSlice({
  name: 'subject',
  initialState: amendedState,
  reducers: {
    resetSubjectState: (state) => {
      state.value = amendedState;
    },
    loadSubjectState: (state, action) => {
      state.value = action.payload;
      state.loading = true;
    },
    updateSubjectState: (state, action) => {
      state.value = action.payload;
      state.loading = false;
    },
  },
})

export const {resetSubjectState, loadSubjectState, updateSubjectState} = subjectSlice.actions;

export const subjectState = (state) => state.subject.value;

export default subjectSlice.reducer;