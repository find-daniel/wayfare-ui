import React from 'react';
import axios from 'axios'; 
import Dropzone from 'react-dropzone';
import upload from 'superagent';
import "babel-polyfill";
import url from '../../../config'
import './CreateListingForm.css'

class CreateListingForm extends React.Component {
  constructor(props) {
    super(props); 

    this.state = {
      imageObj: '',
      imagePrev: '',
      image: '',
      skills: []
    }

    this.addSkill = this.addSkill.bind(this); 
    this.deleteSkill = this.deleteSkill.bind(this);
    this.onSubmitHandler = this.onSubmitHandler.bind(this);
  }

  async onSubmitHandler(e) {
    e.preventDefault();
    let userId = await axios.get(`${url.restServer}/api/users/getUser`, {
      params: {uid: this.props.match.params.userId}
    }); 
    userId = userId.data.rows[0].id; 

    let listingAddressURL = this.refs.address.value.split(' ').join('+'); 
    let listingCityURL = this.refs.city.value.split(' ').join('+'); 

    let geodata = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${listingAddressURL},+${listingCityURL},+${this.refs.state.value}&key=${process.env.GOOGLE_GEO_API}`)
    let parsedGeoData = JSON.parse(geodata.request.responseText)

    let lat = parsedGeoData.results[0].geometry.location.lat; 
    let lng = parsedGeoData.results[0].geometry.location.lng; 

    const listingDetails = {
      title: this.refs.title.value,
      startDate: this.refs.startDate.value, 
      endDate: this.refs.endDate.value,
      latitude: lat,
      longitude: lng,
      address: this.refs.address.value,
      city: this.refs.city.value,
      state: this.refs.state.value,
      country: this.refs.country.value,
      hostId: userId,
      description: this.refs.description.value 
    }

    console.log('listingDetails', listingDetails); 
    let listingId = await axios.post(`${url.restServer}/api/listing/createListing`, {params: {listingDetails: listingDetails}}); 

    listingId = listingId.data.rows[0].id;

    // upload image to s3:
    try {
      const data = await upload
      .post(`${url.restServer}/api/files/upload`)
      .attach('theseNamesMustMatch', this.state.imageObj)
      .field('keypath', 'profiles/' + window.localStorage.email + '/listingPic/' + this.state.imageObj.name)
      .field('endurl', 'profiles/' + encodeURIComponent(window.localStorage.email) + '/listingPic/' + this.state.imageObj.name)
  
      this.setState({
        image: data.body.url
      })

      try {

        let payload = {
          listingId: listingId,
          url: this.state.image
        }

        const data = await axios.post(`${url.restServer}/api/listing/postPhoto`, payload)
        console.log('payloaadddd', payload)
        console.log('data from posting image to db:', data)
        //
      } catch (err) {
        console.log('error posting image to sql table', err)
      }

    } catch (err) {
      console.log('error uploading to s3', err)
    }
    for(let i = 0; i < this.state.skills.length; i++ ) {
      const data = await axios.post(`${url.restServer}/api/listing/addSkill`, {
        params: {listingId: listingId, skill: this.state.skills[i]}
      })
    };  


    this.props.history.push(`/listing/${listingId}`); 
  }

  addSkill() {
    let arr = this.state.skills; 
    arr.push(this.refs.skill.value); 
    this.setState ({
      skills: arr
    }) 
    this.refs.skill.value = "";
  }

  deleteSkill(skill) {
    let arr = this.state.skills; 
    arr.forEach((s, i) => {
      if (s === skill) {
        delete arr[i]; 
      }
    })
    this.setState({
      skills: arr
    })
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
      <div className="d-flex justify-content-center create-listing-component">
        <div className="box card">
          <div className="text-center create-listing-header">
            <h1>Create Listing</h1>
          </div>
          <div className="d-flex justify-content-center">
            <form onSubmit={this.onSubmitHandler.bind(this)} >
              {/* Title */}
              <div className="input-spacing">
                <input className="form-control text-center" type="text" ref="title" placeholder="Title" required/>
              </div>
<<<<<<< HEAD
              {/* Start Date */}
              <div className="input-spacing input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"> Start Date </span>
                </div>
                <input className="form-control text-center" type="date" ref="startDate" placeholder="Start Date" required/>
              </div>
              {/* End Date */}
              <div className="input-spacing input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text"> End Date </span>
                </div>
                <input className="form-control text-center" type="date" ref="endDate" placeholder="End Date" required/>
              </div>
              {/* Send to google geocoding api */}
              {/* Location */}
              <div>
                <div className="input-spacing input-group">
                  <input className="form-control text-center" type="text" ref="address" placeholder="Address" required/>
                  <input className="form-control text-center" type="text" ref="city" placeholder="City" required/>
                </div>
                <div className="input-spacing input-group">
                  <input className="form-control text-center" type="text" ref="state" placeholder="State" required/>
                  <input className="form-control text-center" type="text" ref="country" placeholder="Country" required/>
                </div>
              </div>
              {/* Skills */}
              <div className="input-spacing input-group">
                <div className="input-group">
                  <input className="form-control text-center" type="text" ref="skill" placeholder="Requested Skill"/>
                  <div className="input-group-append">
                    <button className="btn btn-sm btn-outline-dark" onClick={this.addSkill}>+</button>
                  </div>
                  <div className="input-group">
                    {this.state.skills.length > 0
                      ? <div className="input-spacing">
                          <div>
                            <p>Skills</p>
                          </div>
                          <hr/>
                          <ul className="list-group">
                            {(this.state.skills.map((skill, i) => {
                              return <li className="list-group-item" key={i}>{skill} <button className="btn btn-sm btn-outline-dark" onClick={() => {this.deleteSkill(skill)}}>-</button></li>
                            }))}
                          </ul>
                        </div>
                      :
                        null
                    }
                  </div>
                </div>
              </div>
              {/* Listing Description */}
              <div className="input-spacing input-group">
                <textarea className="form-control text-center" name="description" ref="description" id="" cols="30" rows="5" placeholder="Describe your listing" required></textarea>
              </div>
              {/* Image Dropzone */}
              <div>
                <Dropzone
                className="card dropzone"
                accept="image/jpeg, image/jpg, image/png"
                multiple={false}
                onDropAccepted={ this._onDrop.bind(this) } maxSize={ 2000000 }
                onDragLeave= {this._onDrop.bind(this) } maxSize={ 2000000 }
                // onDropRejected = {can render a warning if we want}
                >
                  <div className="">
                    {!this.state.imagePrev ? 
                      <div className="text-center text-muted">
                        <p className="dropzone-text"> Click or drag photo </p> 
                        <p> Limit 2mb </p>
                      </div>
                    :
                      <div className="text-center">
                        <div > <p> Preview </p> </div>
                        <img className="dropzone-photo" src={this.state.imagePrev} />   
                      </div>
                    }
                  </div>
                </Dropzone>
              </div>
              {/* Submit */}
              <div className="d-flex justify-content-center create-listing-submit">
                <button onSubmit={this.onSubmitHandler.bind(this)} className="btn btn-outline-dark">Create</button>
              </div>
            </form>
          </div>
        </div>
=======
            :
              <div/>
          }
          
          <textarea name="description" ref="description" id="" cols="30" rows="10" placeholder="Describe your listing" required></textarea>
          <br/>

          <Dropzone 
            accept="image/jpeg, image/jpg, image/png"
            multiple={false}
            onDropAccepted={ this._onDrop.bind(this) } maxSize={ 2000000 }
            onDragLeave= {this._onDrop.bind(this) } maxSize={ 2000000 }
            // onDropRejected = {can render a warning if we want}
            // className="dropzone"   <-- Daniel-san, add styles to .dropzone later! onegaishimasu
          >
            <div>
              Click or drag photo here! Limit 2mb
                {!this.state.imagePrev ? <div><br/>Photo is required</div> : <div>Preview: <br/><img style={{maxHeight: '120px'}} src={this.state.imagePrev} /></div> }
            </div>
          </Dropzone>

          <button>Create</button>
        </form>
>>>>>>> [add] fixing messages...
      </div>
    )
  }
}

export default CreateListingForm;