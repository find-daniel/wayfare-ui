import React from 'react';

class ListingReviewEntry extends React.Component {
  constructor(props) {
    super(props); 

    this.state = ({
      review: this.props.review
    })
  }

  render() {
    return (
      <div>
        <h4>{this.state.review.rating}/5 STARS</h4>
        <p>{this.state.review.review}</p>
        <p>---{this.state.review.commentor}</p>
      </div>
    )
  }
}

export default ListingReviewEntry;