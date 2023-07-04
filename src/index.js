import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-multi-carousel/lib/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import 'react-multi-carousel/lib/styles.css';

import axios from 'axios';
import App from './app';
import store from './store/index';
import CONFIG from './config';
import setAuthToken from './utils/setAuthToken';
import registerServiceWorker from './registerServiceWorker';

import './index.scss';

axios.defaults.baseURL = CONFIG.API_URL;
axios.defaults.headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <App />
  </Provider>,
  target
);

registerServiceWorker();
