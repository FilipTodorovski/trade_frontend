import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import _ from 'lodash';
import moment from 'moment';
import styled from 'styled-components';
import { Formik, Form as FormikForm } from 'formik';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import HtSpinner from '../../../../components/HtSpinner';
import SuccessModal from 'sharedComponents/SuccessModal';
import { RunToast } from 'utils/toast';
import { getRegularPostCodeStr, getAddressList } from 'utils/address';

import {
  accountHolderIndividualValidationSchema,
  validatePostCode,
} from 'validators';

import ApiService from 'admin/ApiService';
import { getAddresses as getAddressFromElasticApi } from 'Apis/Elastic';
import { getAddresses as getAddressFromFirstClassApi } from 'Apis/SharedApis';

import {
  ADYEN_ACCOUNT_LEGAL_ENTITY,
  LEGAL_ENTITY_OPTIONS,
  getToken,
  PRIMARY_ACTIVE_COLOR,
  SECOND_GREY_COLOR,
} from 'constants/constants';

import CircleISvg from 'assets/images/circle-i.svg';

const IndividualAccountHolder = ({ setBusinessLegalType, adyenInfo }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addressInfo, setAddressInfo] = useState({});
  const [selectedFormData, setSelectedFormData] = useState({
    postalCode: {
      value: '',
      validate: true,
      errorMsg: '',
    },
    address: {
      value: {},
      validate: true,
      errorMsg: '',
    },
  });
  const [errorData, setErrorData] = useState([]);

  const handleChangeLegalEntity = (e) => {
    if (e.value === ADYEN_ACCOUNT_LEGAL_ENTITY.BUSINESS) setBusinessLegalType();
  };

  const handleClickLookUp = async () => {
    const postalCodeTemp = validatePostCode(selectedFormData.postalCode.value);

    if (!postalCodeTemp.validate) {
      setAddressInfo({});
      setSelectedFormData({
        ...selectedFormData,
        postalCode: {
          ...postalCodeTemp,
        },
        address: {
          value: {},
          validate: true,
          errorMsg: '',
        },
      });
    } else {
      getAddressFromElasticApi(getRegularPostCodeStr(postalCodeTemp.value))
        .then((elasticRes) => {
          setAddressInfo({ ...elasticRes.hits.hits[0]._source });
          setSelectedFormData({
            ...selectedFormData,
            address: {
              value: {},
              validate: true,
              errorMsg: '',
            },
          });
        })
        .catch((errorElastic) => {
          getAddressFromFirstClassApi(postalCodeTemp.value)
            .then((res) => {
              if (res.data.success) {
                setAddressInfo({ ...res.data.address });
                setSelectedFormData({
                  ...selectedFormData,
                  address: {
                    value: {},
                    validate: true,
                    errorMsg: '',
                  },
                });
              }
            })
            .catch((error) => {
              if (error.response.status === 401) {
                setAddressInfo({});
                setSelectedFormData({
                  ...selectedFormData,
                  postalCode: {
                    ...selectedFormData.postalCode,
                    validate: false,
                    errorMsg:
                      'Sorry we did not recognise that postcode, check and try again.',
                  },
                  address: {
                    value: {},
                    validate: true,
                    errorMsg: '',
                  },
                });
              }
            });
        });
    }
  };

  const checkExtraValidate = () => {
    const tempSelectFormData = { ...selectedFormData };

    if (tempSelectFormData.postalCode.value.length === 0)
      tempSelectFormData.postalCode = {
        value: '',
        validate: false,
        errorMsg: 'Required field',
      };

    if (Object.keys(tempSelectFormData.address.value).length === 0)
      tempSelectFormData.address = {
        value: {},
        validate: false,
        errorMsg: 'Required field',
      };

    setSelectedFormData({
      ...tempSelectFormData,
    });

    return (
      tempSelectFormData.postalCode.validate &&
      tempSelectFormData.address.validate
    );
  };

  const showError = () => {
    return errorData.map((item, idx) => {
      let errorDescription;
      const { fieldName } = item.fieldType;
      if (fieldName === 'branchCode') {
        if (item.errorDescription === 'sort code is not 6 digits long')
          errorDescription = 'Sort code should be 6 digits long.';
        else errorDescription = item.errorDescription;
      } else if (fieldName === 'accountNumber') {
        if (item.errorDescription === 'not 8 digits long')
          errorDescription = 'AccountNumber should be 8 digits long.';
        else errorDescription = `AccountNumber ${item.errorDescription}`;
      } else errorDescription = item.errorDescription;

      return (
        <Alert key={idx} variant="danger">
          {errorDescription}
        </Alert>
      );
    });
  };

  const handleFormDataSubmit = async (values) => {
    if (
      !selectedFormData.address.validate ||
      !selectedFormData.postalCode.validate
    )
      return;

    setLoading(true);
    setErrorData([]);

    ApiService({
      method: 'PUT',
      url: '/adyen/updateAccountHolder',
      data: {
        accountHolderCode: _.get(adyenInfo, 'account_holder_code', ''),
        accountHolderDetails: {
          individualDetails: {
            personalData: {
              dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'),
            },
          },
          address: {
            country: 'GB',
            street: _.get(selectedFormData.address.value, 'street', ''),
            houseNumberOrName: selectedFormData.address.value.value,
            // city: _.get(addressInfo, 'city', ''),
            city: 'PASSED',
            postalCode: selectedFormData.postalCode.value,
          },
          bankAccountDetails: [
            {
              accountNumber: values.accountNumber,
              branchCode: values.branchCode,
              countryCode: 'GB',
              currencyCode: 'GBP',
              ownerName: 'TestData',
            },
          ],
          fullPhoneNumber: `+44${values.phoneNumber}`,
        },
      },
      ...getToken(),
    })
      .then((res) => {
        setLoading(false);
        setShowSuccessModal(true);
      })
      .catch((err) => {
        if (err.response.data.error.err) {
          setErrorData([...err.response.data.error.err.invalidFields]);
        }
        RunToast('error', 'Adyen Accountholder update failed.');
        setLoading(false);
      });
  };

  return (
    <>
      {showError()}
      <Formik
        initialValues={{
          phoneNumber: '',
          branchCode: '',
          accountNumber: '',
          dateOfBirth: '',
        }}
        validationSchema={accountHolderIndividualValidationSchema}
        onSubmit={(values) => {
          handleFormDataSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          setFieldValue,
          handleBlur,
          handleSubmit,
        }) => (
          <FormikForm onSubmit={handleSubmit}>
            <StyledCard className="ht-card">
              <h3 className="card-title" style={{ marginBottom: '24px' }}>
                Company Details
              </h3>
              <Row>
                <Col md="6">
                  <Form.Group>
                    <Select
                      name="legalEntity"
                      options={LEGAL_ENTITY_OPTIONS}
                      classNamePrefix="select"
                      className="ht-selector"
                      placeholder="Select Legal Entity"
                      value={LEGAL_ENTITY_OPTIONS[0]}
                      onChange={handleChangeLegalEntity}
                    />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <CompanyDescription>
                    <img src={CircleISvg} alt="Circle I" />
                    <p>
                      If you’re a sole trader, you run your own business as an
                      individual and are self-employed. You do not own a limited
                      company.
                      <br />
                      <br />
                      You are personally responsible for your own taxes and you
                      dont have any registered company name. <br />
                      <br />
                      If you’re a Limited Company, Partnership or other please
                      select from above. <br />
                      <br />
                      If unsure the correct company type. Ask your accountant
                      (if you have one).
                      <br />
                      <br />
                    </p>
                  </CompanyDescription>
                </Col>
              </Row>
            </StyledCard>
            <StyledCard className="ht-card">
              <h3 className="card-title">Business Details</h3>
              <p className="circle-i-description">
                <img src={CircleISvg} alt="circle i" />
                This is the registered business address and would typically
                match your bank account.
              </p>
              <Row>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">Postcode</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="postcode"
                      value={selectedFormData.postalCode.value}
                      onChange={(e) => {
                        setSelectedFormData({
                          ...selectedFormData,
                          postalCode: {
                            ...selectedFormData.postalCode,
                            value: e.target.value,
                          },
                        });
                      }}
                      onBlur={(e) => {
                        setSelectedFormData({
                          ...selectedFormData,
                          postalCode: {
                            ...validatePostCode(e.target.value),
                          },
                        });
                      }}
                      isInvalid={!selectedFormData.postalCode.validate}
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {selectedFormData.postalCode.errorMsg}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <LookUpButton
                    className="ht-btn-primary"
                    onClick={handleClickLookUp}
                  >
                    Lookup
                  </LookUpButton>
                </Col>
                {selectedFormData.postalCode.validate &&
                  selectedFormData.postalCode.value.length > 0 &&
                  getAddressList(addressInfo).length > 0 && (
                    <Col md="6">
                      <Form.Group>
                        <Form.Label className="ht-label">Address</Form.Label>
                        <Select
                          name="legalEntity"
                          options={getAddressList(addressInfo)}
                          value={selectedFormData.address.value}
                          onChange={(e) => {
                            setSelectedFormData({
                              ...selectedFormData,
                              address: {
                                value: e,
                                validate: true,
                                errorMsg: '',
                              },
                            });
                          }}
                          classNamePrefix="select"
                          className={`ht-selector ${
                            selectedFormData.address.validate
                              ? ''
                              : 'invalidate'
                          }`}
                          placeholder="Select a address"
                        />
                        {!selectedFormData.address.validate && (
                          <div className="ht-invalid-label">Required field</div>
                        )}
                      </Form.Group>
                    </Col>
                  )}
              </Row>
            </StyledCard>
            {/* persona details */}
            <StyledCard className="ht-card">
              <h3 className="card-title" style={{ marginBottom: '16px' }}>
                Personal Details
              </h3>
              {/* <p className="circle-i-description">
                <img src={CircleISvg} alt="Circle I" />
                Please use your full first & last legal name, this would be the
                name on your Driving Licence, Passport check spelling as this
                may cause issues for payouts.
              </p> */}
              <Row>
                {/* <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">First Name</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="firstName"
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
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">Last Name</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="lastName"
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
                </Col> */}
                <Col md="6">
                  <DatePickerFormGroup
                    className={
                      errors.dateOfBirth && touched.dateOfBirth ? 'invalid' : ''
                    }
                  >
                    <Form.Label className="ht-label">Date of birth</Form.Label>
                    <DatePicker
                      name="dateOfBirth"
                      selected={values.dateOfBirth}
                      dateFormat="dd-MM-yyyy"
                      onChange={(e) => {
                        setFieldValue('dateOfBirth', e);
                      }}
                      onBlur={handleBlur}
                      autocomplete="off"
                    />
                    {errors.dateOfBirth && touched.dateOfBirth && (
                      <div className="ht-invalid-label">
                        Required date format DD-MM-YEAR
                      </div>
                    )}
                  </DatePickerFormGroup>
                </Col>
                <Col md="6">
                  <BGPhoneGroup style={{ position: 'relative' }}>
                    <Form.Label className="ht-label">Phone Number</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(e) => {
                        setFieldValue(
                          'phoneNumber',
                          e.target.value.replace(/\D/, '')
                        );
                      }}
                      onBlur={handleBlur}
                      isInvalid={touched.phoneNumber && errors.phoneNumber}
                      style={{ position: 'relative' }}
                      autocomplete="off"
                    />
                    <div className="pretent-div">+44</div>
                    <Form.Control.Feedback type="invalid">
                      {errors.phoneNumber}
                    </Form.Control.Feedback>
                  </BGPhoneGroup>
                </Col>
              </Row>
            </StyledCard>
            <StyledCard className="ht-card">
              <h3 className="card-title">Banking Details</h3>
              <p className="circle-i-description">
                <img src={CircleISvg} alt="Circle I" />
                This is where your funds will be sent
              </p>
              <Row>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">Sort Code</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="branchCode"
                      value={values.branchCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.branchCode && errors.branchCode}
                      autocomplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.branchCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">Account Number</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="accountNumber"
                      value={values.accountNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.accountNumber && errors.accountNumber}
                      autocomplete="off"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.accountNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </StyledCard>
            {/* term card */}
            <StyledCard className="ht-card">
              <h3 className="card-title" style={{ margin: '0 0 16px 0' }}>
                Terms and Conditions
              </h3>
              <p className="description">
                By using Trade Sprint Payments you agree to the{' '}
                <span
                  style={{ color: PRIMARY_ACTIVE_COLOR, cursor: 'pointer' }}
                  role="button"
                >
                  terms of service
                </span>
              </p>
            </StyledCard>
            <div className="d-flex">
              <SubmitButton
                className="ht-btn-primary"
                onClick={checkExtraValidate}
                type="submit"
              >
                Update Account Signup
              </SubmitButton>
            </div>
          </FormikForm>
        )}
      </Formik>
      {loading && <HtSpinner />}
      {showSuccessModal && (
        <SuccessModal
          show
          title="Your adyen account holder updated successfully."
          hideModal={() => {
            history.push('/settings/payments');
          }}
        />
      )}
    </>
  );
};

