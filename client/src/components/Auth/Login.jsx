import React from 'react';
import firebase from '../../lib.js';
import {googleProvider, facebookProvider} from '../../lib.js';
import axios from 'axios';
import 'babel-polyfill';

import url from '../../config'


class Login extends React.Component {
  constructor() {
    super()

    this.state = {
      email: '',
      password: '',
    }

    this.onSuccess = this.onSuccess.bind(this);
  }

  onSuccess () {
    this.props.history.push('/');
    window.location.reload(true);
  };

  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
      console.log('Local user logged in via Firebase.', authData)
      let payload = {
        email: authData.providerData[0].email,
        uid: authData.uid
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/login`, payload)
        console.log('Local user data from sql db. Data: ', data)
        localStorage.setItem('email', data.data.email);
        this.onSuccess();
      } catch (err) {
        console.log('Error querying local user data from sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error logging in local user via Firebase. Err: ', err.message)
    }
  }

  async onGoogleClickHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().signInWithPopup(googleProvider)
      console.log('User signed in with Firebase->Google.');
      localStorage.setItem('email', authData.user.email);
      let payload = {
        email: authData.user.email,
        name: authData.user.displayName,
        uid: authData.user.uid,
        image: authData.user.photoURL
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
        console.log('Google user saved to sql db.')
        this.onSuccess();
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
      localStorage.setItem('email', data.user.email);
      let payload = {
        email: data.user.email,
        name: data.user.displayName,
        uid: data.user.uid,
        image: data.additionalUserInfo.profile.picture.data.url
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
        console.log('Facebook user saved to sql db.')
        this.onSuccess();
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
      <div>
        Inside Login
        <br/>
        <button onClick={this.onGoogleClickHandler.bind(this)}>Google</button>
        <button onClick={this.onFacebookClickHandler.bind(this)}>Facebook</button>
        <hr/>
        <form action="submit" onSubmit={this.onSubmitHandler.bind(this)} >
          email:
          <input onChange={this.handleInputChange.bind(this)} type="text" id="email" placeholder="email"/>
          password:
          <input onChange={this.handleInputChange.bind(this)} type="password" id="password" placeholder="password"/>
          <button>Login</button>
        </form>
      </div>
    )
  }
}

export default Login;