import React, { useState } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import validator from 'validator';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

import ApiService from 'admin/ApiService';
import LogoSVG from 'svg/logo-small.svg';
import * as types from '../../actions/actionTypes';
import { getNewOrderCount } from 'Apis/Elastic';

import { RunToast } from 'utils/toast';

const LoginPage = ({ history }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: {
      value: '',
      validate: true,
      errorMsg: '',
    },
    password: {
      value: '',
      validate: true,
      errorMsg: '',
    },
  });

  const checkEmailValidate = () => {
    if (formData.email.value.length === 0) {
      setFormData({
        ...formData,
        email: {
          value: formData.email.value,
          validate: false,
          errorMsg: 'Email required!',
        },
      });
      return false;
    }
    if (validator.isEmail(formData.email.value)) {
      setFormData({
        ...formData,
        email: {
          value: formData.email.value,
          validate: true,
          errorMsg: '',
        },
      });
      return true;
    }
    setFormData({
      ...formData,
      email: {
        value: formData.email.value,
        validate: false,
        errorMsg: 'Not a valid email address!',
      },
    });
    return false;
  };

  const checkPasswordValidate = () => {
    let errorMsg = '';
    let validate = true;
    if (formData.password.value.length === 0) {
      errorMsg = 'Password required!';
      validate = false;
    }

    setFormData({
      ...formData,
      password: {
        value: formData.password.value,
        validate,
        errorMsg,
      },
    });
    return validate;
  };

  const onSubmit = (e) => {
    if (checkEmailValidate() && checkPasswordValidate()) {
      ApiService({
        method: 'POST',
        url: '/auth/login',
        data: {
          email: formData.email.value,
          password: formData.password.value,
        },
      })
        .then((res) => {
          if (res.data.success) {
            dispatch({
              type: types.LOGIN_SUCCESS,
              payload: {
                user: res.data.user.user,
                token: res.data.token,
              },
            });

            getNewOrderCount().then((res) => {
              dispatch({
                type: types.NEW_ORDER_COME,
                payload: res,
              });
            });

            setTimeout(() => {
              history.push('/dashboard');
            }, 100);
          }
        })
        .catch((error) => {
          try {
            if (error.response.data.error === 'User does not exist!') {
              setFormData({
                ...formData,
                email: {
                  value: formData.email.value,
                  validate: false,
                  errorMsg: error.response.data.error,
                },
              });
            } else if (error.response.data.error === 'invalid password') {
              setFormData({
                ...formData,
                password: {
                  value: formData.password.value,
                  validate: false,
                  errorMsg: 'Password is incorrect!',
                },
              });
            }
          } catch (err) {
            RunToast('error', `Login failed, Please try again.`);
          }
        });
    }
    e.preventDefault();
  };

  return (
    <Container className="container d-flex flex-column justify-content-center">
      <Row>
        <Col md="6" className="offset-md-3">
          <LogoDiv className="d-flex justify-content-center">
            <img src={LogoSVG} alt="logo" />
          </LogoDiv>
          <h4 className="d-flex justify-content-center">
            Sign in to your account
          </h4>
          <p className="d-flex justify-content-center">
            Or
            <a className="ml-2 text-primary" href="/register">
              Create an account
            </a>
          </p>

          <Card>
            <Card.Body>
              <Form onSubmit={onSubmit}>
                <Row>
                  <Form.Group as={Col} lg="12">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Email"
                      value={formData.email.value}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          email: {
                            value: e.target.value,
                            validate: true,
                            errorMsg: '',
                          },
                        });
                      }}
                      isInvalid={!formData.email.validate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formData.email.errorMsg}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} lg="12">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      value={formData.password.value}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          password: {
                            value: e.target.value,
                            validate: true,
                            errorMsg: '',
                          },
                        });
                      }}
                      isInvalid={!formData.password.validate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formData.password.errorMsg}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group as={Col} lg="12">
                    <Button className="w-100 ht-btn-primary" type="submit">
                      Sign in
                    </Button>
                  </Form.Group>
                </Row>
              </Form>
              {/* <SocialDiv className="social-btn-div d-flex justify-content-between flex-column">
                <a
                  href={`${CONFIG.API_URL}/auth/google`}
                  className="btn-social d-flex justify-content-center w-100 align-items-center py-0"
                >
                  <span className="svgIcon t-popup-svg">
                    <svg
                      className="svgIcon-use"
                      width="25"
                      height="37"
                      viewBox="0 0 25 25"
                    >
                      <g fill="none" fillRule="evenodd">
                        <path
                          d="M20.66 12.693c0-.603-.054-1.182-.155-1.738H12.5v3.287h4.575a3.91 3.91 0 0 1-1.697 2.566v2.133h2.747c1.608-1.48 2.535-3.65 2.535-6.24z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12.5 21c2.295 0 4.22-.76 5.625-2.06l-2.747-2.132c-.76.51-1.734.81-2.878.81-2.214 0-4.088-1.494-4.756-3.503h-2.84v2.202A8.498 8.498 0 0 0 12.5 21z"
                          fill="#34A853"
                        />
                        <path
                          d="M7.744 14.115c-.17-.51-.267-1.055-.267-1.615s.097-1.105.267-1.615V8.683h-2.84A8.488 8.488 0 0 0 4 12.5c0 1.372.328 2.67.904 3.817l2.84-2.202z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12.5 7.38c1.248 0 2.368.43 3.25 1.272l2.437-2.438C16.715 4.842 14.79 4 12.5 4a8.497 8.497 0 0 0-7.596 4.683l2.84 2.202c.668-2.01 2.542-3.504 4.756-3.504z"
                          fill="#EA4335"
                        />
                      </g>
                    </svg>
                  </span>
                  <span className="button-label">Sign in with Google</span>
                </a>
                <Button
                  className="d-flex align-items-center justify-content-center mt-3"
                  onClick={() => {
                    clickSocialLogin('/auth/facebook');
                  }}
                >
                  <img
                    src={FacebookSVG}
                    className="mr-1"
                    style={{ height: '20px' }}
                  />
                  Continue with Facebook
                </Button>
              </SocialDiv> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;

  input[type='text'],
  input[type='password'] {
    height: 52px;
    padding: 16px;
  }

  .ht-btn-primary {
    padding: 16px 28px;
    height: 52px;
    border-radius: 5px;
  }
`;

const LogoDiv = styled.h2`
  img {
    width: 50px;
  }
`;

export default withRouter(LoginPage);
