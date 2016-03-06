import React from 'react';
import ReactDom from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { fromJS } from 'immutable';
import App from '../universal/components/app';
import configureStore from '../universal/redux/configureStore';
import makeRouteHookSafe from './make-route-hooks-safe';

const initialState = window.__INITIAL_STATE__ || undefined;
if (initialState) {
  Object.keys(initialState).forEach(key => {
    if (key !== 'router') {
      initialState[key] = fromJS(initialState[key]);
    }
  });
}
const store = configureStore(initialState);
ReactDom.render(<App routerHistory={createBrowserHistory()} store={store} />,
             document.getElementById('mount'));
