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
      defaultCenter={{ lat: props.maplat, lng: props.maplng }}
      >
      {props.isMarkerShown && props.listings.map((listing, i) => {
        console.log('listinggggggg', listing)
        return (<Marker key={i} position={{ lat: parseFloat(listing.latitude), lng: parseFloat(listing.longitude)}} onClick={props.onMarkerClick}/>)
      })
    } 
    </GoogleMap>
) 


class SearchMap extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isMarkerShown: false,
      city: '',
      state: '',
      maplat: 0, 
      maplng: 0
    }
  this.delayedShowMarker = this.delayedShowMarker.bind(this);
  this.handleMarkerClick = this.handleMarkerClick.bind(this)
  }

  async componentDidMount() {
    
    let listingAddressURL = ''
    let geodata = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${listingAddressURL},+${localStorage.getItem('searchQuery').split(',')[0].split(' ').join('+')},+${localStorage.getItem('searchQuery').split(',')[1]}&key=AIzaSyBvPqU7ldLdjnZvfEvXs9WIAJbbcodpfBE`)
    let parsedGeoData = JSON.parse(geodata.request.responseText)
    console.log('parsedd', parsedGeoData)
    this.setState({
      maplat: parsedGeoData.results[0].geometry.location.lat,
      maplng: parsedGeoData.results[0].geometry.location.lng,
    })
    this.delayedShowMarker();
    console.log('searchquery', localStorage.getItem('searchQuery'))
    console.log('testes', this.state.maplat)
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
        {console.log('check check', this.state.lat)}
      { 
        !(this.state.maplat > 0)
        ? null
        : (
          <MyMapComponent
          
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          maplng={this.state.maplng}
          maplat={this.state.maplat}
          />
        )
        
        
      }
      </div>
      
    )
  }
}




export default SearchMap;