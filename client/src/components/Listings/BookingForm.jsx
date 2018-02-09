import React from 'react';
import axios from 'axios';

class BookingForm extends React.Component {
  constructor() {
    super()
    this.state = {
      userId: 0,
      checked: [],
      skills: [],
      newSkill: ''
    }
  }

  async componentDidMount() {
    try{
      const userId = await axios.get('http://localhost:3396/api/users/getUser', {
        params: {uid: localStorage.getItem('activeUid')}
      })
      

      const skills = await axios.get('http://localhost:3396/api/listing/getUserSkills', {
        params: {uid: localStorage.getItem('activeUid')}
      })
              
      await skills.data.rows.map(skill => {
        const payload = this.state.skills
        payload.push({'id': skill.id, 'skill': skill.skill})
        this.setState({
          userId: userId.data.rows[0].id,
          skills: payload
        })
      })
    } catch(err) {
      throw new Error(err);
    }

  }
  
  onChangeHandler(e) {
    e.preventDefault();
    console.log(e.target.value)
    this.setState({
      newSkill: e.target.value
    })
  }
  
  onSubmitHandler(e) {
    e.preventDefault();
    console.log('booking requested');
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

      await response.data.rows.map(skill => {
        const payload = this.state.skills
        payload.push({'id': skill.id, 'skill': skill.skill})
        this.setState({
          skills: payload
        })
      })

    } catch(err) {
      throw new Error(err);
    }
  }
  async onAddSkillHandler(e) {
    e.preventDefault();
    console.log('skill added:', this.state.newSkill)
    try {
      const response = await axios.post('http://localhost:3396/api/listing/createUserSkills', {
        uid: localStorage.getItem('activeUid'),
        skill: this.state.newSkill
      })

      await response.data.rows.map(skill => {
        const payload = this.state.skills
        payload.push({'id': skill.id, 'skill': skill.skill})
        this.setState({
          skills: payload
        })
      })

    } catch(err) {
      throw new Error(err);
    }
  }
  async onCheckHandler(e) {
    e.preventDefault()
    console.log('checked')
  }
  render() {
    return (
      <div>
        <h1> Request Booking </h1>
        <div> 
          <h5>Add a New Skill </h5>
          <form onSubmit={this.onAddSkillHandler.bind(this)}>
            <input onChange={this.onChangeHandler.bind(this)} type="text"/>
            <button>Add skill</button>
          </form>
        </div>
        <form onSubmit={this.onSubmitHandler.bind(this)}>
          {/* map skills */}
          <div> 
            <h5>Choose Your Skills </h5>
              {
                !this.state.skills
                ? null
                : this.state.skills.map(skill => {
                  return (
                    <div>
                      <label htmlFor={skill.id}> 
                      <input key={skill.id} type="checkbox" id={skill.id} name="skill" 
                        onClick={this.onCheckHandler.bind(this)} />
                      {
                        skill.skill
                      } 
                      </label>
                      <button id={skill.id} onClick={this.onDeleteHandler.bind(this)}>Delete</button>
                    </div>
                  )
                })                
              }              
           
            <h5>Message to the host (optional):</h5>
            <textarea name="info" id="" cols="30" rows="10" 
              placeholder="Send your first message to the host!" 
              defaultValue="Hi I would like to book"
            ></textarea>
            <br />
          </div>          
          <button>Request Booking</button>
        </form>
      </div>
    )
  }
}

export default BookingForm;