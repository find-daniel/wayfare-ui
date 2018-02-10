import React from 'react';
import axios from 'axios';

class PendingListing extends React.Component {
  constructor () {
    super()
    this.state = {
      pendingListings: []
    }
  }

async componentDidMount() {

let pendingListings = await axios.get('http://localhost:3396/api/listing/getListingsByStatus', {params: {status: 'PENDING'}})
this.setState({
  pendingListings: pendingListings.data.rows
})
console.log('this.state.pedninglsdih', this.state.pendingListings)
}
  
  
  
  render () {
    return (this.state.pendingListings.length > 0
      ?
      this.state.pendingListings.map((listing, i) => {
        return (
          <div key={i}>
            {listing.title}
          </div>
        )
  
      })
      :
      null)
  }
};

export default PendingListing;