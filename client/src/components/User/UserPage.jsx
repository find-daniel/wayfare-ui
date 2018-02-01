import React from 'react';
import UserInfo from './UserInfo';
import Messages from './Messages';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <h1> Inside UserPage </h1>
        <UserInfo />
        <Messages />
      </div>
    )
  }
}

export default UserPage;