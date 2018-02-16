import React from 'react';
import firebase from '../../lib.js';
import {googleProvider, facebookProvider} from '../../lib.js';
import axios from 'axios';
import 'babel-polyfill';
import url from '../../config'
import { Link } from 'react-router-dom';
import { setActiveUser, setUserData } from '../../actions/actionCreators';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './Auth.css';

class Signup extends React.Component {
  constructor() {
    super()

    this.state = {
      name: '',
      email: '',
      password: '',
      image: 'https://i.pinimg.com/236x/17/a0/80/17a08083f73ab4e6b273c3a9857d38e2--invisible-ink--bit.jpg'
    }
  }

  async onSuccess() {
    this.props.history.push('/login');

  }

  async onSuccessForGoogleOrFacebook() {
    this.props.history.push('/');
    window.location.reload(true);
  }

  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      console.log('Local user signed up with Firebase.')
      let payload = {
        name: this.state.name,
        email: authData.providerData[0].email,
        uid: authData.uid,
        image: this.state.image
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
        console.log('Local user saved to sql db.')
        this.onSuccess()
        //
      } catch (err) {
        console.log('Error saving local user to sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error signing up local user with Firebase. Err: ', err.message)
    }
  }

  async onGoogleClickHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().signInWithPopup(googleProvider)
      console.log('User signed in with Firebase->Google.');
      await localStorage.setItem('activeUid', authData.user.uid);

      let payload = {
        email: authData.user.email,
        name: authData.user.displayName,
        uid: authData.user.uid,
        image: authData.user.photoURL
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
        console.log('Google user saved to sql db.', data)
        try {
           const data = await axios.get(`${url.restServer}/api/users/getUser`, {params: {uid: localStorage.getItem('activeUid')}})
           console.log('data from getUSer request in psql via fb login', data)
           await localStorage.setItem('activeUid', data.data.rows[0].uid)
           await localStorage.setItem('activeId', data.data.rows[0].id)
           await localStorage.setItem('name', data.data.rows[0].name)
           await localStorage.setItem('email', data.data.rows[0].email)
           await localStorage.setItem('accountType', data.data.rows[0].type)
           await localStorage.setItem('profilePictureURL', data.data.rows[0].image)
           await this.props.setActiveUser(data.data.rows[0])
           await this.props.setUserData(data.data.rows[0])
           setTimeout(()=>{this.onSuccessForGoogleOrFacebook()}, 1000)
        } catch (err) {
          console.log('error...', err)
        }
      } catch (err) {
        console.log('Error saving Google user to sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error signing in Google user with Firebase. Err: ', err.message)
    }
  }

  async onFacebookClickHandler(e) {
    e.preventDefault();
    try {
      const data = await firebase.auth().signInWithPopup(facebookProvider);
      console.log('User signed in with Firebase->Facebook.');
      await localStorage.setItem('activeUid', data.user.uid);

      let payload = {
        email: data.user.email,
        name: data.user.displayName,
        uid: data.user.uid,
        image: data.additionalUserInfo.profile.picture.data.url
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
        console.log('Facebook user saved to sql db.')
        try {
           const data = await axios.get(`${url.restServer}/api/users/getUser`, {params: {uid: localStorage.getItem('activeUid')}})
           await localStorage.setItem('activeUid', data.data.rows[0].uid)
           await localStorage.setItem('activeId', data.data.rows[0].id)
           await localStorage.setItem('name', data.data.rows[0].name)
           await localStorage.setItem('email', data.data.rows[0].email)
           await localStorage.setItem('accountType', data.data.rows[0].type)
           await localStorage.setItem('profilePictureURL', data.data.rows[0].image)
           await this.props.setActiveUser(data.data.rows[0])
           await this.props.setUserData(data.data.rows[0])
           setTimeout(()=>{this.onSuccessForGoogleOrFacebook()}, 1000)

        } catch (err) {
          console.log('error...', err)
        }
      } catch (err) {
        console.log('Error saving Facebook user to sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error signing in Facebook user with Firebase. Err: ', err.message)
    }
  }


  handleInputChange(e) {
    let value = e.target.value;
    let id = e.target.id;
    this.setState({ [id]: value });
  }

  render() {
    return (
      <div className="container signup-box col-sm-4">
        {/* Header */}
        <div className="d-flex justify-content-center header">
          <div className="col-sm-3 text-center">
            <h2>Signup</h2>
            <hr/>
          </div>
        </div>
        {/* OAuth */}
        <div className="container text-center">
          <div className="google input-spacing">
            <button className="btn btn-danger col-sm-5" onClick={this.onGoogleClickHandler.bind(this)}>Google</button>
          </div>
          <div className="facebook input-spacing">
            <button className="btn btn-primary col-sm-5" onClick={this.onFacebookClickHandler.bind(this)}>Facebook</button>
          </div>
        </div>
        <hr className="login-split"/>
        {/* Email/Password */}
        <div className="container text-center">
          <form action="submit" onSubmit={this.onSubmitHandler.bind(this)}>
            <div className="input-spacing d-flex justify-content-center">
              <input className="form-control col-sm-5 text-center" onChange={this.handleInputChange.bind(this)} type="text" id="name" placeholder="Full Name" autoFocus={true} required/>
            </div>
            <div className="input-spacing d-flex justify-content-center">
              <input className="form-control col-sm-5 text-center" onChange={this.handleInputChange.bind(this)} type="text" id="email" placeholder="Email" required/>
            </div>
            <div className="input-spacing d-flex justify-content-center">
              <input className="form-control col-sm-5 text-center" onChange={this.handleInputChange.bind(this)} type="password" id="password" placeholder="Password" required/>
            </div>
            <div className="input-spacing">
              <button className="btn btn-outline-dark col-sm-2">Signup</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    active_user: state.active_user,
    user_data: state.user_data
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({setActiveUser: setActiveUser, setUserData: setUserData}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Signup);