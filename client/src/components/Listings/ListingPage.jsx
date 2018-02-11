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
      alert: false, 
      listingOwner: true, 
      edit: false
    }

    this.editInfo = this.editInfo.bind(this); 
    this.submitInfo = this.submitInfo.bind(this); 
  }
  async componentDidMount() {
    //get listing information
    let listing = await axios.get('http://localhost:3396/api/listing/getListing', {
      params: {listingId: this.state.listingId}
    }); 
    //get the host information 
    let userId = await axios.get('http://localhost:3396/api/users/getUserData', {
      params: {userId: listing.data.hostid}
    }); 
    //get listing skills
    let skills = await axios.get('http://localhost:3396/api/listing/getListingSkills', {
      params: {listingId: this.state.listingId}
    });
    let skillsArr = []; 
    skills.data.forEach(skill => {
      skillsArr.push(skill.skill);  
    })
    this.setState ({
      listing: listing.data, 
      user: userId.data, 
      skills: skillsArr
    })

    //check if the active user is the listing owner
    let currUser = await axios.get('http://localhost:3396/api/users/getUser', {
      params: {uid: localStorage.getItem('activeUid')}
    })
    currUser = currUser.data.rows[0].id; 
    if (currUser === listing.data.hostid) {
      this.setState ({
        listingOwner: true
      })
    }
    //increment view count for listing
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

  editInfo() {
    this.setState({
      edit: true
    })
  }

  async submitInfo(newInfo, deletedSkills, newSkills) {
    this.setState({
      edit: false
    })
    newInfo.title = this.refs.title.value === "" ? this.state.listing.title : this.refs.title.value; 
    newInfo.listingId = this.state.listingId

    let listingAddressURL = newInfo.address.split(' ').join('+'); 
    let listingCityURL = newInfo.city.split(' ').join('+'); 
    
    let geodata = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${listingAddressURL},+${listingCityURL},+${newInfo.state}&key=AIzaSyBvPqU7ldLdjnZvfEvXs9WIAJbbcodpfBE`)
    let parsedGeoData = JSON.parse(geodata.request.responseText)
    
    newInfo.latitude = parsedGeoData.results[0].geometry.location.lat; 
    newInfo.longitude = parsedGeoData.results[0].geometry.location.lng; 
        
    let confirm = await axios.put(`http://localhost:3396/api/listing/updateListing`, {
      params: {
        listingDetails : newInfo
      }});


      console.log('newSkills', newSkills)
      console.log('old skills', this.state.skills); 
    for (let i = 0; i< newSkills.length; i++ ) {
      if (!this.state.skills.includes(newSkills[i])) {
       console.log('new skill: ', newSkills[i])
      }
    }

    for (let i = 0; i < deletedSkills.length; i++ ) {
      console.log('deleted skills: ', deletedSkills[i]); 
    }

    newSkills.concat(this.state.skills); 
    this.setState({
      skills: newSkills
    })
    //add new skills
    //delete old skills 

    //replace state with new info and re render
  }

  render() {
    return (
      <div>
        {this.state.alert 
          ?
          <div className="alert alert-success center" role="alert">
            <strong>Success!</strong> You have successfully created a listing!
          </div>
          :
          <div/>
          }

        <p/>
          {this.state.edit 
          ?
          <div className="title-edit-box">
            <textarea type="text" ref="title" className="title-edit" placeholder='EDIT THE FUCKING TITLE'></textarea> 
            </div>
          :
            <h2 className="title">{this.state.listing.title}</h2>
          }
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
                <ListingInfo editInfo={this.editInfo} submitInfo={this.submitInfo} listingOwner={this.state.listingOwner} listing={this.state.listing} user={this.state.user}  skills={this.state.skills}/>
            </div>
          </div>
          <p></p>
          <div className="row">
            <div className="col align-self-center">
              <Mymap listing={this.props.match.params.listingId} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default ListingPage;