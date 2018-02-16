import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import './Home.css'
import axios from 'axios';
import ListingEntry from '../Listings/ListingEntry'
import url from '../../config'

class Home extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      topListings: []
    }
  }

  async componentDidMount() {
    const data = await axios.get(`${url.restServer}/api/listing/getTopListings`);
    let arr = []; 
    data.data.forEach(listing => {
      if (listing.id !== null) {
        arr.push(listing); 
      }
    })
    this.setState({
      topListings: arr
    });

  }

  render() {
    return (
      <div className="background">
        <div className="jumbotron jumbotron-fluid jumbo" >
          <div className="container text-center text-light" >
            <h1 className="display-4">Wayfare</h1>
            <p className="lead">Travel Freely...</p>
          </div>
        </div>
        <div className="offset-sm-1 col-sm-10 offset-sm-1 montserrat">
          <h1>Top Listings</h1>
          <hr/>
          <div className="row card-columns">
            {this.state.topListings.map((listing, i) => {
              return <ListingEntry key={i} info={listing} />
            })}
          </div>
        </div>
        <footer className="footer">
          <div className="text-muted">
            <span className="offset-sm-4 col-sm-3" >Made with sweat and tears by Chris, Eric, Shivani, Brian, and Daniel.</span>
            <span className="offset-sm-2">Wayfare 2018</span>
          </div>
        </footer>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    
    active_user: state.active_user,
    user_data: state.user_data

  }
};

export default connect(mapStateToProps)(Home);