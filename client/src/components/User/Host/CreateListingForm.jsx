import React from 'react';

class CreateListingForm extends React.Component {
  onSubmitHandler(e) {
    e.preventDefault();
    console.log('listing created');
    // axios post request to store listing in DB
  }

  render() {
    return (
      <div>
        <h1>Create Listing</h1>
        <br/>
        <form onSubmit={this.onSubmitHandler.bind(this)} >
          <input type="text" placeholder="Title" required/>
          <br/>
          <input type="date" placeholder="Start Date" required/>
          <br/>
          <input type="date" placeholder="End Date" required/>
          <br/>
          {/* Send to google geocoding api */}
          <input type="text" placeholder="Location" required/>
          <br/>
          <textarea name="description" id="" cols="30" rows="10" placeholder="Describe your listing" required></textarea>
          <br/>
          <button>Create</button>
        </form>
      </div>
    )
  }
}

export default CreateListingForm;