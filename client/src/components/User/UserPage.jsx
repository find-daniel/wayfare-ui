import 'babel-polyfill';
import React from 'react';
import UserInfo from './UserInfo';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import Messages from './Messages';
import UserReviewsList from '../Reviews/UserReviewsList';
import UserListingsList from './UserListingsList';
import axios from 'axios';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <div className="user-header">
          {/* Check whether user is guest or host */}
          {!this.props.user_data ? null :
            this.props.user_data.type === 0 ?
            // If user is a GUEST
            <div className="row d-flex justify-content-around">
              <div className="row user-name">
                <div>
                  <h1> {this.props.user_data.name} </h1>
                </div>
                <div className="user-badge">
                  <span className="badge badge-pill badge-secondary">Guest</span>
                </div>
              </div>
            </div>
            :
            //If user is a HOST
            <div className="row d-flex justify-content-around">
              <div className="row user-name">
                <div>
                  <h1> {this.props.user_data.name} </h1>
                </div>
                <div className="user-badge">
                  <span className="badge badge-pill badge-primary">Host</span>
                </div>
              </div>
            </div>
          }
        </div>        
        <hr/>
        <div className="container">
          <div className="row">
            <div className="left col-md-4">
              <UserInfo />
            </div>
            <div className="right offset-md-1 col-md-7">
              {/* Create submenu here */}
              <div className="d-flex justify-content-around">
                <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/inbox`}>Inbox</Link>
                <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/listings/pending`}>Listings</Link>
                <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/reviews/given`}>Reviews</Link>
              </div>
              <hr/>
              <Switch> 
                <Route path='/user/:userId/inbox' component={Messages} />
                <Route path='/user/:userId/listings' component={UserListingsList} />
                <Route path='/user/:userId/reviews' component={UserReviewsList} />
              </Switch>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    user_data: state.user_data
  }
};

export default connect(mapStateToProps)(UserPage);