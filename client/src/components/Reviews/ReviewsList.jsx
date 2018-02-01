import React from 'react';
import ReviewEntry from './ReviewEntry';

class ReviewsList extends React.Component {
  render() {
    return (
      <div>
        <h3> Inside ReviewsList </h3>
        {/* Map */}
        <ReviewEntry />
      </div>
    )
  }
}

export default ReviewsList;