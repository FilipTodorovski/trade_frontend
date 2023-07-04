import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import _ from 'lodash';
import styled from 'styled-components';
import moment from 'moment';
import { Formik, Form as FormikForm } from 'formik';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import Select from 'react-select';

import HtSpinner from '../../../../components/HtSpinner';
import Checkbox from '../../../../components/Checkbox';
import CustomRadio from 'sharedComponents/CustomRadio';
import SuccessModal from 'sharedComponents/SuccessModal';
import { RunToast } from 'utils/toast';
import { getRegularPostCodeStr, getAddressList } from 'utils/address';
import {
  accountHolderBusinesValidationSchema,
  validatePostCode,
  validateString,
  validateEmail,
} from 'validators';

import ApiService from 'admin/ApiService';
import { getAddresses as getAddressFromElasticApi } from 'Apis/Elastic';
import { getAddresses as getAddressFromFirstClassApi } from 'Apis/SharedApis';

import {
  ADYEN_ACCOUNT_LEGAL_ENTITY,
  LEGAL_ENTITY_OPTIONS,
  getToken,
  SECOND_GREY_COLOR,
  PRIMARY_ACTIVE_COLOR,
  BUSINESS_OWNERS,
} from 'constants/constants';

import CircleISvg from 'assets/images/circle-i.svg';

const ANOTHER_PERSON_KEYS = [
  'firstName',
  // 'jobTitle',
  'lastName',
  'email',
  'dateOfBirth',
  'city',
  'postalCode',
];

