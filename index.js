import { registerRootComponent } from 'expo';
import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import store from './redux/store'; // Import Redux store

const RootComponent = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

// Register the root component
registerRootComponent(RootComponent);
