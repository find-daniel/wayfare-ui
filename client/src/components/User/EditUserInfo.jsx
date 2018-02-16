import "babel-polyfill";
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import firebase from 'firebase';
import Dropzone from 'react-dropzone';
import upload from 'superagent';
import url from '../../config'
import { setActiveUser, setUserData } from '../../actions/actionCreators';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import './EditUserInfo.css'

class EditUserInfo extends React.Component {
  constructor () {
    super();
    this.state = {
      city: '',
      bio: '',
      imageObj: '',
      imagePrev: '',
      image: 'https://i.pinimg.com/236x/17/a0/80/17a08083f73ab4e6b273c3a9857d38e2--invisible-ink--bit.jpg',
      uid: localStorage.getItem('activeUid'),
      loaded: false
    }
  }

  async componentDidMount () {
    const data = await axios.get(`${url.restServer}/api/users/getUser`, {params: {uid: this.state.uid}})
    const {city, bio, image} = data.data.rows[0];
    
    if (city) {
      await this.setState({
        city: city,
        bio: bio,
        image: image
      }) 
    }
    this.setState({
      loaded: true
    })
  }

  async onSubmitHandler(e) {
    e.preventDefault();
    if (this.state.imagePrev) {
      try {
        const data = await upload
        .post(`${url.restServer}/api/files/upload`)
        .attach('theseNamesMustMatch', this.state.imageObj)
        .field('keypath', 'profiles/' + window.localStorage.email + '/profilePic/' + this.state.imageObj.name)
        .field('endurl', 'profiles/' + encodeURIComponent(window.localStorage.email) + '/profilePic/' + this.state.imageObj.name)
    
        this.setState({
          image: data.body.url
        })
  
      } catch (err) {
        console.log('error uploading to s3', err)
      }
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

      if (this.state.image) {
        await localStorage.setItem('profilePictureURL', this.state.image);
      }

      // update user skills
      // const skills = await axios.put(`${url.restServer}/api/editSkills`);

      this.props.history.push(`/user/${this.state.uid}`);
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
    this.setState({
      imageObj: file,
      imagePrev: file.preview
    })
  }

  render() {
    if (!this.state.loaded) {
      return (null)
    } else {
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
                    {/* Prefill data if exists in DB already  */}
                    {this.state.city ? 
                      <input className="form-control text-center" onChange={this.onChangeHandler.bind(this)} name='city' type="text" value={this.state.city}/>
                      :
                      <input className="form-control text-center" onChange={this.onChangeHandler.bind(this)} name='city' type="text" placeholder="City, State"/>
                    }
                  </div>
                  {/* Bio */}
                  <div className="input-spacing">
                    <div className="text-center">
                      <h5>Bio</h5>
                      <hr/>
                    </div>

                    {/* Prefill data if exists in DB already  */}
                    {this.state.bio ?
                      <textarea className="form-control text-center" onChange={this.onChangeHandler.bind(this)} name="bio" id="" cols="30" rows="2" value={this.state.bio}></textarea>
                      :
                      <textarea className="form-control text-center" onChange={this.onChangeHandler.bind(this)} name="bio" id="" cols="30" rows="2" placeholder="Tell us about yourself"></textarea>
                    }

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
  }
};

function mapStateToProps(state) {
  return {
    active_user: state.active_user,
    user_data: state.user_data
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({setActiveUser: setActiveUser, setUserData: setUserData}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(EditUserInfo);