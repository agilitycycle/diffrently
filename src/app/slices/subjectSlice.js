import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  value: {
    id: '', // subject id
    title: '',
    imageUrl: '',
    blurb: '',
    subject: '',
    newSubject: false,
    chapters: undefined,
    chapter: undefined,
    section: undefined,
    editorContent: '',
    category: '',
    tags: '[]',
    topic1: '',
    topic2: '',
    topic3: '',
    cardCount: 0,
    currentSubject: '', // current subject id??
    currentTimeline: undefined
  },
}

const amendedState = {};
amendedState.value = {...initialState.value};
amendedState.value.subjects = [];

export const subjectSlice = createSlice({
  name: 'subject',
  initialState: amendedState,
  reducers: {
    updateSubjectState: (state, action) => {
      state.value = action.payload;
    }
  },
})

export const { updateSubjectState } = subjectSlice.actions;

export const subjectState = (state) => state.subject.value;

export default subjectSlice.reducer;