const StyledCard = styled.div`
  padding: 37px 40px 32px;
  width: 100%;
  margin-bottom: 30px;
  .card-title {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
  }
  .form-group {
    margin: 0 0 45px 0;
    .ht-label {
      margin-bottom: 15px;
    }
  }
  .circle-i-description {
    display: flex;
    align-items: flex-start;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    margin: 20px 0 42px;
    img {
      margin-right: 10px;
    }
  }
  .description {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: ${SECOND_GREY_COLOR};
    margin: 0 0 24px 0;
  }
`;

const DatePickerFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
  position: relative;
  input[type='text'] {
    width: 100%;
    border-radius: 12px;
    border: solid 1.5px rgba(0, 0, 0, 0.1);
    padding: 17px 18px;
    min-height: 53px;
    font-family: 'Inter', sans-serif;
    font-size: 1rem;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    letter-spacing: normal;
    color: #66657e;
    line-height: 17px;
    height: auto;
    font-weight: 600;
    outline: none;
    &:focus {
      border-color: #213f5e;
      box-shadow: 0 0 0 0.2rem rgba(241, 246, 255, 1);
    }
  }
  &.invalid {
    input[type='text'] {
      border-color: #d4351c;
    }
  }
`;

const SubmitButton = styled(Button)`
  margin: 23px 0 0 auto;
`;

const LookUpButton = styled(Button)`
  width: 134px;
  margin: 31px 0 0 0;
`;

const CompanyDescription = styled.div`
  display: flex;
  img {
    width: 16px;
    height: 16px;
    margin-right: 15px;
  }
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 17px;
    margin: 0;
  }
`;

const BGPhoneGroup = styled(Form.Group)`
  .ht-form-control {
    padding-left: 58px;
  }
  .pretent-div {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
    position: absolute;
    left: 0;
    top: 34px;
    width: 50px;
    height: 51px;
    display: flex;
    border-right: solid 1.5px rgba(0, 0, 0, 0.1);
  }
`;
export default IndividualAccountHolder;
