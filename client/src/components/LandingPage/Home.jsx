import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1> Inside Home </h1>
        {/* Links for development only ** for now ** */}
        <Link to="/listing/:listingId"><button>Switch to listingPage</button></Link>
        <Link to={`/user/${localStorage.getItem('activeUser')}/create-listing`}><button>Switch to createListingForm</button></Link>
        <Link to="/listing/book/:listingId"><button>Switch to BookingForm</button></Link>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    active_user: state.active_user
  }
};

export default connect(mapStateToProps)(Home);