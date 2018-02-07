import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import PendingListing from './Listing Categories/PendingListing'
import InProgressListing from './Listing Categories/InProgressListing';
import CompletedListing from './Listing Categories/CompletedListing';

class UserListingsList extends React.Component {
  render () {
    return (
      <div>
          <Link to={`/user/${localStorage.getItem('activeUser')}/listings/pending`}>Pending</Link>
          <Link to={`/user/${localStorage.getItem('activeUser')}/listings/in-progress`}>In Progress</Link>
          <Link to={`/user/${localStorage.getItem('activeUser')}/listings/completed`}>Completed</Link>
          <Switch> 
            <Route path='/user/:userId/listings/pending' component={PendingListing} />
            <Route path='/user/:userId/listings/in-progress' component={InProgressListing} />
            <Route path='/user/:userId/listings/completed' component={CompletedListing} />
          </Switch>
        {/* Map through listing entries */}
      </div>
    )
  }
};

export default UserListingsList;