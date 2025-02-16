import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
  value: {
    bookControls: {
      isExpand: false,
      darkMode: undefined
    },
    editor: {
      isEditor: false
    }
  },
}

export const controlSlice = createSlice({
  name: 'control',
  initialState,
  reducers: {
    resetControls: (state) => {
      state.value = initialState;
    },
    updateControlState: (state, action) => {
      state.value = action.payload;
    },
  },
})

export const {resetControls, updateControlState} = controlSlice.actions;

export const controlState = (state) => state.control.value;

export default controlSlice.reducer;