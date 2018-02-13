import React from 'react';
import ListingReviewEntry from './ListingReviewEntry';
import axios from 'axios'
import url from '../../config'


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
          <h2 className="card-title"> Reviews </h2>
          {this.state.reviews.length === 0 
            ?
              <div/>
              :
              this.state.reviews.map((review, i) => {
                return <div key={i} className="card-text"> <hr/> <ListingReviewEntry review={review}/> </div>
              })
          }
        </div>
      </div>
    )
  }
}

export default ListingReviewsList;