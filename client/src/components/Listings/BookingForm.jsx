import React from 'react';

class BookingForm extends React.Component {
  onSubmitHandler(e) {
    e.preventDefault();
    console.log('booking requested');
  }
  render() {
    return (
      <div>
        <h1> Request Booking </h1>
        <form onSubmit={this.onSubmitHandler.bind(this)}>
          <input type="text" placeholder="something"/>
          <input type="text" placeholder="something"/>
          <div>
            <input type="checkbox" id="skill-1" name="skills" />
              <label htmlFor="skill-1"> Skill 1 </label>
            <input type="checkbox" id="skill-2" name="skills" />
              <label htmlFor="skill-1"> Skill 2 </label>
            <input type="checkbox" id="skill-3" name="skills" />
              <label htmlFor="skill-1"> Skill 3</label>
          </div>
          <textarea name="info" id="" cols="30" rows="10" placeholder="Provide any relevant info" ></textarea>
          <button>Request Booking</button>
        </form>
      </div>
    )
  }
}

export default BookingForm;