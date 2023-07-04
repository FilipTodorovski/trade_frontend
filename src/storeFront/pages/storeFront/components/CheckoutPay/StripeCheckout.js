import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Axios from 'axios';
import StripeCheckoutForm from './StripeCheckoutForm';
import { STRIPE_PUBLIC_KEY } from 'config';

const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

export default function StripeCheckout(props) {
  const {
    subTotal,
    deliveryFee,
    stripeAccountId,
    formSubmitProps,
    onStripeCheckout,
  } = props;
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (!subTotal || !deliveryFee) return;

    const amount = parseFloat(subTotal + deliveryFee);
    Axios.post('/stripe/createPaymentIntent', {
      amount: amount * 100,
      currency: 'GBP',
      payment_method_types: ['card'],
      application_fee_amount: amount * 10,
      transfer_data: {
        destination: stripeAccountId,
      },
    }).then((res) => {
      setClientSecret(res.data.client_secret);
    });
  }, [subTotal, deliveryFee]);

  const appearance = {
    theme: 'stripe',
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <StripeCheckoutForm
            clientSecret={clientSecret}
            formSubmitProps={formSubmitProps}
            onStripeCheckout={onStripeCheckout}
          />
        </Elements>
      )}
    </div>
  );
}
