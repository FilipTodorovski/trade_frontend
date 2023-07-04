import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';

import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

import Sidebar from '../Sidebar';
import setAuthToken from 'utils/setAuthToken';
import * as types from 'admin/actions/actionTypes';
import ApiService from 'admin/ApiService';
import { getNewOrderCount } from 'Apis/Elastic';
import * as CONSTANTS from 'constants/constants';

const AppContainer = ({ history, children }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

  useEffect(() => {
    if (!localStorage.token) history.push('/login');

    if (Object.keys(userInfo).length === 0) {
      const getUserToken = async () => {
        try {
          const res = await ApiService({
            method: 'GET',
            url: '/userwithtoken',
            ...CONSTANTS.getToken(),
          });

          if (res.data.success) {
            dispatch({
              type: types.UPDATE_USERINFO,
              payload: res.data.user,
            });

            const newOrderCount = await getNewOrderCount(res.data.user.id);
            dispatch({
              type: types.NEW_ORDER_COME,
              payload: newOrderCount,
            });
          } else {
            history.push('/login');
          }
        } catch (err) {
          setAuthToken('');
          history.push('/login');
        }
      };

      getUserToken();
    }
  }, []); // eslint-disable-line

  return (
    <div className="d-flex overflow-hidden" style={{ height: '100vh' }}>
      <Sidebar />
      <MainContainer>{children}</MainContainer>
      <ToastContainer />
    </div>
  );
};

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  position: relative;
  z-index: 0;
  overflow-y: auto;

  @media screen and (max-width: 767px) {
    margin-top: 70px;
  }
`;

export default withRouter(AppContainer);
