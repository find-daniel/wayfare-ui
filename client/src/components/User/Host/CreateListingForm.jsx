import React from 'react';
import axios from 'axios'; 
import Dropzone from 'react-dropzone';
import upload from 'superagent';
import "babel-polyfill";

class CreateListingForm extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {
      imageObj: '',
      imagePrev: '',
      image: ''
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

    // upload image to s3:
    try {
      const data = await upload
      .post('http://localhost:3396/api/files/upload')
      .attach('theseNamesMustMatch', this.state.imageObj)
      .field('keypath', 'profiles/' + window.localStorage.email + '/' + this.state.imageObj.name)
      .field('endurl', 'profiles/' + encodeURIComponent(window.localStorage.email) + '/' + this.state.imageObj.name)
  
      this.setState({
        image: data.body.url
      })

      // need to post image to our database here.
      try {

        let payload = {
          listingId: listingId,
          url: this.state.image
        }

        const data = await axios.post('http://localhost:3396/api/listing/postPhoto', payload)
        console.log('data from posting image to db:', data)
        //
      } catch (err) {
        console.log('error posting image to sql table', err)
      }

    } catch (err) {
      console.log('error uploading to s3', err)
    }

    this.props.history.push(`/listing/${listingId}`); 
    //redirect to listing page 
  }

  _onDrop(files) {
    let file = files[0];
    console.log('file', file)
    this.setState({
      imageObj: file,
      imagePrev: file.preview
    })
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

          <Dropzone 
            accept="image/jpeg, image/jpg, image/png"
            multiple={false}
            onDropAccepted={ this._onDrop.bind(this) } maxSize={ 5000000 }
            onDragLeave= {this._onDrop.bind(this) } maxSize={ 5000000 }
            // onDropRejected = {can render a warning if we want}
            // className="dropzone"   <-- Daniel-san, add styles to .dropzone later! onegaishimasu
          >
            <div>
              Click or drag photo here!
                {!this.state.imagePrev ? null : <div>Preview: <br/><img style={{maxHeight: '120px'}} src={this.state.imagePrev} /></div> }
            </div>
          </Dropzone>

          <button>Create</button>
        </form>
      </div>
    )
  }
}

export default CreateListingForm;