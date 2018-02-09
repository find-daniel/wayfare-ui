import React from 'react';
import SearchBar from '../Search/SearchBar';
import ListingInfo from './ListingInfo';
import Pictures from './Pictures';
import Mymap from '../Map/Map';
import ListingReviewsList from '../Reviews/ListingReviewsList';
import axios from 'axios'; 
import "babel-polyfill";
import './listings.css'

class ListingPage extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      listingId: this.props.match.params.listingId,
      listing: '', 
      listingURL: '',
      user: '', 
      skills: '', 
      alert: false
    }
  }
  async componentDidMount() {
    let listing = await axios.get('http://localhost:3396/api/listing/getListing', {
      params: {listingId: this.state.listingId}
    }); 
    let userId = await axios.get('http://localhost:3396/api/users/getUserData', {
      params: {userId: listing.data.hostid}
    }); 
    let skills = await axios.get('http://localhost:3396/api/listing/getListingSkills', {
      params: {listingId: this.state.listingId}
    }); 
    this.setState ({
      listing: listing.data, 
      listingAddressURL: listing.data.address.split(' ').join('+'),
      listingCityURL: listing.data.city.split(' ').join('+'),
      listingStateURL: listing.data.state,
      user: userId.data, 
      skills: skills.data
    })
    
    let geodata = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.listingAddressURL},+${this.state.listingCityURL},+${this.state.listingStateURL}&key=AIzaSyBvPqU7ldLdjnZvfEvXs9WIAJbbcodpfBE`)
    let parsedGeoData = JSON.parse(geodata.request.responseText)
    
    this.setState({
      lat: parsedGeoData.results[0].geometry.location.lat,
      lng: parsedGeoData.results[0].geometry.location.lng
    })

    let viewCount = await axios.post('http://localhost:3396/api/listing/updateListingViewCount', {
      params: {listingId: this.state.listingId}
    }); 
    viewCount = viewCount.data.rows[0].viewcount; 
    if (viewCount === 1) {
      this.setState ({
        alert: true
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.alert 
          ?
          <div class="alert alert-success center" role="alert">
            <strong>Success!</strong> You have successfully created a listing!
          </div>
          :
          <div/>
          }

        <p/>
        <h2 className="title">{this.state.listing.title}</h2>
        <hr/>
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <div className="row">
                <Pictures listingId={this.state.listingId}/>
              </div>
              <p/>
              <div className="row reviews">
                {this.state.listing === ''
                  ?
                    <div>  </div>
                  :
                  <ListingReviewsList hostId={this.state.listing.hostid}/>
                }
              </div>
              </div>
            <div className="col-md-1"/>
            <div className="col-md-5">
                <ListingInfo listing={this.state.listing} user={this.state.user}  skills={this.state.skills}/>
            </div>
          </div>
          <div className="row">
            <div className="col align-self-center">
              <Mymap listing={this.state.listing} lat={this.state.lat} lng={this.state.lng}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default ListingPage;