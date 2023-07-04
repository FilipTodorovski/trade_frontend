import React from 'react';

import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({
  component: Component,
  nextLink = '/login',
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        localStorage.token ? (
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

export default PrivateRoute;
