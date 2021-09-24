import { configureStore } from '@reduxjs/toolkit';
import tabsReducer from './reducers/tabsReducer';

export default configureStore({
    reducer: {
        tabs: tabsReducer
    }
})