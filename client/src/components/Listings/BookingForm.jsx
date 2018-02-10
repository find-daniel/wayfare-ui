import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

class BookingForm extends React.Component {
  constructor() {
    super()
    this.state = {
      userId: '',
      hostId: '',
      checked: [],
      skills: [],
      newSkill: '',
      message: "Hi I would like to book"
    }
  }

  async componentDidMount() {
    try{
      // GET USER ID FOR SCHEMA QUERIES
      // const userId = await localStorage.getItem('activeId')
      const userId = await axios.get('http://localhost:3396/api/users/getUser', {
        params: {uid: localStorage.getItem('activeUid')}
      })

      const listingData = await axios.get('http://localhost:3396/api/listing/getListing', {
        params: {listingId: this.props.match.params.listingId}
      })
      this.setState({
        hostId: listingData.data.hostid
      })

      // GET SKILLS USING USER ID (currently using uid to do it... fix controller later)
      const skills = await axios.get('http://localhost:3396/api/listing/getUserSkills', {
        params: {uid: localStorage.getItem('activeUid')}
      })
      
      const payload = []
      await skills.data.rows.map(skill => {
        payload.push({'id': skill.id, 'skill': skill.skill})
      })      
      await this.setState({
        userId: userId.data.rows[0].id,
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
    e.preventDefault();
    console.log('skill added:', this.state.newSkill)
    try {
      const response = await axios.post('http://localhost:3396/api/listing/createUserSkills', {
        uid: localStorage.getItem('activeUid'),
        skill: this.state.newSkill
      })
      const payload = []
      await response.data.rows.map(skill => {
        payload.push({'id': skill.id, 'skill': skill.skill})
      })
      this.setState({
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
      addPayload.push(JSON.parse(e.target.id))
      this.setState({
        checked: addPayload
      })
      console.log('after add', this.state.checked)
    } else {
      const deletePayload = this.state.checked
      console.log(e.target.id)
      deletePayload.splice(deletePayload.indexOf(JSON.parse(e.target.id)), 1)
      this.setState({
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
      const response = await axios.delete('http://localhost:3396/api/listing/deleteUserSkills', {
        params: { 
          id: e.target.id,
          uid: this.state.userId
        } 
      })
      const payload = []
      await response.data.rows.map(skill => {
        payload.push({'id': skill.id, 'skill': skill.skill})
      })
      this.setState({
        skills: payload
      })

    } catch(err) {
      throw new Error(err);
    }
  }

  async onBookingHandler(e) {
    e.preventDefault();
    console.log('booking requested');
    try {
      await axios.post('http://localhost:3396/api/listing/createRequestAndRequestSkills', {
        guestId: this.state.userId,
        listingId: this.props.match.params.listingId,
        skillId: this.state.checked 
      })
    } catch(err) {
      throw new Error(err);
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
        <form onSubmit={this.onBookingHandler.bind(this)}>
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
              placeholder="Send your first message to the host!" 
              value={this.state.message}
              onChange={this.onChangeHandler.bind(this)}
            ></textarea>
          </div>          
          <Link to={`/user/${localStorage.getItem('activeUid')}/inbox/${this.state.userId}_${this.state.hostId}_${this.props.match.params.listingId}`} 
            type="button" 
            className="btn btn-light col-sm-5" 
          >Message Host</Link>
        </form>
      </div>
    )
  }
}

export default BookingForm;