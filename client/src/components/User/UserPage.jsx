import React from 'react';
import UserInfo from './UserInfo';
import { connect } from 'react-redux';
import Messages from './Messages';
import UserReviewsList from '../Reviews/UserReviewsList';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <div className="offset-md-1 col-sm-5">
          {/* stupid async issue */}
          {!this.props.user_data ? null 
          :
            <h1> {this.props.user_data.name} </h1>
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
              <Messages />
              <UserReviewsList />
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