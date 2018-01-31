import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
// React Router
import { BrowserRouter, Route } from 'react-router-dom';
// Import components
import App from './App.jsx';
import reducers from './reducers';
import './index.css'

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
  , document.getElementById('app'));