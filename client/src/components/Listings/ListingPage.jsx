import React from 'react';
import SearchBar from '../Search/SearchBar';
import ListingInfo from './ListingInfo';
import Pictures from './Pictures';
import Map from '../Map/Map';
import ReviewsList from '../Reviews/ReviewsList';

class ListingPage extends React.Component {
  render() {
    return (
      <div>
        <h2> Inside ListingPage </h2>
        <SearchBar />
        <ListingInfo />
        <Pictures />
        <Map />
        <ReviewsList />
      </div>
    )
  }
}

export default ListingPage;