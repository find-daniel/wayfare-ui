import React from 'react';
import ListingReviewEntry from './ListingReviewEntry';
import axios from 'axios'
import url from '../../config'
import '../Listings/listings.css'


class ListingReviewsList extends React.Component {

  constructor(props) {
    super(props); 

    this.state = {
      reviews: [] 
    }
  }

  async componentDidMount() {
    let reviews = await axios.get(`${url.restServer}/api/users/getUserReviews`, {
      params: {userId: this.props.hostId}
    }); 
    this.setState({
      reviews : reviews.data.rows
    })
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <h3 className="card-title"> Reviews </h3>
          <hr/>
          <div>
            <ul className="list-group review-list-ul">
              {
                this.state.reviews.length === 0 
                ?
                <div>
                  <h6>None</h6>
                </div>
                :
                this.state.reviews.map((review, i) => {
                  return <ListingReviewEntry key={i} review={review}/>
                })
              }
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default ListingReviewsList;