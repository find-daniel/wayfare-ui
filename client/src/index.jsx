import React from 'react';
import { render } from 'react-dom';
import { createLogger } from 'redux-logger';
import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
// React Router

// Import components
import App from './App.jsx';
import './index.css'

const middleWare = applyMiddleware(createLogger());
const store = createStore(reducers, middleWare);

render(<App store={store} />, document.getElementById('app'));