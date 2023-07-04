import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useFormik } from 'formik';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { checkResetPwdTokenApi, resetPasswordApi } from 'Apis/CustomerApis';
import { changePasswordSchema } from 'validators';
import LogoSVG from 'svg/logo-menu.svg';
import HtSpinner from 'admin/components/HtSpinner';

const STEP_RESET_PASSWORD = 0;
const STEP_RESULT = 1;
const STEP_EXPRIED = 2;

const ResetPassword = () => {
  const history = useHistory();
  const { token } = useParams();
  const [curStep, setCurStep] = useState(STEP_RESET_PASSWORD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setLoading(true);
      checkResetPwdTokenApi(token)
        .then((res) => {
          setLoading(false);
          if (!res.data.success) {
            setCurStep(STEP_EXPRIED);
          }
        })
        .catch((err) => {
          setLoading(false);
          setCurStep(STEP_EXPRIED);
        });
    }
  }, [token]);

  const formSubmitProps = useFormik({
    initialValues: {
      email: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: changePasswordSchema,
    onSubmit: ({ newPassword, confirmPassword }) => {
      if (newPassword !== confirmPassword) {
        formSubmitProps.setErrors({
          confirmPassword: "Password didn't matches.",
        });
        return;
      }

      setLoading(true);
      resetPasswordApi(token, newPassword)
        .then((res) => {
          setLoading(false);
          setCurStep(STEP_RESULT);
        })
        .catch((err) => {
          setLoading(false);
          setCurStep(STEP_EXPRIED);
          // formSubmitProps.setErrors({ email: 'Email does not exist!' });
        });
    },
  });

  return (
    <Container className="container d-flex flex-column justify-content-center">
      <Row>
        <Col md="6" className="offset-md-3">
          <LogoDiv className="d-flex justify-content-center">
            <img src={LogoSVG} alt="logo" />
          </LogoDiv>
          {curStep === STEP_RESET_PASSWORD && (
            <React.Fragment>
              <h4 className="d-flex justify-content-center mb-4">
                Please enter new password
              </h4>
              <Card>
                <Card.Body>
                  <Form
                    onSubmit={formSubmitProps.handleSubmit}
                    className="d-flex flex-column align-items-center"
                  >
                    <Form.Group style={{ width: '90%' }} className="mt-4">
                      <Form.Label className="ht-label">New Password</Form.Label>
                      <Form.Control
                        className="ht-form-control"
                        name="newPassword"
                        type="password"
                        value={formSubmitProps.values.newPassword}
                        onChange={formSubmitProps.handleChange}
                        onBlur={formSubmitProps.handleBlur}
                        isInvalid={
                          formSubmitProps.touched.newPassword &&
                          formSubmitProps.errors.newPassword
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formSubmitProps.errors.newPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group style={{ width: '90%' }}>
                      <Form.Label className="ht-label">
                        Confirm Password
                      </Form.Label>
                      <Form.Control
                        className="ht-form-control"
                        name="confirmPassword"
                        type="password"
                        value={formSubmitProps.values.confirmPassword}
                        onChange={formSubmitProps.handleChange}
                        onBlur={formSubmitProps.handleBlur}
                        isInvalid={
                          formSubmitProps.touched.confirmPassword &&
                          formSubmitProps.errors.confirmPassword
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {formSubmitProps.errors.confirmPassword}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <LoginButton
                      className="ht-btn-primary mt-2 mb-2"
                      type="submit"
                    >
                      Reset Password
                    </LoginButton>
                  </Form>
                </Card.Body>
              </Card>
            </React.Fragment>
          )}
          {curStep === STEP_RESULT && (
            <React.Fragment>
              <Card>
                <Card.Body>
                  <h4 className="d-flex justify-content-center mb-4">
                    Password reset successfully
                  </h4>
                  <LoginButton
                    onclick={() => {
                      history.push('/');
                    }}
                  >
                    Okay
                  </LoginButton>
                </Card.Body>
              </Card>
            </React.Fragment>
          )}
          {curStep === STEP_EXPRIED && (
            <React.Fragment>
              <h4 className="d-flex justify-content-center">
                This link has already expired!
              </h4>
            </React.Fragment>
          )}
        </Col>
      </Row>
      {loading && (
        <HtSpinner
          spinnerPosition={{
            left: 'calc(50% - 25px)',
            top: 'calc(50% - 25px)',
          }}
        />
      )}
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

const LoginButton = styled(Button)`
  min-width: 140px;
`;

export default ResetPassword;
