import { createSlice } from '@reduxjs/toolkit'

const INITIALIZE_TABS = [
  { id: `${Math.floor(Math.random() * Date.now())}`, title: 'untitled', body: '' }
];

export const tabsSlice = createSlice({
  name: 'tabs',
  initialState: {
    tabs: INITIALIZE_TABS,
    currentTab: {}
  },
  reducers: {
    initializeTabs: (state) => {
      state.tabs = INITIALIZE_TABS;
      state.currentTab = state.tabs[0];
    },

    setTabsData: (state, action) => {
      if (action.payload.length > 0) {
        state.tabs = action.payload;
        state.currentTab = state.tabs[0];
      }
    },

    changeCurrentTabBody: (state, action) => {
      let tempTab = {
        id: state.currentTab.id,
        title: state.currentTab.title,
        body: action.payload
      };

      const idx = state.tabs.map(function(t) { return t.id; }).indexOf(state.currentTab.id);
      state.tabs.splice(idx, 1, tempTab);
      state.currentTab = tempTab;
    },

    changeCurrentTabTitle: (state, action) => {
      let tempTab = {
        id: state.currentTab.id,
        title: action.payload,
        body: state.currentTab.body
      };

      const idx = state.tabs.map(function(t) { return t.id; }).indexOf(state.currentTab.id);
      state.tabs.splice(idx, 1, tempTab);
      state.currentTab = tempTab;
    },

    changeActiveTab: (state, action) => {
      const idx = state.tabs.map(function(t) { return t.id; }).indexOf(action.payload);

      state.currentTab = state.tabs[idx];
    },

    initializeCurrentTab: (state) => {
      state.currentTab = state.tabs[0];
    },

    addTab: (state) => {
      if (state.tabs.length < 8) {
        let tempTab = {
          id: `${Math.floor(Math.random() * Date.now())}`,
          title: 'untitled',
          body: ''
        };

        state.tabs.push(tempTab);
      }
    },

    removeTab: (state, action) => {
      if (state.tabs.length === 1) {
        return;
      }

      const id = action.payload;
      const idx = state.tabs.map(function(t) { return t.id; }).indexOf(id);

      state.tabs.splice(idx, 1);
      if (id === state.currentTab.id) {
        state.currentTab = state.tabs[0];
      };
    }
  },
})

// Action creators are generated for each case reducer function
export const { initializeTabs, setTabsData, changeCurrentTabBody, changeCurrentTabTitle, changeActiveTab, initializeCurrentTab, addTab, removeTab } = tabsSlice.actions;

export default tabsSlice.reducer;