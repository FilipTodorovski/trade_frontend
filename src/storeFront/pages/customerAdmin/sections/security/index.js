import React, { useState } from 'react';

import styled from 'styled-components';
import { useFormik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { changePasswordApi } from 'Apis/CustomerApis';
import { resetPasswordSchema } from 'validators';
import { PRIMARY_DARK_COLOR } from 'constants/constants';
import HtSpinner from 'admin/components/HtSpinner';
import { RunToast } from 'utils/toast';

const SecuritySection = () => {
  const [loading, setLoading] = useState(false);

  const formSubmitProps = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: resetPasswordSchema,
    onSubmit: ({ currentPassword, newPassword }) => {
      setLoading(true);
      changePasswordApi({ currentPassword, newPassword })
        .then((res) => {
          setLoading(false);
          RunToast('success', 'Password changed.');
        })
        .catch((err) => {
          setLoading(false);
          formSubmitProps.setErrors({
            currentPassword: 'Current Password is not matched.',
          });
        });
    },
  });

  return (
    <MainPanel>
      <Title>Previous Orders</Title>
      <SubTitle>Change your password.</SubTitle>
      <Form
        onSubmit={formSubmitProps.handleSubmit}
        className="d-flex flex-column align-items-center"
        style={{ width: '100%', maxWidth: '407px', margin: '0 auto' }}
      >
        <Form.Group style={{ width: '100%' }} className="mt-5">
          <Form.Label className="ht-label">Current Password</Form.Label>
          <Form.Control
            className="ht-form-control"
            name="currentPassword"
            type="password"
            value={formSubmitProps.values.currentPassword}
            onChange={formSubmitProps.handleChange}
            onBlur={formSubmitProps.handleBlur}
            isInvalid={
              formSubmitProps.touched.currentPassword &&
              formSubmitProps.errors.currentPassword
            }
            autoComplete="new-password"
          />
          <Form.Control.Feedback type="invalid">
            {formSubmitProps.errors.currentPassword}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group style={{ width: '100%' }} className="mt-5">
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
        <UpdateButton
          className="ht-btn-primary mt-5"
          type="submit"
          disabled={Object.keys(formSubmitProps.errors).length > 0}
        >
          Change Password
        </UpdateButton>
      </Form>
      {loading && <HtSpinner />}
    </MainPanel>
  );
};

const MainPanel = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 100%;
  background: #fff;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 33px 50px;
  min-height: 592px;
`;

const Title = styled.h1`
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 41px;
  color: ${PRIMARY_DARK_COLOR};
  margin: 0 0 12px 0;
  text-align: center;
`;

const SubTitle = styled.h4`
  font-style: normal;
  font-weight: normal;
  font-size: 19px;
  line-height: 23px;
  color: ${PRIMARY_DARK_COLOR};
  margin: 0 0 21px 0;
  text-align: center;
`;

const UpdateButton = styled(Button)`
  padding: 12px 24px;
`;

export default SecuritySection;
