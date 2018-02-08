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

  async accountUpgradeHandler () {
    try {
      const payload = {
        uid: localStorage.getItem('activeUser'),
        type: this.props.user_data.type
      };
      const data = await axios.put('http://localhost:3396/api/users/upgradeUser', payload);
      window.location.reload(true);
      console.log('data received after user upgrade: ', data);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div>
        <div className="offset-md-1">
          {/* Check whether user is guest or host */}
          {!this.props.user_data ? null :
            this.props.user_data.type === 0 ?
            // If user is a GUEST
            <div>
              <div>
                <h1> {this.props.user_data.name} </h1>
              </div>
              <div>
                <p>Guest</p>
              </div>
              <div>
                <button onClick={this.accountUpgradeHandler.bind(this)}>Switch to Host</button>
              </div>
            </div>
            :
            //If user is a HOST
            <div>
              <div>
                <h1> {this.props.user_data.name} </h1>
              </div>
              <div>
                <p>Host</p>
              </div>
              <div>
                <button onClick={this.accountUpgradeHandler.bind(this)}>Switch to Guest</button>
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
              <Link to={`/user/${localStorage.getItem('activeUid')}/inbox`}>Inbox</Link>
              <Link to={`/user/${localStorage.getItem('activeUid')}/listings`}>Listings</Link>
              <Link to={`/user/${localStorage.getItem('activeUid')}/reviews`}>Reviews</Link>
              <Link to={`/user/${localStorage.getItem('activeUser')}/inbox`}>Inbox</Link>
              <Link to={`/user/${localStorage.getItem('activeUser')}/listings/pending`}>Listings</Link>
              <Link to={`/user/${localStorage.getItem('activeUser')}/reviews/given`}>Reviews</Link>
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