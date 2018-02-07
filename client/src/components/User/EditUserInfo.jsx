import "babel-polyfill";
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase';


class EditUserInfo extends React.Component {
  constructor () {
    super();
    this.state = {
      city: '',
      bio: '',
      image: 'http://ugc.reveliststatic.com/gen/full/2016/07/12/14/d7/ug/phhckvfb402qbwe.gif',
      uid: localStorage.getItem('activeUser')
    }
  }

  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      const {city, bio, image, uid} = this.state;
      // PUT to udpate user row
      const payload = {
        city,
        bio,
        image,
        uid
      };

      // update user info
      const data = await axios.put('http://localhost:3396/api/users/editUser', payload);

      // update user skills
      // const skills = await axios.put('http://localhost:3396/api/editSkills');

      console.log('changes submitted', data);
      this.props.history.push('/user/:userId');
    } catch (err) {
      console.error(err);
    }
  }

  onChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
    console.log(`${e.target.name} : ${e.target.value}`);
  }

  render() {
    return (
      <div>
        <h1>Edit Info</h1>
        <div>
          <form onSubmit={this.onSubmitHandler.bind(this)}>
            {/* Location */}
            <div>
              <p>Location</p>
              <input onChange={this.onChangeHandler.bind(this)} name='city' type="text" placeholder="City, State"/>
            </div>
            {/* Profile Photo */}
            <div>
              <p>Profile Photo</p>
              <input onChange={this.onChangeHandler.bind(this)} name='image' type="file"/>
            </div>
            {/* Bio */}
            <div>
              <p>Bio</p>
              <textarea onChange={this.onChangeHandler.bind(this)} name="bio" id="" cols="30" rows="10" placeholder="Tell us about yourself"></textarea>
            </div>
            <button>Submit</button>
          </form>
        </div>
      </div>
    )
  }
};

function mapStateToProps (state) {
  return {
    active_user: state.active_user
  }
};

export default connect(mapStateToProps)(EditUserInfo);