import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Form } from 'react-bootstrap';
import {
  getPaymentMethods,
  initiatePayment,
  submitAdditionalDetails,
} from '../../../../actions/adyenAction';
import { ADYEN_PAYMENT_TYPE } from 'constants/constants';

import './Payment.scss';

export default function Payment({
  orderInfo,
  onOrderSubmit,
  success,
  children,
}) {
  return (
    <div id="payment-page">
      <ConnectedCheckoutContainer
        type={ADYEN_PAYMENT_TYPE}
        orderInfo={orderInfo}
        onOrderSubmit={onOrderSubmit}
        success={success}
      />
      {children}
    </div>
  );
}

class CheckoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.orderNumber = 0;
    this.paymentContainer = React.createRef();
    this.paymentComponent = null;

    this.onSubmit = this.onSubmit.bind(this);
    this.onAdditionalDetails = this.onAdditionalDetails.bind(this);
    this.processPaymentResponse = this.processPaymentResponse.bind(this);

    this.state = {
      showTerm: false,
    };
  }

  componentDidMount() {
    const { getPaymentMethods, orderInfo } = this.props;
    getPaymentMethods(orderInfo.customer_id);
  }

  componentDidUpdate(prevProps) {
    const { success, payment } = this.props;
    const {
      paymentMethodsRes: paymentMethodsResponse,
      config,
      paymentRes,
      paymentDetailsRes,
      error,
    } = payment;
    if (error && error !== prevProps.payment.error) {
      let failedMessage;
      try {
        const responseBody = JSON.parse(error.error.err.responseBody);
        const { message } = responseBody;
        const indexStr = 'additionalData:';
        failedMessage = message.substr(
          message.indexOf(indexStr) + indexStr.length,
          message.length
        );
      } catch (err) {
        console.log(err);
        failedMessage = 'Your payment has been failed.';
      }
      success(false, failedMessage);
      return;
    }
    if (
      paymentMethodsResponse &&
      config &&
      (paymentMethodsResponse !== prevProps.payment.paymentMethodsRes ||
        config !== prevProps.payment.config)
    ) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      this.checkout = new AdyenCheckout({
        ...config,
        paymentMethodsResponse,
        onAdditionalDetails: this.onAdditionalDetails,
        onSubmit: this.onSubmit,
      });

      this.checkout
        .create(ADYEN_PAYMENT_TYPE)
        .mount(this.paymentContainer.current);

      // show term
      this.setState({
        showTerm: true,
      });
    }
    if (paymentRes && paymentRes !== prevProps.payment.paymentRes) {
      this.processPaymentResponse(paymentRes);
    }
    if (
      paymentRes &&
      paymentDetailsRes !== prevProps.payment.paymentDetailsRes
    ) {
      this.processPaymentResponse(paymentDetailsRes);
    }
  }

  processPaymentResponse(paymentRes) {
    const { success } = this.props;
    if (paymentRes) {
      success(true, '', this.state.orderNumber);
    } else {
      success(false, 'Your payment has been failed.');
    }
  }

  async onSubmit(state, component) {
    const { orderInfo, onOrderSubmit, initiatePayment } = this.props;

    const isValid = await onOrderSubmit();
    if (state.isValid && isValid) {
      const orderNumber = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      this.setState({
        orderNumber,
      });
      initiatePayment({
        ...state.data,
        orderInfo: {
          ...orderInfo,
          order_number: orderNumber,
          currency: 'GBP',
        },
        origin: window.location.origin,
      });
      this.paymentComponent = component;
    }
  }

  onAdditionalDetails(state, component) {
    const { submitAdditionalDetails } = this.props;
    submitAdditionalDetails(state.data);
    this.paymentComponent = component;
  }

  render() {
    return (
      <>
        <div className="payment-container">
          <div ref={this.paymentContainer} className="payment"></div>
        </div>
        {this.state.showTerm && (
          <Form.Label className="term-check-div">
            By click pay, you agree & accept our{' '}
            <Link to="/terms">Terms and conditions</Link>
          </Form.Label>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  payment: state.storeFrontReducer.payment,
});

const mapDispatchToProps = {
  getPaymentMethods,
  initiatePayment,
  submitAdditionalDetails,
};

export const ConnectedCheckoutContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutContainer);
