import { combineReducers } from 'redux';
import active_user from './active_user';
import user_data from './user_data';
import search_results from './search_results';
// Import reducers

export default combineReducers({
  active_user: active_user,
  user_data: user_data,
  search_results
});