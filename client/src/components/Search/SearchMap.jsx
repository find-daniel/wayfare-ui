import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import axios from 'axios';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import { compose, withProps } from 'recompose';
import { setTimeout } from 'timers';
import url from '../../config';
import styles from './MapStyles.js';


const MyMapComponent = compose(
  
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '92.5vh'}} />,
    mapElement: <div style={{ height: '100%'}} />

  }),
  withScriptjs,
  withGoogleMap
)((props) =>
    <GoogleMap
      defaultZoom= {8}
      defaultCenter={{ lat: props.maplat, lng: props.maplng }}
      defaultOptions={{ styles: styles }}
      >
      {props.isMarkerShown && props.listings && props.listings.map((listing, i) => {
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
    
    //encodeURIComponent
    let formattedCity = decodeURIComponent(location.pathname.substr(location.pathname.lastIndexOf('/') + 1)).split(',')[0].split(' ').join('+');
    // let formattedCity = localStorage.getItem('searchQuery').split(',')[0].split(' ').join('+') || ''
    let formattedState = decodeURIComponent(location.pathname.substr(location.pathname.lastIndexOf('/') + 1)).split(',')[1] || ''

    // let formattedState = localStorage.getItem('searchQuery').split(',')[1] || '' || location.pathname.substr(location.pathname.lastIndexOf('/') + 1).split(',')[0].split(' ').join('+')

    let listingAddressURL = ''
    let geodata = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${listingAddressURL},+${formattedCity},+${formattedState}&key=${process.env.GOOGLE_GEO_API}`)
    let parsedGeoData = JSON.parse(geodata.request.responseText)

    if (parsedGeoData.results[0]) {
      this.setState({
        maplat: parsedGeoData.results[0].geometry.location.lat,
        maplng: parsedGeoData.results[0].geometry.location.lng,
      })
    }

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
        !(this.state.maplat > 0)
        ? null
        : (
          <MyMapComponent
          
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          maplng={this.state.maplng}
          maplat={this.state.maplat}
          listings={this.props.search_results}
          />
        )
        
        
      }
      </div>
      
    )
  }
}

function mapStateToProps (state) {
  return {
    search_results: state.search_results
  }
}




export default connect(mapStateToProps)(SearchMap);