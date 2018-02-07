import React from 'react';
import SearchBar from '../Search/SearchBar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import firebase from 'firebase'
import 'babel-polyfill';

class NavBar extends React.Component {
  constructor() {
    super()
    this.onSuccess = this.onSuccess.bind(this);
  }

  async componentDidMount () {
    await this.props.active_user;
  }

  onSuccess () {
    this.props.history.push('/');
  };

  async onLogoutClickHandler() {
    try {
      const logout = await firebase.auth().signOut()
      console.log('User logged out.')
      localStorage.removeItem('activeUser');
      window.location.reload(true);
    } catch (err) {
      console.log('Error logging out.')
    }
  }

  render() {
    return (
      <div className="navbar bg-light" >
        <div>
          <Link className="navbar-brand" to="/">Wayfare</Link>
        </div>
        <SearchBar />
        {/* Conditionally render depending if user is logged in */}
        {
        !localStorage.getItem('activeUser') ?
          <div>
            <Link to="/login"><button className="btn btn-outline-dark" id= "Login">Login</button></Link>
            <Link to="/signup"><button className="btn btn-outline-dark" id="Signup">Signup</button></Link>
          </div>
        :
          <div>
            <button className="btn btn-outline-dark" onClick={this.onLogoutClickHandler.bind(this)}>Logout</button>
          </div>
        }
      </div>
    )
  }
};

function mapStateToProps (state) {
  return {
    active_user: state.active_user
  }
};

export default connect(mapStateToProps)(NavBar);