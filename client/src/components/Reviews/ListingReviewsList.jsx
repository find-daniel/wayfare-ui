import React from 'react';
import ListingReviewEntry from './ListingReviewEntry';
import axios from 'axios'


class ListingReviewsList extends React.Component {

  constructor(props) {
    super(props); 

    this.state = {
      reviews: [] 
    }
  }

  async componentDidMount() {
    let reviews = await axios.get('http://localhost:3396/api/users/getUserReviews', {
      params: {userId: this.props.hostId}
    }); 
    this.setState({
      reviews : reviews.data.rows
    })
    console.log(reviews); 
  }

  render() {
    return (
      <div>
        <h2> Reviews </h2>
        {this.state.reviews.length === 0 
          ?
            <div/>
            :
            this.state.reviews.map(review => {
              return <ListingReviewEntry review={review}/>
            })
        }
      </div>
    )
  }
}

export default ListingReviewsList;