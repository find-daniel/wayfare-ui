import React from 'react';
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
            <Link to="/user/:userId/edit"><button>Edit</button></Link>
          </div>
        </div>
      </div>
    )
  }
}

export default UserInfo;