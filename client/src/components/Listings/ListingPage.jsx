import React from 'react';
import SearchBar from '../Search/SearchBar';
import ListingInfo from './ListingInfo';
import Pictures from './Pictures';
import Mymap from '../Map/Map';
import ListingReviewsList from '../Reviews/ListingReviewsList';
import axios from 'axios'; 
import "babel-polyfill";
import './listings.css'
import url from '../../config'

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
      listingOwner: false, 
      edit: false
    }

    this.editInfo = this.editInfo.bind(this); 
    this.submitInfo = this.submitInfo.bind(this); 
  }
  async componentDidMount() {
    //get listing information
    let listing = await axios.get(`${url.restServer}/api/listing/getListing`, {
      params: {listingId: this.state.listingId}
    }); 
    //get the host information 
    let userId = await axios.get(`${url.restServer}/api/users/getUserData`, {
      params: {userId: listing.data.hostid}
    }); 
    //get listing skills
    let skills = await axios.get(`${url.restServer}/api/listing/getListingSkills`, {
      params: {listingId: this.state.listingId}
    });
    let skillsArr = []; 
    skills.data.forEach(skill => {
      skillsArr.push({skill: skill.skill, id: skill.id});  
    })
    this.setState ({
      listing: listing.data, 
      user: userId.data, 
      skills: skillsArr
    })

    //check if the active user is the listing owner
    let currUser = await axios.get(`${url.restServer}/api/users/getUser`, {
      params: {uid: localStorage.getItem('activeUid')}
    })
    currUser = currUser.data.rows[0].id; 
    if (currUser === listing.data.hostid) {
      this.setState ({
        listingOwner: true
      })
    }
    //increment view count for listing
    let viewCount = await axios.post(`${url.restServer}/api/listing/updateListingViewCount`, {
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
    
    newInfo.latitude = Number(parsedGeoData.results[0].geometry.location.lat); 
    newInfo.longitude = Number(parsedGeoData.results[0].geometry.location.lng); 
        
    let confirm = await axios.put(`http://localhost:3396/api/listing/updateListing`, {
      params: {
        listingDetails : newInfo
      }});

    //rerender new info
    newInfo.guestId = this.state.listing.guestid; 
    newInfo.hostId = this.state.listing.hostid; 
    newInfo.id = this.state.listing.id; 
    newInfo.status = this.state.listing.status; 
    newInfo.enddate = newInfo.endDate; 
    newInfo.startdate = newInfo.startDate; 

    this.setState({
      listing: newInfo, 
      listingId: newInfo.id
    })
    
    //add new skills to DB
    for (let i = 0; i< newSkills.length; i++ ) {
      if (newSkills[i] && !newSkills[i].id) {
        let data = await axios.post('http://localhost:3396/api/listing/addSkill', {
          params: {listingId: this.state.listingId, skill: newSkills[i].skill}
        })
        newSkills[i].id = data.data.rows[0].id; 
      }
    }
    this.setState({
      skills: newSkills
    })

    //delete old skills from DB
    for (let i = 0; i < deletedSkills.length; i++ ) {
      await axios.delete('http://localhost:3396/api/listing/deleteListingSkill', {
          params: { skillId: deletedSkills[i].id}
        })
    }

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
            <textarea type="text" ref="title" className="title-edit" placeholder='Edit Title'></textarea> 
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
              <Mymap listing={this.state.listingId} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}



export default ListingPage;