import React from 'react';
import firebase from '../../lib.js';
import {googleProvider, facebookProvider} from '../../lib.js';
import axios from 'axios';
import 'babel-polyfill';

class Signup extends React.Component {
  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      const authData = await firebase.auth().createUserWithEmailAndPassword('ubuntu@gmail.com', 'ubuntu?')
      console.log('Local user signed up with Firebase. authData:', authData)
      let payload = {
        email: authData.providerData[0].email,
        uid: authData.uid
      }
      try {
        const data = await axios.post('http://localhost:3396/api/auth/signup', payload)
        console.log('Local user saved to sql db. Data: ', data)
      } catch (err) {
        console.log('Error saving local user to sql db. Err: ', err)
      }
    } catch (err) {
      console.log('Error signing up local user with Firebase. Err: ', err)
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
        Inside Signup
        <br/>
        <button onClick={this.onGoogleClickHandler.bind(this)}>Google</button>
        <button onClick={this.onFacebookClickHandler.bind(this)}>Facebook</button>
        <hr/>
        <form action="submit" onSubmit={this.onSubmitHandler.bind(this)}>
          email:
          <input type="text" placeholder="email"/>
          password:
          <input type="text" placeholder="password"/>
          <button>Submit</button>
        </form>
      </div>
    )
  }
}

export default Signup;