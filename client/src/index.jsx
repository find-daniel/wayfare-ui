import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import reducers from './reducers';
// React Router

// Import components
import App from './App.jsx';
import './index.css'

const store = createStore(reducers);

render(<App store={store} />, document.getElementById('app'));