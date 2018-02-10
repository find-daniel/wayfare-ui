import React from 'react';
import SearchBar from '../Search/SearchBar';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import firebase from 'firebase'
import 'babel-polyfill';
import axios from 'axios';
import './NavBar.css'

class NavBar extends React.Component {
  constructor() {
    super()
    this.onSuccess = this.onSuccess.bind(this);

    this.state = {
      img: ''
    }
  }

  async componentDidMount () {
    const data = await axios.get('http://localhost:3396/api/users/getUser', {params: {uid: localStorage.getItem('activeUid')}});
    this.setState({
      img: data.data.rows[0].image
    });
  }

  onSuccess () {
    this.props.history.push('/');
  };

  async onLogoutClickHandler() {
    try {
      const logout = await firebase.auth().signOut()
      console.log('User logged out.')
      localStorage.removeItem('activeUid');
      window.location.reload(true);
      this.props.history.push('/');
    } catch (err) {
      console.log('Error logging out.')
    }
  }

  render() {
    return (
      <div className="navbar nav row background-nav" >
        <div className="offset-sm-1 raleway" >
          <Link className="navbar-brand removeAnchorStyles" to="/">Wayfare</Link>
        </div>
        <div className="col-sm-3 offset-sm-2">
          <SearchBar />
        </div>
        {/* Conditionally render depending if user is logged in */}
        {
        !localStorage.getItem('activeUid') ?
          <div className="col-sm-2 d-flex justify-content-center" >
            <Link to="/login"><button className="btn btn-outline-light" id= "Login">Login</button></Link>
            <p className="space text-light" > or </p>
            <Link to="/signup"><button className="btn btn-outline-light" id="Signup">Signup</button></Link>
          </div>
        :
          <div className="col-sm-2">
            <Link to={`/user/${localStorage.getItem('activeUid')}/inbox`}> <img className="nav-profile-pic" src={this.state.img} alt=""/> </Link>
            <button className="btn btn-outline-light" onClick={this.onLogoutClickHandler.bind(this)}>Logout</button>
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