const BusinessAccountHolder = ({ setIndividualLegalType, adyenInfo }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [addressInfo, setAddressInfo] = useState({});
  const [errorData, setErrorData] = useState([]);

  const { userInfo } = useSelector((state) => ({
    userInfo: state.userReducer.user,
  }));

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
    more25: false,
    ownerValue: BUSINESS_OWNERS.ONLY_OWNER,
    anotherPersons: [],
  });

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
        .catch((errElastic) => {
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
            .catch((errFirstClass) => {
              if (errFirstClass.response.status === 401) {
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

  const addOnePerson = () => {
    setSelectedFormData({
      ...selectedFormData,
      ownerValue: BUSINESS_OWNERS.ADD_ANOTHER,
      anotherPersons: [
        ...selectedFormData.anotherPersons,
        {
          firstName: { value: '', validate: true, errorMsg: '' },
          lastName: { value: '', validate: true, errorMsg: '' },
          // jobTitle: { value: '', validate: true, errorMsg: '' },
          email: { value: '', validate: true, errorMsg: '' },
          dateOfBirth: { value: '', validate: true, errorMsg: '' },
          address: { value: '', validate: true, errorMsg: '' },
          city: { value: '', validate: true, errorMsg: '' },
          postalCode: { value: '', validate: true, errorMsg: '' },
          anotherMore25: { value: false },
          memberOfBusiness: { value: false },
          controllingManager: { value: false },
        },
      ],
    });
  };

  const checkPersonsValidate = (nIndex, key, value) => {
    const personData = selectedFormData.anotherPersons.map((item, idx) => {
      if (nIndex === idx) {
        const itemTemp = { ...item };
        if (key === 'dateOfBirth') {
          if (typeof itemTemp[key].value === 'object') {
            itemTemp[key] = {
              value: itemTemp[key].value,
              validate: true,
              errorMsg: '',
            };
          } else {
            itemTemp[key] = {
              value,
              validate: false,
              errorMsg: 'Required field',
            };
          }
        } else if (key === 'email') {
          itemTemp[key] = validateEmail(value);
        } else itemTemp[key] = validateString(value);
        return itemTemp;
      }
      return item;
    });

    setSelectedFormData({
      ...selectedFormData,
      anotherPersons: [...personData],
    });

    let validate = true;
    personData.forEach((item) => {
      if (validate)
        Object.keys(item).forEach((itemOne) => {
          if (validate) validate = item[itemOne].validate;
        });
    });
    return validate;
  };

  const handleClickRemovePerson = () => {
    setSelectedFormData({
      ...selectedFormData,
      ownerValue: BUSINESS_OWNERS.ONLY_OWNER,
      anotherPersons: [],
    });
  };

  const handleChangePersonData = (nIndex, key, value) => {
    const personData = selectedFormData.anotherPersons.map((item, idx) => {
      if (nIndex === idx) {
        const personTemp = { ...item };
        if (key === 'dateOfBirth') {
          personTemp[key] = {
            value,
            validate: !!value,
            errorMsg: !value ? 'Required field' : '',
          };
        } else personTemp[key].value = value;
        return personTemp;
      }
      return item;
    });

    setSelectedFormData({
      ...selectedFormData,
      anotherPersons: [...personData],
    });
  };

  const handleChangeLegalEntity = (e) => {
    if (e.value === ADYEN_ACCOUNT_LEGAL_ENTITY.INDIVIDUAL)
      setIndividualLegalType();
  };

  const formatExtraValidates = (e) => {
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

    // check personData validate
    const anotherPersonTemp = selectedFormData.anotherPersons.map((item) => {
      const itemTemp = { ...item };
      ANOTHER_PERSON_KEYS.forEach((itemOne) => {
        if (itemOne === 'dateOfBirth') {
          if (typeof item[itemOne].value === 'object') {
            itemTemp.dateOfBirth = {
              value: itemTemp.dateOfBirth.value,
              validate: true,
              errorMsg: '',
            };
          } else {
            itemTemp.dateOfBirth = {
              value: itemTemp.dateOfBirth.value,
              validate: false,
              errorMsg: 'Required field',
            };
          }
        } else if (itemOne === 'email') {
          itemTemp[itemOne] = validateEmail(itemTemp[itemOne].value);
        } else {
          itemTemp[itemOne] = validateString(itemTemp[itemOne].value);
        }
      });
      return itemTemp;
    });
    tempSelectFormData.anotherPersons = [...anotherPersonTemp];
    setSelectedFormData({
      ...tempSelectFormData,
    });
  };

  const checkExtraValidate = () => {
    let validate = true;

    const tempSelectFormData = { ...selectedFormData };

    if (tempSelectFormData.postalCode.value.length === 0) return false;
    if (Object.keys(tempSelectFormData.address.value).length === 0)
      return false;

    selectedFormData.anotherPersons.forEach((item) => {
      if (validate)
        ANOTHER_PERSON_KEYS.forEach((itemOne) => {
          if (validate) validate = item[itemOne].validate;
        });
    });
    return validate;
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
    if (!checkExtraValidate()) return;
    setLoading(true);
    // make shareholders value
    const shareHolders = [
      {
        name: {
          firstName: values.firstName,
          gender: 'UNKNOWN',
          // lastName: values.lastName,
          lastName: 'TestData',
        },
        address: {
          street: values.personalAddress,
          // city: values.personalCity,
          city: 'PASSED',
          postalCode: values.personalPostCode,
          country: 'GB',
          houseNumberOrName: '11',
        },
        email: userInfo.email,
        personalData: {
          dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'),
        },
        fullPhoneNumber: `+44${values.phoneNumber}`,
      },
    ];

    if (selectedFormData.ownerValue === BUSINESS_OWNERS.ADD_ANOTHER) {
      const { anotherPersons } = selectedFormData;
      shareHolders.push({
        name: {
          firstName: anotherPersons[0].firstName.value,
          // lastName: anotherPersons.lastName,
          lastName: 'TestData',
          gender: 'UNKNOWN',
        },
        address: {
          street: anotherPersons[0].address.value,
          // city: anotherPersons.city,
          city: 'PASSED',
          postalCode: anotherPersons[0].postalCode.value,
          houseNumberOrName: '11',
          country: 'GB',
        },
        email: anotherPersons[0].email.value,
        personalData: {
          dateOfBirth: moment(anotherPersons[0].dateOfBirth.value).format(
            'YYYY-MM-DD'
          ),
        },
      });
    }

    setErrorData([]);

    ApiService({
      method: 'PUT',
      url: '/adyen/updateAccountHolder',
      data: {
        accountHolderCode: _.get(adyenInfo, 'account_holder_code', ''),
        accountHolderDetails: {
          address: {
            country: 'GB',
            street: _.get(selectedFormData.address.value, 'street', ''),
            houseNumberOrName: selectedFormData.address.value.value,
            // city: values.city,
            city: 'PASSED',
            postalCode: selectedFormData.postalCode.value,
          },
          businessDetails: {
            legalBusinessName: values.legalBusinessName,
            registrationNumber: values.registrationNumber,
            shareholders: [...shareHolders],
          },
          bankAccountDetails: [
            {
              accountNumber: values.accountNumber,
              branchCode: values.branchCode,
              countryCode: 'GB',
              currencyCode: 'EUR',
              ownerName: 'TestData',
            },
          ],
        },
        legalEntity: 'Business',
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
          legalBusinessName: '',
          registrationNumber: '',
          dateOfBirth: '',
          phoneNumber: '',
          firstName: '',
          lastName: '',
          personalAddress: '',
          personalCity: '',
          personalPostCode: '',
          branchCode: '',
          accountNumber: '',
        }}
        validationSchema={accountHolderBusinesValidationSchema}
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
              <h4 className="card-title" style={{ marginBottom: '24px' }}>
                Company Details
              </h4>
              <Row>
                <Col md="6">
                  <Row>
                    <Form.Group as={Col} sm="12">
                      <Select
                        name="legalEntity"
                        options={LEGAL_ENTITY_OPTIONS}
                        classNamePrefix="select"
                        className="ht-selector"
                        placeholder="Select Legal Entity"
                        value={LEGAL_ENTITY_OPTIONS[1]}
                        onChange={handleChangeLegalEntity}
                      />
                    </Form.Group>
                    <Form.Group as={Col} ms="12">
                      <Form.Label className="ht-label">
                        Legal Business Name
                      </Form.Label>
                      <Form.Control
                        className="ht-form-control"
                        name="legalBusinessName"
                        value={values.legalBusinessName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.legalBusinessName && errors.legalBusinessName
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.legalBusinessName}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm="12">
                      <Form.Label className="ht-label">
                        Company House Registration Number (CRN) Optional
                      </Form.Label>
                      <Form.Control
                        className="ht-form-control"
                        name="registrationNumber"
                        value={values.registrationNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={
                          touched.registrationNumber &&
                          errors.registrationNumber
                        }
                        autoComplete="new-password"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.registrationNumber}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                </Col>
                <Col md="6">
                  <div className="d-flex" style={{ alignItems: 'flex-start' }}>
                    <img
                      src={CircleISvg}
                      alt="Circle I"
                      style={{
                        marginRight: '15px',
                        width: '20px',
                        height: '20px',
                      }}
                    />
                    <p style={{ fontSize: '14px' }}>
                      A Limited Company is a business structure that means you
                      have incorporated your company at Companies House.
                      <br />
                      <br />
                      You can check by
                      <br />
                      <span style={{ color: PRIMARY_ACTIVE_COLOR }}>
                        Search Companies House Register
                      </span>
                      <br />
                      <br />
                      Your business will have issued shares.
                      <br />
                      <br />
                      If unsure the correct company type.
                      <br />
                      Ask your accountant (if you have one).
                      <br />
                    </p>
                  </div>
                </Col>
              </Row>
            </StyledCard>

            {/* business details */}
            <StyledCard className="ht-card">
              <h4 className="card-title">Business Details</h4>
              <p className="circle-i-description">
                <img src={CircleISvg} alt="circle i" />
                This is the registered business address and would typically
                match your bank account.
              </p>
              <Row>
                <Col md="6">
                  <Row>
                    <Form.Group as={Col} sm="12">
                      <Form.Label className="ht-label">Postcode</Form.Label>
                      <Form.Control
                        className="ht-form-control"
                        name="businessdetail-postalcode"
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
                    {selectedFormData.postalCode.validate &&
                      selectedFormData.postalCode.value.length > 0 &&
                      getAddressList(addressInfo).length > 0 && (
                        <Form.Group as={Col} sm="12">
                          <Form.Label className="ht-label">Address</Form.Label>
                          <Select
                            name="businessdetail-address"
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
                            <div className="ht-invalid-label">
                              Required field
                            </div>
                          )}
                        </Form.Group>
                      )}
                    <Col sm="12">
                      <BGPhoneGroup style={{ position: 'relative' }}>
                        <Form.Label className="ht-label">
                          Phone Number
                        </Form.Label>
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
                          autoComplete="new-password"
                        />
                        <div className="pretent-div">+44</div>
                        <Form.Control.Feedback type="invalid">
                          {errors.phoneNumber}
                        </Form.Control.Feedback>
                      </BGPhoneGroup>
                    </Col>
                  </Row>
                </Col>
                <Col md="6">
                  <LookUpButton
                    className="ht-btn-primary"
                    onClick={handleClickLookUp}
                  >
                    Lookup
                  </LookUpButton>
                </Col>
              </Row>
            </StyledCard>

            {/* persona details */}
            <StyledCard className="ht-card">
              <h4 className="card-title" style={{ marginBottom: '16px' }}>
                Personal Details
              </h4>
              <p className="circle-i-description">
                <img src={CircleISvg} alt="circle i" />
                Please use your full first & last legal name, this would be the
                name on your Driving Licence, Passport check spelling as this
                may cause issues for payouts.
              </p>
              <Row>
                <Form.Group as={Col} md="6">
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

                <Form.Group as={Col} md="6">
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
                <Col md="6">
                  <DatePickerFormGroup
                    className={
                      errors.dateOfBirth && touched.dateOfBirth ? 'invalid' : ''
                    }
                  >
                    <Form.Label className="ht-label">Date of birth</Form.Label>
                    <DatePicker
                      selected={values.dateOfBirth}
                      dateFormat="yyyy-MM-dd"
                      onChange={(e) => {
                        setFieldValue('dateOfBirth', e);
                      }}
                      onBlur={handleBlur}
                    />
                    {errors.dateOfBirth && touched.dateOfBirth && (
                      <div className="ht-invalid-label">
                        Required date format YYYY-MM-DD
                      </div>
                    )}
                  </DatePickerFormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="12">
                  <Form.Group>
                    <Form.Label className="ht-label">Address</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="personalAddress"
                      value={values.personalAddress}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.personalAddress && errors.personalAddress
                      }
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.personalAddress}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">City</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="personalCity"
                      value={values.personalCity}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.personalCity && errors.personalCity}
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.personalCity}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">Postcode</Form.Label>
                    <Form.Control
                      className="ht-form-control"
                      name="personalPostCode"
                      value={values.personalPostCode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={
                        touched.personalPostCode && errors.personalPostCode
                      }
                      autoComplete="new-password"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.personalPostCode}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <Form.Group>
                    <Form.Label className="ht-label">Country</Form.Label>
                    <Select
                      className="ht-selector group-selector"
                      classNamePrefix="select"
                      value={{ value: 'GB', label: 'United Kingdom' }}
                      option={[{ value: 'GB', label: 'United Kingdom' }]}
                      isDisabled
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group>
                    <Checkbox
                      id="more25"
                      checked={selectedFormData.more25}
                      onChange={(e) => {
                        setSelectedFormData({
                          ...selectedFormData,
                          more25: e.target.checked,
                        });
                      }}
                    >
                      This person owns more than 25% of the business
                    </Checkbox>
                  </Form.Group>
                </Col>
              </Row>
            </StyledCard>
            <StyledCard className="ht-card">
              <h4 className="card-title" style={{ marginBottom: '16px' }}>
                Additional Owners and Diretors
              </h4>
              <p className="description">
                Add any individuals who own at least 25% of the business, all
                executives, and all members of the board of directors.
              </p>
              <Form.Group>
                <Row>
                  <Col md={12}>
                    <CustomRadio
                      id={BUSINESS_OWNERS.ONLY_OWNER}
                      name={BUSINESS_OWNERS.ONLY_OWNER}
                      label={BUSINESS_OWNERS.ONLY_OWNER}
                      checked={
                        selectedFormData.ownerValue ===
                        BUSINESS_OWNERS.ONLY_OWNER
                      }
                      onChange={(e) => {
                        setSelectedFormData({
                          ...selectedFormData,
                          ownerValue: BUSINESS_OWNERS.ONLY_OWNER,
                          anotherPersons: [],
                        });
                      }}
                    />
                  </Col>
                  <Col>
                    <CustomRadio
                      id={BUSINESS_OWNERS.ADD_ANOTHER}
                      name={BUSINESS_OWNERS.ADD_ANOTHER}
                      label={BUSINESS_OWNERS.ADD_ANOTHER}
                      checked={
                        selectedFormData.ownerValue ===
                        BUSINESS_OWNERS.ADD_ANOTHER
                      }
                      onChange={(e) => {
                        addOnePerson();
                      }}
                    />
                  </Col>
                </Row>
                {selectedFormData.ownerValue === BUSINESS_OWNERS.ADD_ANOTHER &&
                  selectedFormData.anotherPersons.map((item, nIndex) => {
                    return (
                      <Row>
                        <Col md={12}>
                          <RemovePersonButton
                            role="button"
                            onClick={handleClickRemovePerson}
                          >
                            Remove person
                          </RemovePersonButton>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="ht-label">
                              First Name
                            </Form.Label>
                            <Form.Control
                              name={`firstName${nIndex}`}
                              className="ht-form-control"
                              isInvalid={!item.firstName.validate}
                              value={item.firstName.value}
                              onChange={(e) => {
                                handleChangePersonData(
                                  nIndex,
                                  'firstName',
                                  e.target.value
                                );
                              }}
                              onBlur={(e) => {
                                checkPersonsValidate(
                                  nIndex,
                                  'firstName',
                                  e.target.value
                                );
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {item.firstName.errorMsg}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="ht-label">
                              Last Name
                            </Form.Label>
                            <Form.Control
                              name={`lastName${nIndex}`}
                              className="ht-form-control"
                              isInvalid={!item.lastName.validate}
                              value={item.lastName.value}
                              onChange={(e) => {
                                handleChangePersonData(
                                  nIndex,
                                  'lastName',
                                  e.target.value
                                );
                              }}
                              onBlur={(e) => {
                                checkPersonsValidate(
                                  nIndex,
                                  'lastName',
                                  e.target.value
                                );
                              }}
                            />
                            <Form.Control.Feedback type="invalid">
                              {item.lastName.errorMsg}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        {/* <Form.Group as={Col} md={12}>
                          <Form.Label className="ht-label">
                            Job Title
                          </Form.Label>
                          <Form.Control
                            name={`jobTitle${nIndex}`}
                            className="ht-form-control"
                            isInvalid={!item.jobTitle.validate}
                            value={item.jobTitle.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'jobTitle',
                                e.target.value
                              );
                            }}
                            onBlur={(e) => {
                              checkPersonsValidate(
                                nIndex,
                                'jobTitle',
                                e.target.value
                              );
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {item.lastName.errorMsg}
                          </Form.Control.Feedback>
                        </Form.Group> */}
                        <Form.Group as={Col} md={12}>
                          <Form.Label className="ht-label">Email</Form.Label>
                          <Form.Control
                            name={`email${nIndex}`}
                            className="ht-form-control"
                            isInvalid={!item.email.validate}
                            value={item.email.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'email',
                                e.target.value
                              );
                            }}
                            onBlur={(e) => {
                              checkPersonsValidate(
                                nIndex,
                                'email',
                                e.target.value
                              );
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {item.email.errorMsg}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Col md={12}>
                          <DatePickerFormGroup
                            className={
                              item.dateOfBirth.validate ? '' : 'invalid'
                            }
                          >
                            <Form.Label className="ht-label">
                              Date of birth
                            </Form.Label>
                            <DatePicker
                              selected={item.dateOfBirth.value}
                              dateFormat="yyyy-MM-dd"
                              onChange={(e) => {
                                handleChangePersonData(
                                  nIndex,
                                  'dateOfBirth',
                                  e
                                );
                              }}
                            />
                            {!item.dateOfBirth.validate && (
                              <div className="ht-invalid-label">
                                {item.dateOfBirth.errorMsg}
                              </div>
                            )}
                          </DatePickerFormGroup>
                        </Col>
                        <Form.Group as={Col} md="6">
                          <Form.Label className="ht-label">Address</Form.Label>
                          <Form.Control
                            name={`address${nIndex}`}
                            className="ht-form-control"
                            isInvalid={!item.address.validate}
                            value={item.address.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'address',
                                e.target.value
                              );
                            }}
                            onBlur={(e) => {
                              checkPersonsValidate(
                                nIndex,
                                'address',
                                e.target.value
                              );
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {item.address.errorMsg}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label className="ht-label">City</Form.Label>
                          <Form.Control
                            name={`city${nIndex}`}
                            className="ht-form-control"
                            isInvalid={!item.city.validate}
                            value={item.city.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'city',
                                e.target.value
                              );
                            }}
                            onBlur={(e) => {
                              checkPersonsValidate(
                                nIndex,
                                'city',
                                e.target.value
                              );
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {item.city.errorMsg}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6">
                          <Form.Label className="ht-label">Postcode</Form.Label>
                          <Form.Control
                            name={`postalCode${nIndex}`}
                            className="ht-form-control"
                            isInvalid={!item.postalCode.validate}
                            value={item.postalCode.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'postalCode',
                                e.target.value
                              );
                            }}
                            onBlur={(e) => {
                              checkPersonsValidate(
                                nIndex,
                                'postalCode',
                                e.target.value
                              );
                            }}
                          />
                          <Form.Control.Feedback type="invalid">
                            {item.postalCode.errorMsg}
                          </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col} md="6">
                          <Form.Label className="ht-label">Country</Form.Label>
                          <Select
                            className="ht-selector group-selector"
                            classNamePrefix="select"
                            value={{ value: 'GB', label: 'United Kingdom' }}
                            option={[{ value: 'GB', label: 'United Kingdom' }]}
                            isDisabled
                          />
                        </Form.Group>

                        <Col md={12}>
                          <Checkbox
                            id="another-more25"
                            checked={item.anotherMore25.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'anotherMore25',
                                e.target.checked
                              );
                            }}
                            style={{ marginBottom: '17px' }}
                          >
                            This person owns more than 25% of the business
                          </Checkbox>
                          <Checkbox
                            id="another-member"
                            checked={item.memberOfBusiness.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'memberOfBusiness',
                                e.target.checked
                              );
                            }}
                            style={{ marginBottom: '17px' }}
                          >
                            This person is a member of the business's governing
                            board
                          </Checkbox>

                          <Checkbox
                            id="another-controllingManager"
                            checked={item.controllingManager.value}
                            onChange={(e) => {
                              handleChangePersonData(
                                nIndex,
                                'controllingManager',
                                e.target.checked
                              );
                            }}
                            style={{ marginBottom: '17px' }}
                          >
                            This person is one of the business's controlling
                            managers
                          </Checkbox>
                        </Col>
                      </Row>
                    );
                  })}
              </Form.Group>
            </StyledCard>
            <StyledCard className="ht-card">
              <h4 className="card-title" style={{ marginBottom: '' }}>
                Banking Details
              </h4>
              <p className="circle-i-description">
                <img src={CircleISvg} alt="circle i" />
                This is where your funds will be sent
              </p>

              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label className="ht-label">Sort Code</Form.Label>
                  <Form.Control
                    className="ht-form-control"
                    name="branchCode"
                    value={values.branchCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.branchCode && errors.branchCode}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.branchCode}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group as={Col} md="6">
                  <Form.Label className="ht-label">Account Number</Form.Label>
                  <Form.Control
                    className="ht-form-control"
                    name="accountNumber"
                    value={values.accountNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.accountNumber && errors.accountNumber}
                    autoComplete="new-password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.accountNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
            </StyledCard>

            {/* term card */}
            <StyledCard className="ht-card">
              <h4 className="card-title" style={{ margin: '0 0 16px 0' }}>
                Terms and Conditions
              </h4>
              <p className="description" style={{ margin: '0 0 24px 0' }}>
                By using Trade Sprint Payments you agree to the{' '}
                <a
                  href
                  style={{ color: PRIMARY_ACTIVE_COLOR, cursor: 'pointer' }}
                >
                  terms of service
                </a>
              </p>
            </StyledCard>
            <div className="d-flex">
              <SubmitButton
                className="ht-btn-primary"
                onClick={formatExtraValidates}
                type="submit"
              >
                Complete Account Signup
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
  padding: 40px 40px 25px;
  width: 100%;
  margin-bottom: 30px;

  .card-title {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
  }

  .circle-i-description {
    display: flex;
    align-items: flex-start;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    margin: 20px 0 28px;
    img {
      margin-right: 10px;
    }
  }

  .form-group {
    margin: 0 0 45px 0;
    .ht-label {
      margin-bottom: 15px;
    }
  }

  .form-group {
    &.bug-radio {
      margin-bottom: 16px;
    }
  }
  .description {
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: ${SECOND_GREY_COLOR};
    margin: 0 0 41px 0;
  }
`;

const DatePickerFormGroup = styled(Form.Group)`
  display: flex;
  flex-direction: column;
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

const RemovePersonButton = styled.div`
  color: ${PRIMARY_ACTIVE_COLOR};
  cursor: pointer;
  margin: 20px 0 30px;
  font-weight: 600;
  font-size: 15px;
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

const LookUpButton = styled(Button)`
  width: 134px;
  margin: 31px 0 0 0;
`;

export default BusinessAccountHolder;
