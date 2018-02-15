import React from 'react';
import "babel-polyfill";
import axios from 'axios'; 
import { Link } from 'react-router-dom'
import './listings.css'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import url from '../../config'


class ListingInfo extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      edit : false,
      skills: this.props.skills, 
      newSkills: [],
      deletedSkills : []
    }
    this.messageHandler = this.messageHandler.bind(this); 
    this.editListing = this.editListing.bind(this); 
    this.saveListing = this.saveListing.bind(this); 
    this.addSkill = this.addSkill.bind(this); 
    this.deleteSkill = this.deleteSkill.bind(this); 
    this.refresh = this.refresh.bind(this);
    this.deleteHandler = this.deleteHandler.bind(this); 

  }

  componentDidMount() {
    setTimeout(() => {
      this.setState ({
        skills: this.props.skills.slice(0)
      })
    }, 150)
  }

  editListing() {
    this.setState({
      edit : true
    })
    this.props.editInfo(); 
  }

  saveListing() {
    this.setState({
      edit : false
    })
   
    let newInfo = {
      startDate: this.refs.startdate.value,
      endDate: this.refs.enddate.value,
      address: this.refs.address.value,
      city: this.refs.city.value,
      state: this.refs.state.value,
      country: this.refs.country.value,
      description: this.refs.description.value
    }
    this.props.submitInfo(newInfo, this.state.deletedSkills, this.state.skills); 

    this.setState({
      newSkills: [], 
      deletedSkills: []
    })
    //display new info? 
  }

  addSkill() {
    let skills = this.state.skills; 
    skills.push({skill: this.refs.skill.value, id: null}); 
    this.setState({
      skills: skills
    })
    this.refs.skill.value = ''; 
    console.log('info state', this.state.skills); 
  }
 

  async messageHandler() {
    let guestName = localStorage.getItem('name') || 'need display name';
    let guestImage = localStorage.getItem('profilePictureURL') || this.props.user_data.image || 'https://i.pinimg.com/236x/17/a0/80/17a08083f73ab4e6b273c3a9857d38e2--invisible-ink--bit.jpg';
    let guestId = localStorage.getItem('activeId');
    let hostName = this.props.user.name;
    let hostId = this.props.listing.hostid;
    let hostImage = this.props.user.image;
    let listingId = this.props.listing.id;
    let listingTitle = this.props.listing.title;
    let roomId = `${guestId}_${hostId}_${listingId}`;
    let staticMessage = `Hello, ${hostName}! I am interested in your listing, ${listingTitle}.`
    let accountType = localStorage.getItem('accountType')

    let roomPayload = {
      roomId: roomId,
      guestName: guestName,
      guestImage: guestImage,
      guestId: guestId,
      hostName: hostName,
      hostImage: hostImage,
      hostId: hostId,
      listingId: listingId,
      listingTitle: listingTitle
    }

    // create room in mongo db:
    try {
      const data = await axios.post(`${url.socketServer}/api/rooms/createRoom`, roomPayload)
    } catch (err) {
      console.log('error creating a chat room in mongo', err)
    }
  
    let messagePayload = {
      userName: guestName,
      userImage: localStorage.getItem('profilePictureURL'),
      userId: guestId,
      userUid: localStorage.getItem('activeUid'),
      listingId: listingId,
      message: staticMessage,
      room: roomId,
      accountType: accountType
    }
    
    // create static message in mongo db:
    try {
      const data = await axios.post(`${url.socketServer}/api/chat/postStaticMessage`, messagePayload)
    } catch (err) {
      console.log('Error posting static message', err)
    }
  }

  refresh() {
    // not working
    // window.location.reload(true);
  }
  
  deleteSkill(skill) {
    let arr = this.state.skills; 
    let deleteArr = this.state.deletedSkills; 
    arr.forEach((s, i) => {
      if (s.skill === skill && s.id === null) {
        delete arr[i] ; 
      }
      else if (s.skill === skill) {
        delete arr[i]; 
        deleteArr.push(s); 
      }
    })
    this.setState({
      skills: arr, 
      deletedSkills : deleteArr
    })
  }

  async deleteHandler() {
    let listing = await axios.delete(`${url.restServer}/api/listing/deleteListing`, {
      params: {listingId: this.props.listing.id}
    }); 
  }
  
  render() {
    return (
      <div className="card host-info-outer-box">
        {/* LISTING INFO */}
        <div>
          <div className="card-body listing-info-box">
            {/* HEADER && HEADER EDIT */}
            {
              this.state.edit 
              ?
              <div>
                <div className="input-group">
                  <input className="form-control" type="date" ref="startdate" defaultValue={this.props.listing.startdate} placeholder="Start Date"></input>
                  <input className="form-control" type="date" ref="enddate" defaultValue={this.props.listing.enddate} placeholder="End Date"></input>
                </div>
                <div className="input-group">
                  <input className="form-control" type="text" ref="address" defaultValue={this.props.listing.address} placeholder="Address"></input>
                  <input className="form-control" type="text" ref="city" defaultValue={this.props.listing.city} placeholder="City"></input>
                </div>
                <div className="input-group">
                  <input className="form-control" type="text" ref="state" defaultValue={this.props.listing.state} placeholder="State"></input>
                  <input className="form-control" type="text" ref="country" defaultValue={this.props.listing.country} placeholder="Country"></input>
                </div>
              </div>
              :
              <div>
                <div className="card-title text-center">
                  <h4>
                    <span style={{marginRight: '10px'}}>{this.props.listing.city}</span>
                  </h4>
                </div>
                <div>
                  <h4 className="card-title text-center">
                    <span className="badge badge-secondary">{this.props.listing.startdate}</span> - <span className="badge badge-secondary">{this.props.listing.enddate}</span>
                  </h4>
                </div>
              </div> 
            }
            <hr/>
            {/* DESCRIPTION && DESCRIPTION EDIT */}
            {
              this.state.edit 
              ?
              <div>
                <textarea className="descriptionInput form-control" type="text" ref="description" defaultValue={this.props.listing.description}></textarea>
              </div>
              : 
              <div className="card-text">
                {this.props.listing.description}
              </div>
            }
            <hr/>
            {/* SKILLS && SKILLS EDIT */}
            <div className="skills-info-box">
              <div className="col-sm-4">
                <h6 className="skills"> Skills for Stay</h6>
                <hr/>
              </div>
              {
                  this.state.edit
                ?
                  <div>
                    <div className="input-group">
                      <input className="form-control" type="text" ref="skill" placeholder="Skill Requested"></input>
                      <div className="input-group-append">
                        <button className="btn btn-small btn-outline-dark" onClick={this.addSkill}>+</button>
                      </div>
                    </div>
                    <ul className="list-group d-flex justify-content-end">
                      {this.state.skills.map((skill, i) => {
                        return  <li className="list-group-item" key={i}>{skill.skill}<button className="skill-li btn btn-small btn-outline-dark" onClick={() => {this.deleteSkill(skill.skill)}}>-</button></li>
                      })}
                    </ul>
                  </div>
                :
                  this.state.skills.length > 0 
                ?
                  <ul>
                    {this.state.skills.map((skill, i) => {
                      return  <li key={i}>{skill.skill}</li>
                    })}
                  </ul>
                :
                  <ul>
                    <li>None</li>
                  </ul>
              }
            </div>
            {/* BUTTONS */}
            <div className="">
              {this.props.listingOwner 
              ? 
                <div className="center" >
                  {this.state.edit 
                  ?
                    <button onClick={this.saveListing} type="button" className="btn btn-dark"> Save </button> 
                  :
                    <div className="d-flex justify-content-around">
                      <div className="col-sm-5">
                        <button onClick={this.editListing} type="button" className="btn btn-outline-dark col-sm-12">Edit Listing</button>
                      </div>
                      <div className="col-sm-5">
                        <Link to={{pathname:'/'}}>
                        <button className="btn btn-outline-danger col-sm-12" onClick={this.deleteHandler}> Delete </button>
                        </Link>
                      </div>
                    </div>
                  }
                </div>
              :
                <div className="d-flex justify-content-around">
                  <div className="col-sm-5">
                    <Link to={{
                    pathname:`/listing/book/${this.props.listing.id}`,
                    state: {
                      guestName: localStorage.getItem('name') || 'need display name',
                      guestImage: localStorage.getItem('profilePictureURL'),
                      guestId: localStorage.getItem('activeId'),
                      guestUid: localStorage.getItem('activeUid'),
                      hostName: this.props.user.name,
                      hostId: this.props.listing.hostid,
                      hostImage: this.props.user.image,
                      listingId: this.props.listing.id,
                      listingTitle: this.props.listing.title,
                      roomId: `${localStorage.getItem('activeId')}_${this.props.listing.hostid}_${this.props.listing.id}`,
                      accountType: localStorage.getItem('accountType')
                    }
                    }}>
                      <button className="btn btn-outline-dark col-sm-12">
                        Request Booking
                      </button> 
                    </Link>
                  </div>
                  <div className="col-sm-5">
                    <Link to={`/user/${localStorage.getItem('activeUid')}/inbox/${localStorage.getItem('activeId')}_${this.props.listing.hostid}_${this.props.listing.id}`} onClick={this.messageHandler}>
                      <button className="btn btn-outline-dark col-sm-12">
                        Message Host
                      </button> 
                    </Link>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
        {/* HOST INFO */}
        <div className="d-flex justify-content-center hostInfoBox">
          <div className="col-sm-3">
            <img className="host-image" src={this.props.user.image}/>
          </div>
          <div className="col-sm-6">
            <div className="hostInfoLink d-flex justify-content-start">
              <Link onClick={this.refresh} className="fixLink" to={{
              pathname:`/user/public/${this.props.user.uid}`,
              state: { hostUid: this.props.user.uid, hostId: this.props.user.id }
              }}><h3>{this.props.user.name}</h3></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

function mapStateToProps(state) {
  return {
    active_user: state.active_user,
    user_data: state.user_data
  }
}

export default connect(mapStateToProps)(ListingInfo);