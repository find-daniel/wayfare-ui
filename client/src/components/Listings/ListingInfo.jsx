import React from 'react';
import "babel-polyfill";
import axios from 'axios'; 
import { Link } from 'react-router-dom'
import './listings.css'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 


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
    let guestName = this.props.user_data.name || 'need display name';
    let guestImage = localStorage.getItem('profilePictureURL') || this.props.user_data.image || 'https://i.pinimg.com/236x/17/a0/80/17a08083f73ab4e6b273c3a9857d38e2--invisible-ink--bit.jpg';
    let guestId = localStorage.getItem('activeId');
    let hostName = this.props.user.name;
    let hostId = this.props.listing.hostid;
    let hostImage = this.props.user.image;
    let listingId = this.props.listing.id;
    let listingTitle = this.props.listing.title;
    let roomId = `${guestId}_${hostId}_${listingId}`;
    let staticMessage = `Hello, ${hostName}! I am interested in your listing, ${listingTitle}.`

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
      const data = await axios.post('http://localhost:4155/api/rooms/createRoom', roomPayload)
    } catch (err) {
      console.log('error creating a chat room in mongo', err)
    }
  

    
    let messagePayload = {
      userName: guestName,
      userImage: guestImage,
      userId: guestId,
      listingId: listingId,
      message: staticMessage,
      room: roomId
    }
    
    // create static message in mongo db:
    try {
      const data = await axios.post(`http://localhost:4155/api/chat/postStaticMessage`, messagePayload)
    } catch (err) {
      console.log('Error posting static message', err)
    }
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
  
  render() {
    return (
      <div className="card hostInfo">
        <div className="card">

          <div className="card-body body">
            {this.state.edit 
            ?
              <div>
                <input type="text" ref="startdate" defaultValue={this.props.listing.startdate}></input>
                <input type="text" ref="enddate" defaultValue={this.props.listing.enddate}></input>
                <input type="text" ref="address" defaultValue={this.props.listing.address}></input>
                <input type="text" ref="city" defaultValue={this.props.listing.city}></input>
                <input type="text" ref="state" defaultValue={this.props.listing.state}></input>
                <input type="text" ref="country" defaultValue={this.props.listing.country}></input>
              </div>
            : 
            <h4 className="card-title">{this.props.listing.startdate} - {this.props.listing.enddate}, {this.props.listing.city}</h4>
            }
            <hr/>

            {this.state.edit 
            ?
              <div>
                <textarea className="descriptionInput" type="text" ref="description" defaultValue={this.props.listing.description}></textarea>
              </div>
            : 
              <p className="card-text">
                {this.props.listing.description}
              </p>
            }

            <hr/>
            <h6 className="skills"> Skills for Stay: </h6>

            <div>
              {this.state.edit
              ?
                <div>
                  <input type="text" ref="skill" placeholder="Skill for stay"></input><button onClick={this.addSkill}>+</button>
                  <ul>
                      {this.state.skills.map((skill, i) => {
                        return  <li key={i}>{skill.skill}<button onClick={() => {this.deleteSkill(skill.skill)}}>-</button></li>
                      })}
                    </ul>
                </div>
              :
                this.state.skills.length > 0 
                  ? <ul>
                      {this.state.skills.map((skill, i) => {
                        return  <li key={i}>{skill.skill}</li>
                      })}
                    </ul>
                  :
                  <div></div>
                
              }
            </div>

            <div className="container">
              {this.props.listingOwner 
              ? 
                <div className="center" >
                  {this.state.edit 
                  ?
                    <button onClick={this.saveListing} type="button" className="btn btn-dark"> Save </button> 
                  :
                    <button onClick={this.editListing} type="button" className="btn btn-dark">Edit Listing</button>
                  }
                </div>
              :
                <div>
                  <Link to={`/listing/book/${this.props.listing.id}`} type="button" className="btn btn-light col-sm-5">Request Booking</Link>
                  <span className="col-sm-2"/>
                  <Link to={`/user/${localStorage.getItem('activeUid')}/inbox/${localStorage.getItem('activeId')}_${this.props.listing.hostid}_${this.props.listing.id}`} type="button" className="btn btn-light col-sm-5" onClick={this.messageHandler}>Message Host</Link>
                </div>
              }
            </div>

          </div>

        <p></p>


        </div>
         <div className="card hostBox">
           <span>
             <img className="host-image" src={this.props.user.image}/>
             <span className="hostInfoBox">
               <Link className="hostInfoLink" to={{
                pathname:`/user/public/${this.props.user.uid}`,
                state: { hostUid: this.props.user.uid, hostId: this.props.user.id }
                }}>{this.props.user.name}</Link>
             </span>
           </span>
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