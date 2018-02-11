import React from 'react';
import { render } from 'react-dom';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
// React Router

// Import components
import App from './App.jsx';
import './index.css'

const middleWare = applyMiddleware(thunk, createLogger());
const store = createStore(reducers, middleWare, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

render(<App store={store} />, document.getElementById('app'));