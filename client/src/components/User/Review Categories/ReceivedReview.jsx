import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ReceivedReview extends React.Component {
  constructor() {
    super();
    this.state = {
      reviews: []
    }
  }
  
  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:3396/api/users/getUserReviews', {
        params: {userId: localStorage.getItem('activeId')}
      });
      const reviews = response.data.rows
      const accountType = await localStorage.getItem('accountType')
      const activeUserName = await this.props.user_data.name

      const payload = []
      if (accountType === '0') {
        reviews.map(review => {
          if (review.type === 'host' && activeUserName === review.commentee) {
            payload.push(review)
          }
        })
      } 
      if (accountType === '1') {
        reviews.map(review => {
          if (review.type === 'guest' && activeUserName === review.commentee) {
            payload.push(review)
          }
        })
      }
      await this.setState({reviews: payload})
    } catch(err) {
      throw new Error(err);
    }
  }
  
  render () {
    return (
      <div>
        <h2>This is a review you've received</h2>
        {
          this.state.reviews.map(review => {
            return (
              <div key={review.id}>
                <div>
                  {`Review By: ${review.commentor}`}
                </div>
                <div>
                  {`Rating: ${review.rating}`}
                </div>
                <div>
                  {`Review: ${review.review}`}
                </div>
                <br />
              </div>              
            )
          })
        }
      </div>
    )
  }
};

function mapStateToProps(state) {
  return {
    user_data: state.user_data
  }
}

export default connect(mapStateToProps)(ReceivedReview);