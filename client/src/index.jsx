import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

// Import styles
import './index.css'

// Import components
import Home from './components/LandingPage/Home';
import Search from './components/Search/SearchResultPage';
import ListingPage from './components/Listings/ListingPage';
import BookingForm from './components/Listings/BookingForm';
import UserPage from "./components/User/UserPage"


const router = (
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}></IndexRoute>
      <Route path="/search" component={Search}></Route>
      {/* Setup :listingId to link to specific listing */}
      <Route path="/listings/:listingId" component={ListingPage}></Route>
      <Route path="/listing/booking:listingId" component={BookingForm}></Route>
      <Route path="/user/:userId" component={UserPage}></Route>
    </Route>
  </Router>
);

render(router, document.getElementById('app'));