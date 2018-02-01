import React from 'react';
import UserInfo from './UserInfo';
import Messages from './Messages';
import NavBar from '../Nav/NavBar';

class UserPage extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <h1> Inside UserPage </h1>
        <UserInfo />
        <Messages />
      </div>
    )
  }
}

export default UserPage;