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
        <div className="card public-user-info col-sm-4">
          <div className="card-img-top public-img-background">
            <img className="img-fluid public-profile-pic" src={this.state.img} alt=""/>
          </div>
          <div className="card-body public-user-card-body">
            <div className="text-center public-user-card-header">
              <h1>{this.state.name}</h1>
            </div>
            <div>
              <div className="public-user-bio">
                <div className="col-sm-6">
                  <h4>City</h4>
                  <p>{this.state.city}</p>
                </div>
              </div>
              <div className="public-user-bio">
                <div className="col-sm-12">
                  <h4>Bio</h4>
                  <p>{this.state.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="offset-sm-1 col-sm-6">
          <div className="public-reviews-box row">
            <div className="col-sm-6">
              <div className="public-user-ratings text-center">
                <h5>Host Rating</h5>
                <hr/>
              </div>
              <div className="text-center">
                {
                  this.state.hostRating > 3 ?
                    <h5><span className="badge badge-success">{this.state.hostRating}</span></h5>
                  : 
                  this.state.hostRating > 2 ?
                    <h5><span className="badge badge-warning">{this.state.hostRating}</span></h5>
                  :
                  this.state.hostRating < 2 ?
                    <h5><span className="badge badge-danger">{this.state.hostRating}</span></h5>
                  :
                    null
                }
              </div>
            </div>
            <div className="col-sm-6">
              <div className="public-user-ratings text-center">
                <h5>Guest Rating</h5>
                <hr/>
              </div>
              <div className="text-center">
                {
                  this.state.guestRating > 3 ?
                    <h5><span className="badge badge-success">{this.state.guestRating}</span></h5>
                  : 
                  this.state.guestRating > 2 ?
                    <h5><span className="badge badge-warning">{this.state.guestRating}</span></h5>
                  :
                  this.state.guestRating < 2 ?
                    <h5><span className="badge badge-danger">{this.state.guestRating}</span></h5>
                  :
                    null
                }
              </div>
            </div>
          </div>
          <div className="public-user-reviews-header">
            <div className="text-center">
              <h4>Reviews</h4>
              <hr/>
            </div>
            <div className="">
              <ul className="public-user-reviews-ul list-group">
                {this.state.reviews.map(review => {
                  return <li className="list-group-item public-user-review-li" key={review.id}>
                          <div className="row">
                            <div className="col-sm-9">
                              <h5>{review.commentor}</h5>
                            </div>
                            <div className="col-sm-3">
                              {
                                review.rating > 3 ?
                                  <h5><span className="badge badge-success">{review.rating}/5</span></h5>
                                : 
                                review.rating > 2 ?
                                  <h5><span className="badge badge-warning">{review.rating}/5</span></h5>
                                :
                                review.rating < 2 ?
                                  <h5><span className="badge badge-danger">{review.rating}/5</span></h5>
                                :
                                  null
                              }
                            </div>
                          </div>
                          <div>
                            {review.review}
                          </div>
                         </li>
                })}
              </ul>
            </div>
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