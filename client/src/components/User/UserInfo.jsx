import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class UserInfo extends React.Component {
  render() {
    return (
      <div style={{border: '1px solid black'}} >
        <h3> Inside UserInfo </h3>
        <div>
          <div>
            <h4>Rating:</h4>
          </div>
          <div>
            <h4>Bio:</h4>
          </div>
          {/* Should only be viewable if userpage patches uid */}
          <div>
            <Link to={`/user/${this.props.active_user.uid}/edit`}><button>Edit</button></Link>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    active_user: state.active_user
  }
};

export default connect(mapStateToProps)(UserInfo);