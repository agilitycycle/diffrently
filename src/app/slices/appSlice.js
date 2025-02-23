import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: {
    drawerHome: false,
    drawerHomeMenuItemClicked: false,
    drawer: false,
    drawerMenuItemClicked: false,
    cardComponent: {
      type: '',
      siteid: undefined,
      tagid: undefined,
      postid: undefined
    },
    darkMode: false,
    loggedIn: false,
    userId: '',
    email: '',
    admin: false,
    photoUrl: '',
    displayName: '',
    activeSubscriptions: '',
    isPostCardShow: undefined,
    freeTrial: false,
    checkOut: '',
    credit: '',
    scrollPos: 0,
    currentTimeline: []
  },
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    resetAppState: (state) => {
      state.value = initialState.value;
    },
    updateAppState: (state, action) => {
      state.value = action.payload;
    }
  },
})

export const { resetAppState, updateAppState } = appSlice.actions;

export const appState = (state) => state.app.value;

export default appSlice.reducer;