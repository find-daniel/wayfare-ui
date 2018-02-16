import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import url from '../../config'
import './BookingForm.css'

class BookingForm extends React.Component {
  constructor() {
    super()
    this.state = {
      userId: '',
      hostId: '',
      checked: [],
      skills: [],
      newSkill: '',
      message: ''
    }
  }

  async componentDidMount() {
    try{

      const userId = await localStorage.getItem('activeId')
      const listingData = await axios.get(`${url.restServer}/api/listing/getListing`, {
        params: {listingId: this.props.match.params.listingId}
      })
      
      await this.setState({
        userId: userId,
        hostId: listingData.data.hostid
      })
      const skills = await axios.get(`${url.restServer}/api/listing/getUserSkills`, {
        params: {userId: this.state.userId}
      })
      
      const payload = []
      await skills.data.rows.map(skill => {
        payload.push({'id': skill.id, 'skill': skill.skill})
      })      
      await this.setState({
        skills: payload
      })
    } catch(err) {
      console.log('Error', err);
    }
  }
  
  async onChangeHandler(e) {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    })
  }  
  
  async onAddSkillHandler(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`${url.restServer}/api/listing/createUserSkills`, {
        userId: this.state.userId,
        skill: this.state.newSkill
      })
      const payload = []
      await response.data.rows.map(skill => {
        payload.push({'id': skill.id, 'skill': skill.skill})
      })
      await this.setState({
        skills: payload,
      })
    } catch(err) {
      console.log('Error', err);
    }
    this.refs.reset.value = ''
  }

  async onCheckHandler(e) {
    if (!this.state.checked.includes(JSON.parse(e.target.id))) {
      const addPayload = this.state.checked;
      await addPayload.push(JSON.parse(e.target.id))
      await this.setState({
        checked: addPayload
      })
    } else {
      const deletePayload = this.state.checked
      await deletePayload.splice(deletePayload.indexOf(JSON.parse(e.target.id)), 1)
      await this.setState({
        checked: deletePayload
      })
    }    
  }

  async onDeleteHandler(e) {
    e.preventDefault();
    try {
      const response = await axios.delete(`${url.restServer}/api/listing/deleteUserSkills`, {
        params: { 
          id: e.target.id,
          uid: this.state.userId
        } 
      })
      const payload = []
      await response.data.rows.map(skill => {
        payload.push({'id': skill.id, 'skill': skill.skill})
      })
      await this.setState({
        skills: payload
      })

    } catch(err) {
      console.log('Error', err);
    }
  }

  async onBookingHandler(e) {
    // e.preventDefault();
    try {
      await axios.post(`${url.restServer}/api/listing/createRequestAndRequestSkills`, {
        guestId: JSON.parse(this.state.userId),
        listingId: JSON.parse(this.props.match.params.listingId),
        skillId: this.state.checked 
      })
    } catch(err) {
      console.log('Error', err);
    }    


    const {guestName, guestImage, guestId, guestUid, hostName, hostImage, hostId, listingId, listingTitle, roomId, accountType} = this.props.location.state;
    const message = this.state.message;

    const roomPayload = {
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

    const messagePayload = {
      userName: guestName,
      userImage: guestImage,
      userId: guestId,
      userUid: guestUid,
      listingId: listingId,
      message: message,
      room: roomId,
      accountType: accountType
    }

    try {
      const data = await axios.post(`${url.socketServer}/api/rooms/createRoom`, roomPayload)
    } catch (err) {
      console.log('(BookingForm - Error creating chat room in mongo DB.', err)
    }

    try {
      const data = await axios.post(`${url.socketServer}/api/chat/postStaticMessage`, messagePayload)
    } catch (err) {
      console.log('BookingForm - Error creating message in mongo DB', err)
    }
    window.location.reload(true);
  }

  render() {
    return (
      <div className="container col-sm-4 booking-form-box">
        {/* Header */}
        <div className="text-center header">
          <h1> Request Booking </h1>
          <hr/>
        </div>
        {/* Body */}
        <div className="container text-center">
          {/* Add new Skill */}
          <div> 
            <div className="input-spacing">
              <h5>Add a New Skill </h5>
            </div>
            <div className="container">
              <form className="input-group d-flex justify-content-center input-spacing" onSubmit={this.onAddSkillHandler.bind(this)}>
                <input className="form-control col-sm-5" name="newSkill" type="text" ref="reset"
                  onChange={this.onChangeHandler.bind(this)} 
                />
                <div className="input-group-append">
                  <button className="btn btn-outline-dark">Add skill</button>
                </div>
              </form>
              <form className="">
                <div className="input-spacing">
                  {/* CHOOSE/DELETE SKILLS */}
                  <h5>Choose Your Skills </h5>
                  <div className="booking-form-skills-box">
                    {
                      !this.state.skills
                      ? null
                      : this.state.skills.map(skill => {
                        return (
                          <div className="input-spacing" key={skill.id}>
                            <label htmlFor={skill.id}> 
                              <input type="checkbox" id={skill.id} name="skill" 
                                checked={(()=> {
                                  this.state.checked.includes(skill.id)
                                  }).bind(this)
                                }
                                onChange={this.onCheckHandler.bind(this)} />
                              {
                                skill.skill
                              } 
                            </label>
                            <button className="btn btn-sm btn-outline-danger booking-form-skills-delete" id={skill.id} 
                              onClick={this.onDeleteHandler.bind(this)}
                            >Delete</button>
                          </div>
                        )
                      })                
                    }
                  </div>              
                  {/* MESSAGE HOST */}
                  <div className="input-spacing">
                    <h5>Message to the host (optional):</h5>
                  </div>
                  <div className="input-spacing">
                    <textarea className="form-control" name="message" id="" cols="30" rows="10" 
                      placeholder="Enter a message for the host" 
                      value={this.state.message}
                      onChange={this.onChangeHandler.bind(this)}
                    ></textarea>
                  </div>
                </div>
                <div className="booking-form-submit-btn">
                  <Link onClick={this.onBookingHandler.bind(this)} to={`/user/${localStorage.getItem('activeUid')}/inbox/${this.state.userId}_${this.state.hostId}_${this.props.match.params.listingId}`}>
                   <button className="btn btn-outline-dark"> Request Booking </button>
                  </Link>
                </div>
                

              </form>
            </div>
          </div>        
          {/* FORM SUBMISSION */}
          
        </div>
      </div>
    )
  }
}

export default BookingForm;