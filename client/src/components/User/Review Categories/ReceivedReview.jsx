import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'
import './UserReviews.css'

class ReceivedReview extends React.Component {
  constructor() {
    super();
    this.state = {
      reviews: []
    }
  }
  
  async componentDidMount() {
    try {
      const response = await axios.get(`${url.restServer}/api/users/getUserReviews`, {
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
      <div className="reviews-outer-box">
      <ul className="list-group">
        {
          this.state.reviews.map(review => {
            return (
              <li className="list-group-item reviews-box d-flex justify-content-around" key={review.id}>
                <div className="col-sm-9">
                  <div>
                    <h3>{`Reviewer: ${review.commentor}`}</h3>
                    <hr/>
                  </div>
                  <div>
                    {review.review}
                  </div>
                </div>
                <div className="col-sm-3 rating-badges">
                  <div className="d-flex justify-content-around">
                    {
                      review.rating > 3
                      ?
                      <h2> <span className="badge badge-success">{`${review.rating}/5`}</span> </h2>
                      :
                      review.rating <= 3 &&  review.rating >= 2
                      ?
                      <h2> <span className="badge badge-warning">{`${review.rating}/5`}</span> </h2>
                      :
                      review.rating < 2
                      ?
                      <h2> <span className="badge badge-danger">{`${review.rating}/5`}</span> </h2>
                      :
                      null
                    }
                  </div>
                </div>
              </li>              
            )
          })
        }
      </ul>
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