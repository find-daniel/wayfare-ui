import React from 'react';
import ListingEntry from '../Listings/ListingEntry';
import Map from '../Map/Map';

class SearchResultPage extends React.Component {
  render() {
    return (
      <div>
        <h2> Inside SearchResultPage </h2>
        <ListingEntry />
        <Map />
      </div>
    )
  }
}

export default SearchResultPage;