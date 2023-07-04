import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Modal, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import { createResetPwdTokeApi } from 'Apis/CustomerApis';
import { PRIMARY_ACTIVE_COLOR, PRIMARY_DARK_COLOR } from 'constants/constants';
import HtSpinner from 'admin/components/HtSpinner';
import { RunToast } from 'utils/toast';

const STEP_INPUT_EMAIL = 0;
const STEP_EMAIL_SENT = 1;

const CustomerForgotPasswordModal = ({ isShow, hideModal, gotoLogin }) => {
  const [curStep, setCurStep] = useState(STEP_INPUT_EMAIL);
  const [loading, setLoading] = useState(false);

  const formSubmitProps = useFormik({
    initialValues: {
      email: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .email('Invalid email field')
        .required('Required field'),
    }),
    onSubmit: ({ email }) => {
      setLoading(true);
      createResetPwdTokeApi(email)
        .then((res) => {
          setLoading(false);
          if (res.data) {
            setCurStep(STEP_EMAIL_SENT);
            RunToast('success', 'Reset password email sent.');
          } else {
            formSubmitProps.setErrors({ email: 'Email does not exist!' });
          }
        })
        .catch((err) => {
          setLoading(false);
          formSubmitProps.setErrors({ email: 'Email does not exist!' });
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
      {curStep === STEP_INPUT_EMAIL && (
        <React.Fragment>
          <Modal.Header
            className="p-4 d-flex justify-content-center"
            closeButton
          >
            <Modal.Title className="text-center">Forgot Password</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-5 py-4">
            <p className="text-center">Please enter your email</p>
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
                    formSubmitProps.touched.email &&
                    formSubmitProps.errors.email
                  }
                  autoComplete="new-password"
                />
                <Form.Control.Feedback type="invalid">
                  {formSubmitProps.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <LoginButton className="ht-btn-primary mt-2" type="submit">
                Reset Password
              </LoginButton>
            </Form>
          </Modal.Body>
        </React.Fragment>
      )}
      {curStep === STEP_EMAIL_SENT && (
        <React.Fragment>
          <Modal.Header
            className="p-4 d-flex justify-content-center"
            closeButton
          >
            <Modal.Title className="text-center">Password sent</Modal.Title>
          </Modal.Header>
          <Modal.Body className="px-5 py-4 text-center">
            <p class="mb-3 text-center">
              An email has been sent to {formSubmitProps.values.email}. If this
              email address is registered to TradeSprint.co.uk, you'll receive
              reset password link.
            </p>
            <LoginButton className="ht-btn-primary" onClick={gotoLogin}>
              Enter new password
            </LoginButton>
          </Modal.Body>
        </React.Fragment>
      )}
      {loading && (
        <HtSpinner
          spinnerPosition={{
            left: 'calc(50% - 25px)',
            top: 'calc(50% - 25px)',
          }}
        />
      )}
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
  }
`;
const LoginButton = styled(Button)`
  min-width: 140px;
`;

export default CustomerForgotPasswordModal;
