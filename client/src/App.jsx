import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home from './components/LandingPage/Home';
import SearchResults from './components/Search/SearchResultPage';
import ListingPage from './components/Listings/ListingPage';
import BookingForm from './components/Listings/BookingForm';
import UserPage from "./components/User/UserPage"
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import NavBar from './components/Nav/NavBar';

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Route path="/" component={NavBar} />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            {/* Pass query into search request */}
            <Route path='/search/:query' component={SearchResults} />
            {/* Setup :listingId for specific listing */}
            <Route path='/listing/book/:listingId' component={BookingForm} />
            <Route path='/listing/:listingId' component={ListingPage} />
            {/* Setup :userId for specific user */}
            <Route path='/user/:userId' component={UserPage} />
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App;