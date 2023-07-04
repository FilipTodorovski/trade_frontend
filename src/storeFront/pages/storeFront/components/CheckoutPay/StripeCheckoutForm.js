import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripeCheckoutForm(props) {
  const { clientSecret, formSubmitProps, onStripeCheckout } = props;
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements ) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      console.log(result.error.message);
    } else {
      if (result.paymentIntent.status === 'succeeded') {
        onStripeCheckout(result.paymentIntent);
      }
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  return (
    <form id="payment-form" className="mt-3" onSubmit={handleSubmit}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
      <button
        className="w-100 ht-btn-primary mt-3"
        type="submit"
        disabled={!stripe}
      >
        Pay
      </button>
    </form>
  );
}
