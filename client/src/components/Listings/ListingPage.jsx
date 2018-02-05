import React from 'react';
import SearchBar from '../Search/SearchBar';
import ListingInfo from './ListingInfo';
import Pictures from './Pictures';
import Map from '../Map/Map';
import ListingReviewsList from '../Reviews/ListingReviewsList';

class ListingPage extends React.Component {
  render() {
    return (
      <div>
        <h2> Inside ListingPage </h2>
        <ListingInfo />
        <Pictures/>
        <Map />
        <ListingReviewsList />
      </div>
    )
  }
}

export default ListingPage;