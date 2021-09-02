/* eslint-disable no-unused-vars */
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';

import App from './src/screens/App';
import appReducer from './src/screens/reducer';
import appSaga from './src/screens/sagas';

// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = composeWithDevTools;
const sagaMiddleware = createSagaMiddleware({
  onError: (error) => {
    console.log('saga middleware on error = ', error);
  },
});

const store = createStore(appReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

const NativeApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

sagaMiddleware.run(appSaga);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(NativeApp);
