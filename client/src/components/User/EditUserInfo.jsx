import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

class EditUserInfo extends React.Component {
  async onSubmitHandler(e) {
    e.preventDefault();
    try {
      // PUT to udpate user row
      axios.put();

      console.log('changes submitted');
      this.props.history.push('/user/:userId');
    } catch (err) {
      console.error(err);
    }
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
              <input type="text" placeholder="City, State"/>
            </div>
            {/* Profile Photo */}
            <div>
              <p>Profile Photo</p>
              <input type="file"/>
            </div>
            {/* Bio */}
            <div>
              <p>Bio</p>
              <textarea name="bio" id="" cols="30" rows="10" placeholder="Tell us about yourself"></textarea>
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

  }
};

function mapDispatchToProps (dispatch) {

};

export default connect(mapStateToProps, mapDispatchToProps)(EditUserInfo);