import React from 'react';
import ListingReviewEntry from './ListingReviewEntry';

class ListingReviewsList extends React.Component {
  render() {
    return (
      <div>
        <h3> Inside ListingReviewsList </h3>
        {/* Map */}
        <ListingReviewEntry />
      </div>
    )
  }
}

export default ListingReviewsList;