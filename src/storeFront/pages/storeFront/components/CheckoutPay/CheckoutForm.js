import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import get from 'lodash/get';
import axios from 'axios';
import { postcodeValidator } from 'postcode-validator';
import styled from 'styled-components';
import { useFormik } from 'formik';
import Select from 'react-select';
import { Row, Col, Form, Button, Card } from 'react-bootstrap';
import CustomRadio from 'sharedComponents/CustomRadio';
import CheckBox from 'sharedComponents/CheckBox';
import Payment from './Payment';
import LockSVG from 'svg/Vector.svg';
import { getDefaultOrderTime, getOrderListTotalPrice } from 'utils/order';
import { getDeliveryFee } from 'utils/store';
import { getAddressList, getRegularPostCodeStr } from 'utils/address';
import { checkoutFormValidateSchema } from 'validators';
import {
  getSelectedPaymentInfoApi,
  getSelectedAddressApi,
} from 'Apis/CustomerApis';
import { getAddresses as getAddressFromElasticApi } from 'Apis/Elastic';
import { getAddresses as getAddressFromFirstClassApi } from 'Apis/SharedApis';

import * as CONSTANTS from 'constants/constants';
import StripeCheckout from './StripeCheckout';

const CheckoutForm = ({ success, deliveryFee, setDeliveryFee, setLoading }) => {
  const { storeInfo, orderList, deliveryData, customerInfo } = useSelector(
    (state) => ({
      storeInfo: state.storeFrontReducer.store,
      orderList: state.storeFrontReducer.orderList,
      deliveryData: state.storeFrontReducer.deliveryData,
      customerInfo: state.storeFrontReducer.user,
    })
  );
  const [addressList, setAddressList] = useState([]);

  const [userInfo, setUserInfo] = useState({
    show: false,
    password: '',
  });

  const [payData, setPayData] = useState({
    payment_method: CONSTANTS.ORDER_PAYMENT_METHOD.CARD,
    trans_type: deliveryData.type,
  });

  // const sendOrderMail = (number) => {
  //   axios
  //     .post('/mail/send', {
  //       from: 'hello@TradeSprint.co.uk',
  //       to: formSubmitProps.values.email,
  //       template: 'order',
  //       data: {
  //         storeName: storeInfo.name,
  //         items: orderList.map((item) => {
  //           return {
  //             ...item,
  //             totalPrice: getOrderedGroupPrice(item),
  //           };
  //         }),
  //         delivery_fee: deliveryFee,
  //         subTotal: getOrderListTotalPrice(storeInfo, orderList),
  //         amount: getOrderListTotalPrice(storeInfo, orderList) + deliveryFee,
  //         order_number: number,
  //         storePhoneNumber: storeInfo.phone_number,
  //         customer_first_name: formSubmitProps.values.firstName,
  //       },
  //     })
  //     .then((res) => {
  //       console.log('Order Email Sent');
  //     })
  //     .catch((err) => {
  //       console.log('Order Email Sent Wrong');
  //     });
  // };

  const formSubmitProps = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      postcode: deliveryData.postcode,
      address: '',
      customer_request: '',
    },
    enableReinitialize: true,
    validateOnChange: true,
    validateOnBlur: true,
    validationSchema: checkoutFormValidateSchema,
    onSubmit: (params) => {
      if (payData.payment_method === CONSTANTS.ORDER_PAYMENT_METHOD.CARD)
        return;

      createOrder(params, CONSTANTS.ORDER_PAYMENT_METHOD.CASH);
    },
  });

  const createOrder = async (params, paymentMethod) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      postcode,
      address,
      customer_request,
    } = params;

    const response = await axios.post('/order', {
      trans_type: deliveryData.type,
      first_name: firstName,
      last_name: lastName,
      status: CONSTANTS.ORDER_STATUS.PENDING,
      payment_method: paymentMethod,
      email: email,
      request_time: getDefaultOrderTime(storeInfo, deliveryData),
      delivery_time: getDefaultOrderTime(storeInfo, deliveryData),
      amount: getOrderListTotalPrice(storeInfo, orderList) + deliveryFee,
      phone_number: phoneNumber,
      items: JSON.stringify(orderList),
      delivery_fee: deliveryFee,
      postcode: postcode.trim(),
      address,
      store_id: storeInfo.id,
      password: userInfo.show ? userInfo.password : '',
      customer_request,
      customer_id: customerInfo?.user?.id || -1,
      save_token: userInfo.show,
    });

    if (response.data.success) {
      success(true, '', response.data.order.order_number);
      // sendOrderMail(response.data.order.order_number);
    } else {
      success(false, '');
    }
  };

  const handleStripeCheckout = (paymentIntent) => {
    createOrder(formSubmitProps.values, CONSTANTS.ORDER_PAYMENT_METHOD.CARD);
  };

  const loadAddress = async (findPostcode) => {
    const elasticRes = await getAddressFromElasticApi(
      getRegularPostCodeStr(findPostcode)
    );

    if (elasticRes && elasticRes.hits.hits.length > 0) {
      setAddressList(elasticRes.hits.hits);
    } else {
      const addresses = await getAddressFromFirstClassApi(findPostcode);
    }

    // getAddressFromElasticApi(getRegularPostCodeStr(findPostcode))
    //   .then((elasticRes) => {
    //     console.log(elasticRes);
    //     setAddressList([...getAddressList(elasticRes.hits.hits[0]._source)]);
    //   })
    //   .catch((errElastic) => {
    //     getAddressFromFirstClassApi(findPostcode)
    //       .then((res) => {
    //         if (res.data.success) {
    //           setAddressList([...getAddressList(res.data.address)]);
    //         }
    //       })
    //       .catch((errFirstClass) => {
    //         setAddressList([]);
    //         formSubmitProps.setFieldError({
    //           postcode:
    //             'Sorry we did not recognise that postcode, check and try again.',
    //         });
    //       });
    //   });
  };

  useEffect(() => {
    let unmounted = false;
    if (get(customerInfo, 'user.id', -1) !== -1) {
      setLoading(true);

      const getSavedData = async () => {
        let formData = {};

        try {
          const resPayment = await getSelectedPaymentInfoApi();
          if (resPayment.data.success) {
            formData = {
              ...formData,
              phoneNumber: resPayment.data.payment_token.phone_number,
              email: resPayment.data.payment_token.email,
              customer_request: resPayment.data.payment_token.customer_request,
              firstName: resPayment.data.payment_token.first_name,
              lastName: resPayment.data.payment_token.last_name,
            };
          } else {
            formData = {
              ...formData,
              email: get(customerInfo, 'user.email', ''),
              firstName: get(customerInfo, 'user.first_name', ''),
              lastName: get(customerInfo, 'user.last_name', ''),
            };
          }
        } catch (err) {
          formData = {
            ...formData,
            email: get(customerInfo, 'user.email', ''),
            firstName: get(customerInfo, 'user.first_name', ''),
            lastName: get(customerInfo, 'user.last_name', ''),
          };
        }

        try {
          const resAddress = await getSelectedAddressApi();
          if (resAddress.data.success) {
            formData = {
              ...formData,
              postcode: resAddress.data.address.address.postcode,
              address: resAddress.data.address.address.address,
            };
          } else {
            formData = {
              ...formData,
              postcode: deliveryData.postcode ? deliveryData.postcode : '',
              address: '',
            };
          }
        } catch (err) {
          formData = {
            ...formData,
            postcode: deliveryData.postcode ? deliveryData.postcode : '',
            address: '',
          };
        }

        if (!unmounted) {
          formSubmitProps.setValues({
            ...formData,
          });
          if (formData.postcode) loadAddress(formData.postcode);
          setLoading(false);
        }
      };

      getSavedData();
    }
    return () => {
      unmounted = true;
    };
  }, []); // eslint-disable-line

  const lookupAddress = async (e) => {
    e.preventDefault();
    setAddressList([]);
    formSubmitProps.setFieldValue('address', '');
    let { postcode } = formSubmitProps.values;
    postcode = postcode.trim();
    if (postcodeValidator(postcode, 'UK')) {
      const newDeliveryFee = await getDeliveryFee(storeInfo, postcode);

      if (newDeliveryFee >= 0) {
        formSubmitProps.setFieldError('address', '');
        loadAddress(postcode);
        setDeliveryFee(newDeliveryFee);
      } else {
        formSubmitProps.setFieldError(
          'address',
          "This store couldn't delivery or collect to your postcode."
        );
      }
    } else {
      formSubmitProps.setFieldError(
        'address',
        'Sorry we did not recognise that postcode, check and try again.'
      );
    }
  };

  const checkPostCodeValiate = () => {
    if (formSubmitProps.errors.postcode) return false;
    const { postcode } = formSubmitProps.values;
    if (!postcodeValidator(postcode.trim(), 'UK')) return false;
    return true;
  };

  return (
    <ComponentContainer onSubmit={formSubmitProps.handleSubmit}>
      <Card>
        <Card.Body>
          <Form onSubmit={formSubmitProps.handleSubmit}>
            <Row>
              <Form.Group as={Col} md="6" className="">
                <Form.Label className="ht-label">First Name</Form.Label>
                <Form.Control
                  id="firstName"
                  name="firstName"
                  className="ht-form-control"
                  type="text"
                  value={formSubmitProps.values.firstName}
                  onChange={formSubmitProps.handleChange}
                  isInvalid={
                    formSubmitProps.touched.firstName &&
                    formSubmitProps.errors.firstName
                  }
                  onBlur={formSubmitProps.handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                  {formSubmitProps.errors.firstName}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label className="ht-label">Last Name</Form.Label>
                <Form.Control
                  id="lastName"
                  name="lastName"
                  className="ht-form-control"
                  type="text"
                  value={formSubmitProps.values.lastName}
                  onChange={formSubmitProps.handleChange}
                  isInvalid={
                    formSubmitProps.touched.lastName &&
                    formSubmitProps.errors.lastName
                  }
                  onBlur={formSubmitProps.handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                  {formSubmitProps.errors.lastName}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} md="6">
                <Form.Label className="ht-label">Email address</Form.Label>
                <Form.Control
                  id="email"
                  name="email"
                  className="ht-form-control"
                  type="email"
                  value={formSubmitProps.values.email}
                  onChange={formSubmitProps.handleChange}
                  isInvalid={
                    formSubmitProps.touched.email &&
                    formSubmitProps.errors.email
                  }
                  onBlur={formSubmitProps.handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                  {formSubmitProps.errors.email}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label className="ht-label">Phone number</Form.Label>
                <Form.Control
                  id="phoneNumber"
                  name="phoneNumber"
                  className="ht-form-control"
                  type="text"
                  value={formSubmitProps.values.phoneNumber}
                  onChange={(e) => {
                    formSubmitProps.setFieldValue(
                      'phoneNumber',
                      e.target.value.replace(/\D/, '')
                    );
                  }}
                  isInvalid={
                    formSubmitProps.touched.phoneNumber &&
                    formSubmitProps.errors.phoneNumber
                  }
                  onBlur={formSubmitProps.handleBlur}
                />
                <Form.Control.Feedback type="invalid">
                  {formSubmitProps.errors.phoneNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>

            <Row>
              <Form.Group as={Col} md="6">
                <Form.Label className="ht-label">Postcode</Form.Label>
                <div className="postcode-div">
                  <Form.Control
                    id="postcode"
                    name="postcode"
                    type="text"
                    className="ht-form-control postcode-input"
                    value={formSubmitProps.values.postcode}
                    onChange={formSubmitProps.handleChange}
                    placeholder="Enter postcode"
                    isInvalid={
                      formSubmitProps.touched.postcode &&
                      !checkPostCodeValiate()
                    }
                  />
                  <Button
                    variant="primary"
                    className={`ht-btn-primary btn-lookup ${
                      !checkPostCodeValiate() ? 'ht-btn-primary-disable' : ''
                    }`}
                    type="button"
                    onClick={lookupAddress}
                  >
                    Lookup
                  </Button>
                </div>
                {!checkPostCodeValiate() && (
                  <div className="ht-invalid-label">
                    {formSubmitProps.errors.postcode || 'Invalid postcode.'}
                  </div>
                )}
              </Form.Group>
              {addressList.length > 0 && (
                <Form.Group as={Col} md="6">
                  <Form.Label className="ht-label">Address</Form.Label>
                  <Select
                    classNamePrefix="select"
                    className={`ht-selector ${
                      formSubmitProps.errors.address && 'invalidate'
                    }`}
                    options={addressList.map((item) => {
                      return {
                        value: item._source.line_1,
                        label: item._source.line_1,
                      };
                    })}
                    value={{
                      value: formSubmitProps.values.address,
                      label: formSubmitProps.values.address,
                    }}
                    onChange={(e) => {
                      formSubmitProps.setFieldValue('address', e.value);
                    }}
                    onBlur={formSubmitProps.handleBlur}
                    placeholder="Choose your address"
                    isSearchable={false}
                  />
                  <div className="ht-invalid-label">
                    {formSubmitProps.errors.address}
                  </div>
                </Form.Group>
              )}
            </Row>

            <Row>
              <Form.Group as={Col} md="12">
                <Form.Label className="ht-label">
                  Order notes (Optional)
                </Form.Label>
                <Form.Control
                  id="customer_request"
                  name="customer_request"
                  className="ht-form-control order-text-area"
                  as="textarea"
                  value={formSubmitProps.values.customer_request}
                  onChange={formSubmitProps.handleChange}
                />
              </Form.Group>
            </Row>

            <Row>
              <Col md="12">
                <CheckBox
                  name="Save my details for faster checkout next time"
                  onChange={(e) => {
                    setUserInfo({
                      ...userInfo,
                      show: !userInfo.show,
                      password: '',
                    });
                  }}
                  checked={userInfo.show}
                />
              </Col>
            </Row>

            {userInfo.show && get(customerInfo, 'user.id', -1) === -1 && (
              <Row>
                <Form.Group as={Col} md="6">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    className="ht-form-control"
                    type="password"
                    value={userInfo.password}
                    onChange={(e) => {
                      setUserInfo({
                        ...userInfo,
                        password: e.target.value,
                      });
                    }}
                    autocomplete="new-password"
                    required
                  />
                </Form.Group>
              </Row>
            )}
          </Form>
        </Card.Body>
      </Card>
      <div>
        <h3 className="payment-title mt-5 d-flex align-item-center">
          Payment
          <img className="ml-3" src={LockSVG} alt="" />
        </h3>
        <p>All transactions are secure and encrypted.</p>
      </div>
      <Card className="mt-3">
        <Card.Body>
          <Row>
            <Col md="6">
              <CustomRadio
                id="card"
                name="card"
                label="Pay by Credit / Debit Card"
                checked={
                  payData.payment_method === CONSTANTS.ORDER_PAYMENT_METHOD.CARD
                }
                onChange={(e) => {
                  setPayData({
                    ...payData,
                    payment_method: CONSTANTS.ORDER_PAYMENT_METHOD.CARD,
                  });
                }}
              />
            </Col>
            <Col md="6">
              <CustomRadio
                id="cash"
                name="cash"
                label={
                  deliveryData.type === 1
                    ? 'Pay by Cash on Delivery'
                    : 'Pay Cash on Collection'
                }
                checked={
                  payData.payment_method === CONSTANTS.ORDER_PAYMENT_METHOD.CASH
                }
                onChange={(e) => {
                  setPayData({
                    ...payData,
                    payment_method: CONSTANTS.ORDER_PAYMENT_METHOD.CASH,
                  });
                }}
              />
            </Col>
          </Row>
          {payData.payment_method === CONSTANTS.ORDER_PAYMENT_METHOD.CARD && (
            <Row style={{ marginBottom: '1rem' }}>
              <Col>
                <StripeCheckout
                  subTotal={getOrderListTotalPrice(storeInfo, orderList)}
                  deliveryFee={deliveryFee}
                  stripeAccountId={storeInfo.owner.stripe_user_id}
                  formSubmitProps={formSubmitProps}
                  onStripeCheckout={handleStripeCheckout}
                />
                {/* <Payment
                  success={(isSuccess, msg, order_number) => {
                    // if (isSuccess) sendOrderMail(order_number);
                    success(isSuccess, msg, order_number);
                  }}
                  orderInfo={{
                    trans_type: deliveryData.type,
                    first_name: formSubmitProps.values.firstName,
                    last_name: formSubmitProps.values.lastName,
                    status: CONSTANTS.ORDER_STATUS.PENDING,
                    payment_method: CONSTANTS.ORDER_PAYMENT_METHOD.CARD,
                    email: formSubmitProps.values.email,
                    request_time: getDefaultOrderTime(storeInfo, deliveryData),
                    delivery_time: getDefaultOrderTime(storeInfo, deliveryData),
                    phone_number: formSubmitProps.values.phoneNumber,
                    customer_request: formSubmitProps.values.customer_request,
                    items: JSON.stringify(orderList),
                    postcode: formSubmitProps.values.postcode.trim(),
                    address: formSubmitProps.values.address,
                    store_id: storeInfo.id,
                    save_token: userInfo.show,
                    password:
                      userInfo.show && get(customerInfo, 'user.id', -1) === -1
                        ? userInfo.password
                        : '',
                    delivery_fee: deliveryFee,
                    amount:
                      getOrderListTotalPrice(storeInfo, orderList) +
                      deliveryFee,
                    customer_id: customerInfo?.user?.id || -1,
                  }}
                  onOrderSubmit={() => {
                    formSubmitProps.handleSubmit();
                    return new Promise((resolve, reject) => {
                      setTimeout(() => {
                        if (Object.keys(formSubmitProps.errors).length === 0) {
                          setLoading();
                          resolve(true);
                        } else resolve(false);
                      }, 100);
                    });
                  }}
                /> */}
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      {payData.payment_method === CONSTANTS.ORDER_PAYMENT_METHOD.CASH && (
        <Row className="mt-4">
          <Col>
            <Button className="w-100 ht-btn-primary" type="submit">
              Confirm and Pay Now
            </Button>
          </Col>
        </Row>
      )}
    </ComponentContainer>
  );
};

const ComponentContainer = styled.form`
  .ht-form-control {
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .postcode-div {
    width: 100%;
    display: flex;
    align-item: center;

    .postcode-input {
      flex: 1 1 100%;
    }

    .btn-lookup {
      flex: 0 0 90px;
      padding-left: 0;
      padding-right: 0;
      margin-left: 10px;
    }
  }

  .postcode-invalidate {
    width: 100%;
    margin-top: 0.25rem;
    font-size: 100%;
    color: #d4351c;
  }

  .order-text-area {
    padding: 20px;
  }
`;

export default CheckoutForm;
