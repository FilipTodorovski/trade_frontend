import { combineReducers } from 'redux';
import adminReducer from '../admin/reducers';
import storeFrontReducer from '../storeFront/reducers';

export default combineReducers({
  ...adminReducer,
  ...storeFrontReducer,
});
