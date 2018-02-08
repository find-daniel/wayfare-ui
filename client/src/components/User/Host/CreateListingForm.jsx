import React from 'react';
import axios from 'axios'; 


class CreateListingForm extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {

    }
  }


  async onSubmitHandler(e) {
    e.preventDefault();
    
    let userId = await axios.get('http://localhost:3396/api/users/getUser', {
      params: {uid: this.props.match.params.userId}
    }); 
    userId = userId.data.rows[0].id; 

    const listingDetails = {
      title: this.refs.title.value,
      startDate: this.refs.startDate.value, 
      endDate: this.refs.endDate.value,
      latitude: 1.0,
      longitude: 2.0,
      address: this.refs.location.value,
      city: this.refs.location.value,
      hostId: userId,
      description: this.refs.description.value 
    }

    console.log('listingDetails', listingDetails); 
    let listingId = await axios.put('http://localhost:3396/api/listing/createListing', {params: {listingDetails: listingDetails}}); 
    
    listingId = listingId.data.rows[0].id; 

    this.props.history.push(`/listing/${listingId}`); 
    //redirect to listing page 
  }

  render() {
    return (
      <div>
        <h1>Create Listing</h1>
        <br/>
        <form onSubmit={this.onSubmitHandler.bind(this)} >
          <input type="text" ref="title" placeholder="Title" required/>
          <br/>
          <input type="date" ref="startDate" placeholder="Start Date" required/>
          <br/>
          <input type="date" ref="endDate" placeholder="End Date" required/>
          <br/>
          {/* Send to google geocoding api */}
          <input type="text" ref="location" placeholder="Location" required/>
          <br/>
          <textarea name="description" ref="description" id="" cols="30" rows="10" placeholder="Describe your listing" required></textarea>
          <br/>
          <button>Create</button>
        </form>
      </div>
    )
  }
}

export default CreateListingForm;