import "babel-polyfill";
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import firebase from 'firebase';
import Dropzone from 'react-dropzone';
import upload from 'superagent';
import url from '../../config'
import './EditUserInfo.css'

class EditUserInfo extends React.Component {
  constructor () {
    super();
    this.state = {
      city: '',
      bio: '',
      imageObj: '',
      imagePrev: '',
      image: 'http://ugc.reveliststatic.com/gen/full/2016/07/12/14/d7/ug/phhckvfb402qbwe.gif',
      uid: localStorage.getItem('activeUid')
    }
  }

  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      const data = await   upload
      .post(`${url.restServer}/api/files/upload`)
      .attach('theseNamesMustMatch', this.state.imageObj)
      .field('keypath', 'profiles/' + window.localStorage.email + '/profilePic/' + this.state.imageObj.name)
      .field('endurl', 'profiles/' + encodeURIComponent(window.localStorage.email) + '/profilePic/' + this.state.imageObj.name)
  
      // async issue here:

      this.setState({
        image: data.body.url
      })

    } catch (err) {
      console.log('error uploading to s3', err)
    }
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
      const data = await axios.put(`${url.restServer}/api/users/editUser`, payload);

      // update user skills
      // const skills = await axios.put(`${url.restServer}/api/editSkills`);

      console.log('changes submitted', data);
      this.props.history.push(`/user/${this.state.uid}`);
      // refresh the page to load the new profile picture
      // window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
  }

  onChangeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  _onDrop(files) {
    let file = files[0];
    console.log('file', file)
    this.setState({
      imageObj: file,
      imagePrev: file.preview
    })
  }

  render() {
    return (
      <div className="d-flex justify-content-center">
        <div className="card box edit-user-component">
          <div>
            <div className="text-center edit-user-header">
              <h1>Edit User Info</h1>
            </div>
            <div className="d-flex justify-content-center">
              <form onSubmit={this.onSubmitHandler.bind(this)}>
                {/* Location */}
                <div className="input-spacing">
                  <div className="text-center">
                    <h5>Location</h5>
                    <hr/>
                  </div>
                  <input className="form-control text-center" onChange={this.onChangeHandler.bind(this)} name='city' type="text" placeholder="City, State"/>
                </div>
                {/* Bio */}
                <div className="input-spacing">
                  <div className="text-center">
                    <h5>Bio</h5>
                    <hr/>
                  </div>
                  <textarea className="form-control text-center" onChange={this.onChangeHandler.bind(this)} name="bio" id="" cols="30" rows="2" placeholder="Tell us about yourself"></textarea>
                </div>
                {/* Profile Photo */}
                {/* Dropzone to add photos by click or dragging*/}
                <div>
                  <div className="text-center">
                    <h5>Profile Photo</h5>
                    <hr/>
                  </div>
                  <div>
                    <Dropzone
                      className="card dropzone"
                      accept="image/jpeg, image/jpg, image/png"
                      multiple={false}
                      onDropAccepted={ this._onDrop.bind(this) } maxSize={ 2000000 }
                      onDragLeave= {this._onDrop.bind(this) } maxSize={ 2000000 }
                      // onDropRejected = {can render a warning if we want}
                    >
                      <div className="">
                        {!this.state.imagePrev ? 
                          <div className="text-center">
                            <p className="dropzone-text"> Click or drag photo </p> 
                            <p> Limit 2mb </p>
                          </div>
                        :
                          <div className="text-center">
                            <div > <p> Preview </p> </div>
                            <img className="dropzone-photo" src={this.state.imagePrev} />   
                          </div>
                        }
                      </div>
                    </Dropzone>
                  </div>
                </div>
                {/* Submit */}
                <div className="d-flex justify-content-center dropzone-submit">
                  <button className="btn btn-outline-dark">Submit</button>
                </div>
              </form>
            </div>
          </div>
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