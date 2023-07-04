import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useFormik } from 'formik';
import axios from 'axios';
import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';
import CheckBox from '../CheckBox';
import { loginValidateSchema } from 'validators';
import { PRIMARY_ACTIVE_COLOR, PRIMARY_DARK_COLOR } from 'constants/constants';
import HtSpinner from 'admin/components/HtSpinner';
import { SET_CUSTOMER_USER } from '../../storeFront/actions/actionTypes';
const CustomerLoginModal = ({
  isShow,
  hideModal,
  gotoSignup,
  gotoForgotPwd,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const formSubmitProps = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: loginValidateSchema,
    onSubmit: ({ email, password }) => {
      setLoading(true);
      axios({
        method: 'POST',
        url: '/auth/login',
        data: {
          email,
          password,
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            dispatch({
              type: SET_CUSTOMER_USER,
              payload: res.data,
            });
            history.push('/customer/admin');
          }
        })
        .catch((error) => {
          setLoading(false);
          if (error.response.data.error === 'User does not exist!') {
            formSubmitProps.setErrors({ email: error.response.data.error });
          } else if (error.response.data.error === 'invalid password') {
            formSubmitProps.setErrors({ password: 'Password is incorrect!' });
          }
        });
    },
  });

  return (
    <ComponentModal
      show={isShow}
      size="md"
      centered
      className="ht-modal"
      onHide={hideModal}
    >
      <Modal.Header className="p-4 d-flex justify-content-center" closeButton>
        <Modal.Title className="text-center">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5 py-4">
        <Form
          onSubmit={formSubmitProps.handleSubmit}
          className="d-flex flex-column align-items-center"
        >
          <Form.Group>
            <Form.Label className="ht-label">Email</Form.Label>
            <Form.Control
              className="ht-form-control"
              name="email"
              type="text"
              value={formSubmitProps.values.email}
              onChange={formSubmitProps.handleChange}
              onBlur={formSubmitProps.handleBlur}
              isInvalid={
                formSubmitProps.touched.email && formSubmitProps.errors.email
              }
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {formSubmitProps.errors.email}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group>
            <Form.Label className="ht-label">Password</Form.Label>
            <Form.Control
              className="ht-form-control"
              name="password"
              type="password"
              value={formSubmitProps.values.password}
              onChange={formSubmitProps.handleChange}
              onBlur={formSubmitProps.handleBlur}
              isInvalid={
                formSubmitProps.touched.password &&
                formSubmitProps.errors.password
              }
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {formSubmitProps.errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="forget-remember-div">
            <div className="remember-div">
              <CheckBox
                name="Remember me"
                checked={rememberMe}
                onChange={() => {
                  setRememberMe(!rememberMe);
                }}
              />
            </div>
            <a href onClick={gotoForgotPwd}>
              Forgot password?
            </a>
          </div>
          <LoginButton className="ht-btn-primary mt-2" type="submit">
            Login
          </LoginButton>
        </Form>
      </Modal.Body>
      <Modal.Footer className="pt-3 px-5 pb-5">
        <h6 className="footer-description text-center">
          Don't have an account?{' '}
          <a href="/forgot-password" onClick={gotoSignup}>
            Sign up
          </a>
          <br />
          <br />
          By creating an account you agree to our <br />
          <a href="/terms" target="_blank">
            Terms and Conditions.
          </a>{' '}
          <br />
          <br />
          Please read our{' '}
          <a href="/privacy-policy" target="_blank">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/legal" target="_blank">
            Cookie Policy
          </a>
        </h6>
      </Modal.Footer>
      {loading && <HtSpinner />}
    </ComponentModal>
  );
};

const ComponentModal = styled(Modal)`
  color: ${PRIMARY_DARK_COLOR};
  .modal-content {
    border-radius: 12px;
    .modal-header {
      .modal-title {
        font-size: 28px;
      }
    }
    .form-group {
      width: 100%;
    }
    .modal-footer {
      flex-direction: column;
      .footer-description {
        a {
          color: ${PRIMARY_ACTIVE_COLOR};
          cursor: pointer;
        }
      }
    }
    .forget-remember-div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      a {
        cursor: pointer;
        color: ${PRIMARY_ACTIVE_COLOR};
      }
    }
  }
`;

const LoginButton = styled(Button)`
  width: 140px;
`;

export default CustomerLoginModal;
