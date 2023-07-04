import React from 'react';

import { Route, Redirect } from 'react-router-dom';

const CustomerPrivateRoute = ({
  component: Component,
  nextLink = '/',
  ...rest
}) => {
  const customerToken = localStorage.getItem('customer-token');

  return (
    <Route
      {...rest}
      render={(props) =>
        customerToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: nextLink, state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default CustomerPrivateRoute;
