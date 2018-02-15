import React from 'react';
import '../Listings/listings.css'

class ListingReviewEntry extends React.Component {
  constructor(props) {
    super(props); 

    this.state = ({
      review: this.props.review
    })
  }

  render() {
    return (
      <li className="list-group-item review-box">
        <div className="row">
          <div className="col-sm-2 listing-review-rating">
            <h4>{this.state.review.rating}/5</h4>
          </div>
          <div className="col-sm-10">
            <div className="review-commentor">
              <h5>{this.state.review.commentor}</h5>
              <hr/>
            </div>
            <div>
              <p>{this.state.review.review}</p>
            </div>
          </div>
        </div>
      </li>
    )
  }
}

export default ListingReviewEntry;