import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import get from 'lodash/get';
import { useFormik } from 'formik';
import axios from 'axios';
import styled from 'styled-components';
import { Modal, Form, Row, Col, Button } from 'react-bootstrap';
import { registerValidationSchema } from 'validators';
import { PRIMARY_ACTIVE_COLOR, PRIMARY_DARK_COLOR } from 'constants/constants';
import HtSpinner from 'admin/components/HtSpinner';

const CustomerRegisterModal = ({ isShow, hideModal, gotoLogin }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const formSubmitProps = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: registerValidationSchema,
    onSubmit: async ({ firstName, lastName, email, password }) => {
      setLoading(true);
      axios({
        method: 'POST',
        url: '/auth/register-customer',
        data: {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role: 'customer',
        },
      })
        .then((res) => {
          setLoading(false);
          if (res.data.success) {
            hideModal();
            history.push('/customer/admin');
          }
        })
        .catch((err) => {
          if (
            get(err, 'response.data.error.err.message', '') ===
            'Email already exist!'
          ) {
            formSubmitProps.setErrors({ email: 'Email already exist!' });
          }
          setLoading(false);
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
        <Modal.Title className="text-center">Sign up</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-5 py-4">
        <Form
          onSubmit={formSubmitProps.handleSubmit}
          className="d-flex flex-column align-items-center"
        >
          <Row>
            <Form.Group as={Col} xs="6">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                className="ht-form-control"
                name="firstName"
                type="text"
                value={formSubmitProps.values.firstName}
                onChange={formSubmitProps.handleChange}
                onBlur={formSubmitProps.handleBlur}
                isInvalid={
                  formSubmitProps.touched.firstName &&
                  formSubmitProps.errors.firstName
                }
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {formSubmitProps.errors.firstName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} xs="6">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                className="ht-form-control"
                name="lastName"
                type="text"
                value={formSubmitProps.values.lastName}
                onChange={formSubmitProps.handleChange}
                onBlur={formSubmitProps.handleBlur}
                isInvalid={
                  formSubmitProps.touched.lastName &&
                  formSubmitProps.errors.lastName
                }
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">
                {formSubmitProps.errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Form.Group>
            <Form.Label>Email</Form.Label>
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
            <Form.Label>Password</Form.Label>
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
          <SignupButton className="ht-btn-primary mt-2" type="submit">
            Sign up
          </SignupButton>
        </Form>
      </Modal.Body>
      <Modal.Footer className="pt-3 px-5 pb-5">
        <h6 className="footer-description text-center">
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
          <br />
          Already have an account?{' '}
          <a href onClick={gotoLogin}>
            Login
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
    position: relative;
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

const SignupButton = styled(Button)`
  width: 140px;
`;

export default CustomerRegisterModal;
