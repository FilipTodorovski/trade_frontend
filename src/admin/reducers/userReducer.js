import * as types from '../actions/actionTypes';
import initialState from '../../reducers/initialState';
import setAuthToken from 'utils/setAuthToken';

export default (state = initialState.user, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      setAuthToken(action.payload.token);
      localStorage.setItem('user_id', action.payload.user.id);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
      };
    case types.REGISTER_SUCCESS:
      localStorage.setItem('user_id', action.payload.user.id);
      setAuthToken(action.payload.token);
      return {
        ...state,
        user: { ...action.payload.user },
        token: action.payload.token,
      };
    case types.UPDATE_USERINFO:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      return {
        ...state,
      };
  }
};
