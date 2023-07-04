import React from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Formik, Form as FormikForm } from 'formik';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { registerValidationSchema } from 'validators';
import LogoSVG from 'svg/logo-menu.svg';
import * as types from '../../actions/actionTypes';
import ApiService from 'admin/ApiService';
import { getNewOrderCount } from 'Apis/Elastic';

const RegisterPage = ({ history }) => {
  const dispatch = useDispatch();

  const onSubmit = (values) => {
    ApiService({
      method: 'POST',
      url: '/auth/register',
      data: {
        first_name: values.firstName,
        last_name: values.lastName,
        email: values.email,
        password: values.password,
        role: 'admin',
      },
    })
      .then((res) => {
        if (res.data.success) {
          dispatch({
            type: types.REGISTER_SUCCESS,
            payload: {
              user: res.data.user,
              token: res.data.token,
            },
          });

          getNewOrderCount().then((count) => {
            dispatch({
              type: types.NEW_ORDER_COME,
              payload: count,
            });
          });

          setTimeout(() => {
            history.push('/dashboard');
          }, 100);
        }
      })
      .catch((error) => {
        // if (error.response.data.error === 'Email already exist!')
        //   setFormData({
        //     ...formData,
        //     email: {
        //       value: formData.email.value,
        //       validate: false,
        //       errorMsg: 'Email already exist!',
        //     },
        //   });
      });
  };

  return (
    <Container className="container d-flex flex-column justify-content-center">
      <Row>
        <Col md="6" className="offset-md-3">
          <LogoDiv className="d-flex justify-content-center">
            <img src={LogoSVG} alt="logo" />
          </LogoDiv>
          <h4 className="d-flex justify-content-center">
            Start taking online orders
          </h4>
          <p className="d-flex justify-content-center">
            Or
            <a className="ml-2 text-primary" href="/login">
              Login to your account
            </a>
          </p>

          <Card>
            <Card.Body>
              <Formik
                initialValues={{
                  firstName: '',
                  lastName: '',
                  email: '',
                  password: '',
                }}
                validationSchema={registerValidationSchema}
                onSubmit={onSubmit}
              >
                {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  setFieldValue,
                  handleBlur,
                  handleSubmit,
                  isSubmitting,
                }) => (
                  <FormikForm onSubmit={handleSubmit}>
                    <Row>
                      <Form.Group as={Col} xs="6">
                        <Form.Label>Frist Name</Form.Label>
                        <Form.Control
                          name="firstName"
                          type="text"
                          placeholder="First Name"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.firstName && errors.firstName}
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.firstName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group as={Col} xs="6">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          name="lastName"
                          type="text"
                          placeholder="Last Name"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.lastName && errors.lastName}
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.lastName}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} lg="12">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          name="email"
                          type="text"
                          placeholder="Email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.email && errors.email}
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} lg="12">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                          name="password"
                          type="password"
                          placeholder="Password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.password && errors.password}
                          autoComplete="new-password"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Row>
                    <Row>
                      <Form.Group as={Col} lg="12">
                        <Button className="w-100 ht-btn-primary" type="submit">
                          Create your account
                        </Button>
                      </Form.Group>
                    </Row>
                  </FormikForm>
                )}
              </Formik>
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

export default withRouter(RegisterPage);
