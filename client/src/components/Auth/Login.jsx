import React from 'react';
import firebase from '../../lib.js';
import {googleProvider, facebookProvider} from '../../lib.js';
import axios from 'axios';
import 'babel-polyfill';

class Login extends React.Component {
  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().signInWithEmailAndPassword('ubuntu@gmail.com', 'ubuntu?')
      console.log('Local user logged in via Firebase. authData:', authData)
      let payload = {
        email: authData.providerData[0].email,
        uid: authData.uid
      }
      try {
        const data = await axios.post('http://localhost:3396/api/auth/login', payload)
        console.log('Local user data from sql db. Data: ', data)
      } catch (err) {
        console.log('Error querying local user data from sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error logging in local user via Firebase. Err: ', err)
    }
  }

  async onGoogleClickHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().signInWithPopup(googleProvider)
      console.log('User signed in with Firebase->Google. authData:', authData);
      let payload = {
        email: authData.user.email,
        name: authData.user.displayName,
        uid: authData.user.uid,
        image: authData.user.photoURL
      }
      try {
        const data = await axios.post('http://localhost:3396/api/auth/signup', payload)
        console.log('Google user saved to sql db. Data: ', data)
      } catch (err) {
        console.log('Error saving Google user to sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error signing in Google user with Firebase. Err: ', err)
    }
  }

  async onFacebookClickHandler(e) {
    e.preventDefault();
    try {
      const data = await firebase.auth().signInWithPopup(facebookProvider);
      console.log('User signed in with Firebase->Facebook. authData: ', data);
      let payload = {
        email: data.user.email,
        name: data.user.displayName,
        uid: data.user.uid,
        image: data.additionalUserInfo.profile.picture.data.url
      }
      try {
        const data = await axios.post('http://localhost:3396/api/auth/signup', payload)
        console.log('Facebook user saved to sql db. Data :', data)
      } catch (err) {
        console.log('Error saving Facebook user to sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error signing in Facebook user with Firebase. Err: ', err)
    }
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
          <input type="text" placeholder="email"/>
          password:
          <input type="text" placeholder="password"/>
          <button>Login</button>
        </form>
      </div>
    )
  }
}

export default Login;