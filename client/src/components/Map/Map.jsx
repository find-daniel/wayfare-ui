import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import axios from 'axios';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { setTimeout } from 'timers';
import url from '../../config'


const MyMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=AIzaSyB_yMI7INqtmKuT8R4176-c1XvANlA73vg&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '400px'}} />,
    mapElement: <div style={{ height: '100%'}} />

  }),
  withScriptjs,
  withGoogleMap
)((props) =>
    <GoogleMap
      defaultZoom= {8}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      >
      {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.lng }} onClick={props.onMarkerClick}/>}
    </GoogleMap>
) 


class myMap extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isMarkerShown: false,
      lat: '', 
      lng: ''
    }
  this.delayedShowMarker = this.delayedShowMarker.bind(this);
  this.handleMarkerClick = this.handleMarkerClick.bind(this)
  }

  async componentDidMount() {
    let listing = await axios.get(`${url.restServer}/api/listing/getListing`, {
      params: {listingId: this.props.listing}
    }); 

    this.setState({
      lat: Number(listing.data.latitude), 
      lng: Number(listing.data.longitude)
    })

    this.delayedShowMarker();
  }

  delayedShowMarker() {
    
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 300)
  }

  handleMarkerClick() {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker();
   
  }

  render() {
     
    return (
      <div>
      {
        !this.state.lat > 0
        ? null
        : (
          <MyMapComponent
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          lng={this.state.lng}
          lat={this.state.lat}
          />
        )
        
        
      }
      </div>
      
    )
  }
}




export default myMap;