import React from 'react';
import "babel-polyfill";

class ListingInfo extends React.Component {
  constructor(props) {
    super(props); 
  }

  render() {
    return (
      <div>
        <h3>{this.props.listing.title}</h3>
        <p>{this.props.user}</p>
        <p>{this.props.listing.startdate} - {this.props.listing.enddate}, {this.props.listing.city}</p>
        <p>{this.props.listing.description}</p>
      </div>
    )
  }
};

export default ListingInfo;