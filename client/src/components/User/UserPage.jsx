import React from 'react';
import UserInfo from './UserInfo';
import Messages from './Messages';
import UserReviewsList from '../Reviews/UserReviewsList';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <h1> Inside UserPage </h1>
        <UserInfo />
        <Messages />
        <UserReviewsList />
      </div>
    )
  }
}

export default UserPage;