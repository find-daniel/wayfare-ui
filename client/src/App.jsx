import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './components/LandingPage/Home.jsx';
import Search from './components/Search/SearchResultPage.jsx';
import ListingPage from './components/Listings/ListingPage.jsx';
import BookingForm from './components/Listings/BookingForm.jsx';
import UserPage from "./components/User/UserPage.jsx"

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/search' component={Search} />
          {/* Setup :listingId for specific listing */}
          <Route path='/listing/book/:listingId' component={BookingForm} />
          <Route path='/listing/:listingId' component={ListingPage} />
          {/* Setup :userId for specific user */}
          <Route path='/user/:userId' component={UserPage} />
          <Route path='/' component={Home} />
        </Switch>
      </div>
    )
  }
}

export default App;