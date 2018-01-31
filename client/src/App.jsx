import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import Home from './components/LandingPage/Home.jsx';
import Search from './components/Search/SearchResultPage.jsx';
import ListingPage from './components/Listings/ListingPage.jsx';
import BookingForm from './components/Listings/BookingForm.jsx';
import UserPage from "./components/User/UserPage.jsx"

const App = ({ store }) => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
            <Route path='/search' component={Search} />
            {/* Setup :listingId for specific listing */}
            <Route path='/listing/book/:listingId' component={BookingForm} />
            <Route path='/listing/:listingId' component={ListingPage} />
            {/* Setup :userId for specific user */}
            <Route path='/user/:userId' component={UserPage} />
            <Route path='/' component={Home} />
          </Switch>
      </BrowserRouter>
    </Provider>
  )
}

export default App;