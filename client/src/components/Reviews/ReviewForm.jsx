import React from 'react';
import axios from 'axios';
import "babel-polyfill";
import './reviews.css'
import url from '../../config'
import { Link } from 'react-router-dom';


class ReviewForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      stars: [false, false, false, false, false], 
      setStar: -1
    }
    
    this.onMouseOverHandler = this.onMouseOverHandler.bind(this); 
    this.onMouseOutHandler = this.onMouseOutHandler.bind(this); 
    this.onClickHandler = this.onClickHandler.bind(this); 
    this.onSubmit = this.onSubmit.bind(this); 
  }

  onMouseOverHandler(i) {
    let arr = this.state.stars; 
    arr.forEach((star, j) => {
      if (j<=i){
        arr[j] = true
      }
    })
    this.setState({
      stars: arr
    })
  }

  onMouseOutHandler() {
    let arr = this.state.stars; 
    arr.forEach((star, i) => {
      arr[i] = false
    })
    this.setState({
      stars: arr
    })
  }
  
  async onClickHandler(i) {
    let arr = this.state.stars; 
    arr.forEach((star, j) => {
      if (j<=i) {
        arr[j] = true; 
      }else {
        arr[j] = false; 
      }
    })
    this.setState({
      stars: arr,
      setStar : i
    })

  }

  async onSubmit() {
    const reviewDetails = {}; 
    reviewDetails.rating = (this.state.setStar + 1); 
    reviewDetails.review = this.refs.review.value; 
    reviewDetails.commentor = this.props.location.state.commentor;  
    reviewDetails.commentee = this.props.location.state.commentee; 
    reviewDetails.listingId = this.props.location.state.listingId; 
    reviewDetails.type = this.props.location.state.type; 

    const data = await axios.post(`${url.restServer}/api/users/postReview`, {reviewDetails: reviewDetails})
    const userid = localStorage.activeId; 
    const userData = await axios.get(`${url.restServer}/api/users/getUserData`, {params: {userId: userid}})

    if (localStorage.accountType === '1') {
      let hostRatingCount = userData.data.hostratingcount; 
      let hostRating = userData.data.hostrating; 

      let newRating = Number(hostRating) * hostRatingCount + reviewDetails.rating; 
      hostRatingCount++; 
      newRating = newRating/hostRatingCount; 

      let data = await axios.put(`${url.restServer}/api/users/updateHostRating`, {userId: userid, hostRatingCount: hostRatingCount , hostRating: newRating})
    } else {
      let guestRatingCount = userData.data.guestratingcount; 
      let guestRating = userData.data.guestrating; 

      let newRating = Number(guestRating) * guestRatingCount + reviewDetails.rating; 
      guestRatingCount++; 
      newRating = newRating/guestRatingCount; 

      let data = await axios.put(`${url.restServer}/api/users/updateGuestRating`, {userId: userid, guestRatingCount: guestRatingCount , guestRating: newRating})
    }
  }

  render() {
    return (
      <div>
        <h1> Review {this.props.hostname} </h1> 
        <div>
          {this.state.stars.map((star, i) => {
            return (<span key={i}>
            {i<=this.state.setStar 
            ?
              (<img className='yellowStar' onClick={() => this.onClickHandler(i)} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/768px-Gold_Star.svg.png"/>)
            :
            <span>
              {star 
              ?
              (<img className='yellowStar' onMouseLeave={this.onMouseOutHandler} onClick={() => this.onClickHandler(i)} src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Gold_Star.svg/768px-Gold_Star.svg.png"/>)
              :
              (<img className='star' onMouseOver={() => this.onMouseOverHandler(i)} onClick={() => this.onClickHandler(i)} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Five-pointed_star.svg/1088px-Five-pointed_star.svg.png"/>)
              }
            </span>
          }
          </span>
          )})}
        </div>  
        <p/>   
        <textarea type="text" ref="review" placeholder="Give review" style={{width:'30%', height:'100px'}}></textarea>
        <div><Link to={`/user/${this.props.match.params.userid}/reviews/given`} onClick={this.onSubmit} type="button" className="btn">Submit</Link></div>
      </div>
    )
  }
}

export default ReviewForm;
