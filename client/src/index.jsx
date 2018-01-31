import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory, ConnectedRouter } from 'react-router';

// Import styles
import './index.css'

// Import components
import App from './App.jsx';
import Home from './components/LandingPage/Home.jsx';
import Search from './components/Search/SearchResultPage.jsx';
import ListingPage from './components/Listings/ListingPage.jsx';
import BookingForm from './components/Listings/BookingForm.jsx';
import UserPage from "./components/User/UserPage.jsx"


const router = (
  <ConnectedRouter history={browserHistory}>
    <div>
      <Route path="/" component={App}>
        {/* <IndexRoute component={Home}></IndexRoute> */}
        {/* <Route path="/search" component={Search}></Route> */}
        {/* Setup :listingId/:userId to link to specific listing/user */}
        {/* <Route path="/listings/:listingId" component={ListingPage}></Route>
        <Route path="/listing/booking:listingId" component={BookingForm}></Route>
        <Route path="/user/:userId" component={UserPage}></Route> */}
      </Route>
    </div>
  </ConnectedRouter>
);

ReactDOM.render(router, document.getElementById('app'));