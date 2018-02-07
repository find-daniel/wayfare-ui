import React from 'react';
import SearchBar from '../Search/SearchBar';
import ListingInfo from './ListingInfo';
import Pictures from './Pictures';
import Map from '../Map/Map';
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
      user: '', 
      skills: ''
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
      user: userId.data, 
      skills: skills.data
    })
    await axios.post('http://localhost:3396/api/listing/updateListingViewCount', {
      params: {listingId: this.state.listingId}
    }); 
  }

  render() {
    return (
      <div>
        <h4 class="title">{this.state.listing.title}</h4>
        <ListingInfo listing={this.state.listing} user={this.state.user}  skills={this.state.skills}/>
        <Pictures listingId={this.state.listingId}/>
        <Map />
        {this.state.listing === ''
          ?
            <div>  </div>
          :
          <ListingReviewsList hostId={this.state.listing.hostid}/>
        }
      </div>
    )
  }
}

export default ListingPage;