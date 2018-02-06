import React from 'react';
import SearchBar from '../Search/SearchBar';
import { Link } from 'react-router-dom';
import firebase from 'firebase'
import 'babel-polyfill';

class NavBar extends React.Component {
  constructor() {
    super()
  }

  async onLogoutClickHandler() {
    try {
      const logout = await firebase.auth().signOut()
      console.log('User logged out.')
    } catch (err) {
      console.log('Error logging out.')
    }
  }

  render() {
    return (
      <div className="navbar" >
        <div>
          <Link className="navbar-brand" to="/">Wayfare</Link>
        </div>
        <SearchBar />
        {/* if not logged in do this */}
        <div>
          <Link to="/login"><button id= "Login">Login</button></Link>
          <Link to="/signup"><button id="Signup">Signup</button></Link>
          <button onClick={this.onLogoutClickHandler.bind(this)}>Logout</button>
        </div>
      </div>
    )
  }
};

export default NavBar;