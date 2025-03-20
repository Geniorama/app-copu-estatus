import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import companiesSlice from './features/companiesSlice'
import settingsSlice from './features/settingsSlice';

const rootReducer = combineReducers({
  user: userSlice,
  companies: companiesSlice,
  settings: settingsSlice
});

export default rootReducer;
