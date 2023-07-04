import validator from 'validator';
import * as Yup from 'yup';
import { postcodeValidator } from 'postcode-validator';

export const validateString = (value) => {
  if (value.length === 0) {
    return {
      value,
      validate: false,
      errorMsg: 'Required field',
    };
  }
  if (value.length > 0) {
    return {
      value,
      validate: true,
      errorMsg: '',
    };
  }
};

export const validateEmail = (value) => {
  if (value.length === 0) {
    return {
      value,
      validate: false,
      errorMsg: 'Required field',
    };
  }
  if (validator.isEmail(value)) {
    return {
      value,
      validate: true,
      errorMsg: '',
    };
  }
  return {
    value,
    validate: false,
    errorMsg: 'Not a valid email address!',
  };
};

export const validatePostCode = (value) => {
  if (value.length === 0) {
    return {
      value,
      validate: false,
      errorMsg: 'Required field',
    };
  }
  if (postcodeValidator(value.trim(), 'UK')) {
    return {
      value,
      validate: true,
      errorMsg: '',
    };
  }
  return {
    value,
    validate: false,
    errorMsg: 'Invalidate postcode',
  };
};

export const accountHolderIndividualValidationSchema = Yup.object().shape({
  phoneNumber: Yup.string().required('Required field'),
  branchCode: Yup.string().required('Required field'),
  accountNumber: Yup.string().required('Required field'),
  dateOfBirth: Yup.date().required('Required field'),
});

export const accountHolderBusinesValidationSchema = Yup.object().shape({
  legalBusinessName: Yup.string().required('Required field'),
  registrationNumber: Yup.string().required('Required field'),
  dateOfBirth: Yup.date().required('Required field'),
  phoneNumber: Yup.string().required('Required field'),
  firstName: Yup.string().required('Required field'),
  lastName: Yup.string().required('Required field'),
  personalAddress: Yup.string().required('Required field'),
  personalCity: Yup.string().required('Required field'),
  personalPostCode: Yup.string().required('Required field'),
  branchCode: Yup.string().required('Required field'),
  accountNumber: Yup.string().required('Required field'),
});

export const registerValidationSchema = Yup.object().shape({
  firstName: Yup.string()
    // Number and special case character invalid in Adyen user account
    .matches(/^[a-zA-Z]*$/, 'Cannot contain number and special case characters')
    .required('Required field'),
  lastName: Yup.string()
    // Number and special case character invalid in Adyen user account
    .matches(/^[a-zA-Z]*$/, 'Cannot contain number and special case characters')
    .required('Required field'),
  email: Yup.string().email('Invalid email field').required('Required field'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}$/,
      'Must One Uppercase, One Lowercase, One Number and one special case Character'
    )
    .required('Required field'),
});

export const registerRestaurantSchema = Yup.object().shape({
  FIRST_NAME: Yup.string().required('Required field'),
  LAST_NAME: Yup.string().required('Required field'),
  RESTAURANT_NAME: Yup.string().required('Required field'),
  // address: Yup.string().required('Required field'),
  EMAIL: Yup.string().email('Invalid email field').required('Required field'),
  PHONE: Yup.string().required('Required field'),
});

export const checkoutFormValidateSchema = Yup.object().shape({
  firstName: Yup.string().required('Required field'),
  lastName: Yup.string().required('Required field'),
  email: Yup.string().email('Invalid email field').required('Required field'),
  phoneNumber: Yup.string().required('Required field'),
  address: Yup.string().required('Required field'),
  postcode: Yup.string().required('Required field'),
});

export const loginValidateSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email field').required('Required field'),
  password: Yup.string().required('Required field'),
});

export const customerSignUpSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string().email('Invalid email field').required('Required field'),
  password: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}$/,
      'Must One Uppercase, One Lowercase, One Number and one special case Character'
    )
    .required('Required field'),
});

export const resetPasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Required field'),
  newPassword: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}$/,
      'Must One Uppercase, One Lowercase, One Number and one special case Character'
    )
    .required('Required field'),
});

export const customerPersonalDetailsValidate = Yup.object().shape({
  first_name: Yup.string().required(),
  last_name: Yup.string().required(),
  email: Yup.string().email('Invalid email field').required('Required field'),
  phone_number: Yup.string().required(),
});

export const addAddressFormValidateSchema = Yup.object().shape({
  postcode: Yup.string().required(),
  address: Yup.string().required(),
});

export const changePasswordSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Too Short!')
    .max(50, 'Too Long!')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{3,}$/,
      'Must One Uppercase, One Lowercase, One Number and one special case Character'
    )
    .required('Required field'),
  confirmPassword: Yup.string().required('Required field'),
});
