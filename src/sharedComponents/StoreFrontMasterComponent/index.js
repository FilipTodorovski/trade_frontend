import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

import HtSpineer from 'admin/components/HtSpinner';
import { getMeApi } from 'Apis/CustomerApis';
import { SET_CUSTOMER_USER } from '../../storeFront/actions/actionTypes';

const StoreFrontMasterComponent = ({ redirect = false, children }) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const { customerInfo } = useSelector((state) => ({
    customerInfo: state.storeFrontReducer.user,
  }));

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const customerToken = localStorage.getItem('customer-token');

    if (redirect) {
      if (!customerToken) history.push('/');
    }

    if (customerToken && Object.keys(customerInfo).length === 0) {
      setLoading(true);
      getMeApi()
        .then((response) => {
          setLoading(false);
          dispatch({
            type: SET_CUSTOMER_USER,
            payload: {
              user: response.data,
              token: customerToken,
            },
          });
        })
        .catch((err) => {
          history.push('/');
        });
    }
  }, []); // eslint-disable-line

  if (loading)
    return (
      <SpinnerComponent>
        <HtSpineer />
      </SpinnerComponent>
    );
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
};

const SpinnerComponent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export default StoreFrontMasterComponent;
