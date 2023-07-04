import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styled from 'styled-components';
import { useFormik } from 'formik';
import { Form, Button, Row, Col } from 'react-bootstrap';

import { updateUserDetailsApi } from '../../../Apis/CustomerApis';
import { customerPersonalDetailsValidate } from '../../../validators';
import { PRIMARY_DARK_COLOR } from '../../../constants';
import HtSpinner from '../../../admin/components/HtSpinner';
import { RunToast } from '../../../utils/toast';
import { SET_CUSTOMER_USER } from '../../../storeFront/actions/actionTypes';

const PersonalDetailsSection = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { customerInfo } = useSelector((state) => ({
    customerInfo: state.storeFrontReducer.user,
  }));

  const formSubmitProps = useFormik({
    initialValues: {
      first_name: customerInfo.user.first_name,
      last_name: customerInfo.user.last_name,
      email: customerInfo.user.email,
      phone_number: customerInfo.user.phone_number,
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: customerPersonalDetailsValidate,
    onSubmit: ({ first_name, last_name, email, phone_number }) => {
      setLoading(true);
      updateUserDetailsApi(customerInfo.user.id, {
        first_name,
        last_name,
        email,
        phone_number,
      })
        .then((res) => {
          setLoading(false);
          dispatch({
            type: SET_CUSTOMER_USER,
            payload: {
              token: localStorage.getItem('customer-token'),
              user: {
                ...customerInfo,
                first_name,
                last_name,
                email,
                phone_number,
              },
            },
          });
          RunToast('success', 'Personal details updated.');
        })
        .catch((err) => {
          setLoading(false);
        });
    },
  });

  return (
    <MainPanel>
      <Title>Personal Details</Title>
      <Form
        onSubmit={formSubmitProps.handleSubmit}
        className="d-flex flex-column align-items-stretch"
        style={{ width: '100%' }}
      >
        <Row>
          <Form.Group style={{ width: '100%' }} as={Col} sm="6">
            <Form.Label className="ht-label">First Name</Form.Label>
            <Form.Control
              className="ht-form-control"
              name="first_name"
              type="text"
              value={formSubmitProps.values.first_name}
              onChange={formSubmitProps.handleChange}
              onBlur={formSubmitProps.handleBlur}
              isInvalid={
                formSubmitProps.touched.first_name &&
                formSubmitProps.errors.first_name
              }
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {formSubmitProps.errors.first_name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group style={{ width: '100%' }} as={Col} sm="6">
            <Form.Label className="ht-label">Last Name</Form.Label>
            <Form.Control
              className="ht-form-control"
              name="last_name"
              type="text"
              value={formSubmitProps.values.last_name}
              onChange={formSubmitProps.handleChange}
              onBlur={formSubmitProps.handleBlur}
              isInvalid={
                formSubmitProps.touched.last_name &&
                formSubmitProps.errors.last_name
              }
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {formSubmitProps.errors.last_name}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Row className="mt-5">
          <Form.Group style={{ width: '100%' }} as={Col} sm="6">
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
          <Form.Group style={{ width: '100%' }} as={Col} sm="6">
            <Form.Label className="ht-label">Phone Number</Form.Label>
            <Form.Control
              className="ht-form-control"
              name="phone_number"
              type="text"
              value={formSubmitProps.values.phone_number}
              onChange={(e) => {
                formSubmitProps.setFieldValue(
                  'phone_number',
                  e.target.value.replace(/\D/, '')
                );
              }}
              onBlur={formSubmitProps.handleBlur}
              isInvalid={
                formSubmitProps.touched.phone_number &&
                formSubmitProps.errors.phone_number
              }
              autoComplete="new-password"
            />
            <Form.Control.Feedback type="invalid">
              {formSubmitProps.errors.phone_number}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <UpdateButton
          className="ht-btn-primary mt-5 ml-auto"
          type="submit"
          disabled={Object.keys(formSubmitProps.errors).length > 0}
        >
          Update
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
  margin: 0 0 46px 0;
`;

const UpdateButton = styled(Button)`
  padding: 12px 24px;
`;

export default PersonalDetailsSection;
