import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import PendingListing from './Listing Categories/PendingListing'
import InProgressListing from './Listing Categories/InProgressListing';
import CompletedListing from './Listing Categories/CompletedListing';
import './UserInfo.css'

class UserListingsList extends React.Component {
  render () {
    return (
      <div>
          <div className="row">
            {localStorage.getItem('accountType') === '0' ? 
              <div className="col-sm-3"></div>
            :
              <div className="col-sm-3">
                <Link to={`/user/${localStorage.getItem('activeUid')}/create-listing`}><button className="btn btn-sm btn-outline-dark">Create Listing</button></Link>
              </div>
            }
            <div className="row sub-menu">
              <div className="col-sm-2">
                <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/listings/pending`}>Pending</Link>
              </div>
              <div className="offset-sm-2 col-sm-5">
                <Link className="clearLink" style={{marginLeft: '1%'}} to={`/user/${localStorage.getItem('activeUid')}/listings/in-progress`}>In Progress</Link>
              </div>
              <div className="col-sm-3">
                <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/listings/completed`}>Completed</Link>
              </div>
            </div>
          </div>
          <hr/>
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