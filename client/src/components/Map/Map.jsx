import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import axios from 'axios';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { setTimeout } from 'timers';


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
      defaultCenter={{ lat: 33.976237, lng: -118.390752}}
      >
      {props.isMarkerShown && <Marker position={{ lat: 33.976237, lng: -118.390752 }} onClick={props.onMarkerClick}/>}
    </GoogleMap>
) 


class myMap extends React.PureComponent {
  constructor() {
    super()
    this.state = {
      isMarkerShown: false
    }

  }

  componentDidMount() {
    this.delayedShowMarker();
  }

  delayedShowMarker() {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick() {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker();
  }

  render() {
    return (
      <MyMapComponent
      isMarkerShown={this.state.isMarkerShown}
      onMarkerClick={this.handleMarkerClick}
      />
    )
  }
}




export default myMap;