import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import url from '../../../config';
import './PublicUserPage.css';

class PublicUserPage extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      name: '',
      city: '',
      bio: '',
      img: '',
      hostRating: '',
      guestRating: '',
      reviews: []
    }
  }

  async componentDidMount () {
    const data = await axios.get(`${url.restServer}/api/users/getUser`, {params: {uid: this.props.location.state.hostUid}});
    const reviewsData = await axios.get(`${url.restServer}/api/users/getUserReviews`, {
      params: {userId: this.props.location.state.hostId}
    });
    const reviews = reviewsData.data.rows;
    const info = data.data.rows[0];
    const result = []
    reviews.forEach(review => {
      if (JSON.stringify(review.commentee) === JSON.stringify(info.name)) {
        result.push(review); 
      }
    })

    this.setState({ 
      name: info.name,
      city: info.city,
      bio: info.bio,
      img: info.image,
      hostRating: info.hostrating,
      guestRating: info.guestrating,
      reviews: result
    });
  }

  render () {
    return (
      <div className="d-flex justify-content-center container public-user-box" >
        <div className="card public" >
          <h1>{this.state.name}</h1>
          <img className="row d-flex justify-content-around  img-fluid public-profile-pic" src={this.state.img} alt=""/>
          <p>City: {this.state.city}</p>
          <p>Bio: {this.state.bio}</p>
        </div>
        <div className="wireframe">
          <div className="public-reviews-box wireframe">
          <p>Host Rating: {this.state.hostRating}</p>
          <p>Guest Rating: {this.state.guestRating}</p>
          </div>
          <div className=" wireframe">
          <p>Reviews</p>
          <ul className="list-group-flush">
            {this.state.reviews.map(review => {
              return <li className="list-group-item" key={review.id} >{review.rating}/5  {review.review} -{review.commentor}</li>
            })}
          </ul>
          </div>
          </div>
        </div>
     
    )
  }
}

function mapStateToProps (state) {
  return {
    user_data: state.user_data
  }
}

export default PublicUserPage;