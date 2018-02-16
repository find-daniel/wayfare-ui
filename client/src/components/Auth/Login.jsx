import React from 'react';
import firebase from '../../lib.js';
import {googleProvider, facebookProvider} from '../../lib.js';
import axios from 'axios';
import 'babel-polyfill';
import { setActiveUser, setUserData } from '../../actions/actionCreators';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../config'
import { setTimeout } from 'timers';
import './Auth.css';


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
      let payload = {
        email: authData.providerData[0].email,
        uid: authData.uid
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/login`, payload)

        await localStorage.setItem('activeUid', data.data.rows[0].uid)
        await localStorage.setItem('activeId', data.data.rows[0].id)
        await localStorage.setItem('name', data.data.rows[0].name)
        await localStorage.setItem('email', data.data.rows[0].email)
        await localStorage.setItem('accountType', data.data.rows[0].type)
        await localStorage.setItem('profilePictureURL', data.data.rows[0].image)

        await this.props.setActiveUser(data.data.rows[0])
        await this.props.setUserData(data.data.rows[0])
        setTimeout(()=>{this.onSuccess()}, 1000)
        // this.onSuccess();
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
      await localStorage.setItem('activeUid', authData.user.uid);

      let payload = {
        email: authData.user.email,
        name: authData.user.displayName,
        uid: authData.user.uid,
        image: authData.user.photoURL
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
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
           setTimeout(()=>{this.onSuccess()}, 2000)
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
      await localStorage.setItem('activeUid', data.user.uid);

      let payload = {
        email: data.user.email,
        name: data.user.displayName,
        uid: data.user.uid,
        image: data.additionalUserInfo.profile.picture.data.url
      }
      try {
        const data = await axios.post(`${url.restServer}/api/auth/signup`, payload)
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
           setTimeout(()=>{this.onSuccess()}, 1000)

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
      <div className="container login-box col-sm-4">
        {/* Header */}
        <div className="d-flex justify-content-center header">
          <div className="col-sm-3 text-center">
            <h2>Login</h2>
            <hr/>
          </div>
        </div>
        {/* OAuth */}
        <div className="container text-center ">
          <div className="google input-spacing ">
            <button className="btn btn-danger col-sm-5 " onClick={this.onGoogleClickHandler.bind(this)}>Google</button>
          </div>
          <div className="facebook input-spacing">
            <button className="btn btn-primary col-sm-5" onClick={this.onFacebookClickHandler.bind(this)}>Facebook</button>
          </div>
        </div>
        <hr className="login-split"/>
        {/* Email/Password */}
        <div className="container text-center">
          <form action="submit" onSubmit={this.onSubmitHandler.bind(this)} >
            <div className="input-spacing d-flex justify-content-center">
              <input className="form-control col-sm-5 text-center" onChange={this.handleInputChange.bind(this)} type="text" id="email" placeholder="Email" autoFocus={true} required/>
            </div>
            <div className="input-spacing d-flex justify-content-center">
              <input className="form-control col-sm-5 text-center" onChange={this.handleInputChange.bind(this)} type="password" id="password" placeholder="Password" required/>
            </div>
            <div className="input-spacing">
              <button className="btn btn-outline-dark col-sm-2">Login</button>
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

export default connect(mapStateToProps, matchDispatchToProps)(Login);