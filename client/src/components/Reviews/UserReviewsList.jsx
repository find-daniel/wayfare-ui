import React from 'react';
import UserReviewEntry from './UserReviewEntry';

class UserReviewList extends React.Component {
  render() {
    return (
      <div>
        <h3> Inside UserReviewList </h3>
        {/* Map */}
        <UserReviewEntry />
      </div>
    )
  }
}

export default UserReviewList;