import { combineReducers } from '@reduxjs/toolkit';
import userSlice from './features/userSlice';
import companiesSlice from './features/companiesSlice'

const rootReducer = combineReducers({
  user: userSlice,
  companies: companiesSlice,
});

export default rootReducer;
