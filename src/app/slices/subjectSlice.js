import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  value: {
    title: '',
    imageUrl: '',
    blurb: '',
    subject: '',
    newSubject: false,
    category: '',
    tags: [],
    topic1: '',
    topic2: '',
    topic3: '',
    cardCount: 0,
    currentSubject: '',
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