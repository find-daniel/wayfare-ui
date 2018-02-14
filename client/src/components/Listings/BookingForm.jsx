import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import url from '../../config'

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
      console.log(userId)
      const listingData = await axios.get(`${url.restServer}/api/listing/getListing`, {
        params: {listingId: this.props.match.params.listingId}
      })
      
      await this.setState({
        userId: userId,
        hostId: listingData.data.hostid
      })
      console.log(this.state.userId)
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
      throw new Error(err);
    }
  }
  
  async onChangeHandler(e) {
    e.preventDefault();
    console.log(e.target.value)
    this.setState({
      [e.target.name]: e.target.value
    })
  }  
  
  async onAddSkillHandler(e) {
    console.log('i am this.state', this.state)
    console.log('i am this.props:', this.props)
    e.preventDefault();
    console.log('skill added:', this.state.newSkill)
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
      throw new Error(err);
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
      console.log('after add', this.state.checked)
    } else {
      const deletePayload = this.state.checked
      console.log(e.target.id)
      await deletePayload.splice(deletePayload.indexOf(JSON.parse(e.target.id)), 1)
      await this.setState({
        checked: deletePayload
      })
      console.log('after delete', this.state.checked)
    }    
  }

  async onDeleteHandler(e) {
    e.preventDefault();
    console.log('skill delete requested', e.target.id)
    console.log('userId', this.state.userId)
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
      throw new Error(err);
    }
  }

  async onBookingHandler(e) {

    // e.preventDefault();
    console.log('booking requested');
    // try {
    //   await axios.post(`${url.restServer}/api/listing/createRequestAndRequestSkills`, {
    //     guestId: this.state.userId,
    //     listingId: this.props.match.params.listingId,
    //     skillId: this.state.checked 
    //   })
    // } catch(err) {
    //   throw new Error(err);
    // }    

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
      console.log('data after making room', data)
    } catch (err) {
      console.log('(BookingForm - Error creating chat room in mongo DB.', err)
    }

    try {
      const data = await axios.post(`${url.socketServer}/api/chat/postStaticMessage`, messagePayload)
      console.log('data after sending message', data)
    } catch (err) {
      console.log('BookingForm - Error creating message in mongo DB', err)
    }
  }

  render() {
    return (
      <div>
        <h1> Request Booking </h1>

        {/* Add new Skill */}
        <div> 
          <h5>Add a New Skill </h5>
          <form onSubmit={this.onAddSkillHandler.bind(this)}>
            <input name="newSkill" type="text" ref="reset"
              onChange={this.onChangeHandler.bind(this)} 
            />
            <button>Add skill</button>
          </form>
        </div>        

        {/* FORM SUBMISSION */}
        <form>
          <div> 

            {/* CHOOSE/DELETE SKILLS */}
            <h5>Choose Your Skills </h5>
              {
                !this.state.skills
                ? null
                : this.state.skills.map(skill => {
                  return (
                    <div key={skill.id}>
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
                      <button id={skill.id} 
                        onClick={this.onDeleteHandler.bind(this)}
                      >Delete</button>
                    </div>
                  )
                })                
              }              
            
            {/* MESSAGE HOST */}
            <h5>Message to the host (optional):</h5>
            <textarea name="message" id="" cols="30" rows="10" 
              placeholder="Enter a message for the host" 
              value={this.state.message}
              onChange={this.onChangeHandler.bind(this)}
            ></textarea>
          </div>  

{/* 
          <Link onClick={this.onBookingHandler.bind(this)} to={`/user/${localStorage.getItem('activeUid')}/inbox/${this.state.userId}_${this.state.hostId}_${this.props.match.params.listingId}`} 
            type="button" 
            className="btn btn-light col-sm-5" 
          >Request Booking</Link> */}

        </form>
        <button onClick = {this.onBookingHandler.bind(this)}>Request booking no link.</button>

      </div>
    )
  }
}

export default BookingForm;