import React from 'react';
import UserInfo from './UserInfo';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import Messages from './Messages';
import UserReviewsList from '../Reviews/UserReviewsList';
import UserListingsList from './UserListingsList';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <div className="offset-md-1">
          {/* stupid async issue */}
          {!this.props.user_data ? null 
          :
            <div>
              <div>
                <h1> {this.props.user_data.name} </h1>
              </div>
              <div>
                <p>Guest</p>
              </div>
              <div>
                <button>Upgrade to Host</button>
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
              <Link to={`/user/${localStorage.getItem('activeUser')}/inbox`}>Inbox</Link>
              <Link to={`/user/${localStorage.getItem('activeUser')}/listings`}>Listings</Link>
              <Link to={`/user/${localStorage.getItem('activeUser')}/reviews`}>Reviews</Link>
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