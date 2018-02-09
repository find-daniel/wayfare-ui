import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import '../UserInfo.css'

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
    const data = await axios.get('http://localhost:3396/api/users/getUser', {params: {uid: this.props.location.state.hostUid}});
    const reviewsData = await axios.get('http://localhost:3396/api/users/getUserReviews', {
      params: {userId: this.props.location.state.hostId}
    });
    const reviews = reviewsData.data.rows;
    const info = data.data.rows[0];
    this.setState({ 
      name: info.name,
      city: info.city,
      bio: info.bio,
      img: info.image,
      hostRating: info.hostrating,
      guestRating: info.guestrating,
      reviews
    });
  }

  render () {
    return (
      <div className="container" >
        <div className="card container" >
          <h1>{this.state.name}</h1>
          <img className="img-fluid profile-pic" src={this.state.img} alt=""/>
          <p>City: {this.state.city}</p>
          <p>Bio: {this.state.bio}</p>
        </div>
        <div className="container" >
          <h1>inside reviews box</h1>
          <p>Host Rating: {this.state.hostRating}</p>
          <p>Guest Rating: {this.state.guestRating}</p>
          <p>Reviews</p>
          {this.state.reviews.map(review => {
            return <li key={review.id} > {review.review} </li>
          })}
        </div>
      </div>
    )
  }
}

export default PublicUserPage;