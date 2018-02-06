import { combineReducers } from 'redux';
import active_user from './active_user';
// Import reducers

export default combineReducers({
  active_user: active_user
});