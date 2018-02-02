import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1> Inside Home </h1>
        {/* Links for development only ** for now ** */}
        <Link to="/user/:userId"><button>Switch to userpage</button></Link>
        <Link to="/listing/:listingId"><button>Switch to listingPage</button></Link>
        <Link to="/user/create-listing"><button>Switch to createListingForm</button></Link>
        <Link to="/listing/book/:listingId"><button>Switch to BookingForm</button></Link>
      </div>
    )
  }
}

export default Home;