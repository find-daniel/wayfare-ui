import React from 'react';
import axios from 'axios';

class GivenReviews extends React.Component {
  constructor() {
    super();
    this.state = {
      reviews: []
    }
  }

  async componentDidMount() {    
    try {
      const response = await axios.get('http://localhost:3396/api/users/getGivenReviews', {
        params: {userId: localStorage.getItem('activeId')}
      });
      const accountType = await localStorage.getItem('accountType')
      console.log('AT', accountType, typeof accountType)
      console.log(response.data)
      
      const payload = []
      if (accountType === '0') {
        console.log('0')
        response.data.map(review => {
          console.log(review.type)
          if (review.type === 'guest' //&& check if active user is commentor) {
            payload.push(review)
          }
        })
      }
      if (accountType === '1') {
        console.log('1')
        response.data.map(review => {
          console.log(review.type)
          if (review.type === 'host' // && check if active user is commentor)) {
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
        <h2>This is a review you've given</h2>
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



export default GivenReviews;