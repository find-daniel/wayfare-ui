import React from 'react';
import axios from 'axios'

class InProgressListing extends React.Component {
  constructor () {
    super()
    this.state = {
      inProgressListings: []
    }
  }

async componentDidMount() {


let inProgressListings = await axios.get('http://localhost:3396/api/listing/getListingsByStatus', {params: {status: 'IN PROGRESS'}})
this.setState({
  inProgressListings: inProgressListings.data.rows
})
  // catch (err) {
  //   console.log('couldnt get listings', err);
  // }
console.log('this.state.inproowwe', this.state.inProgressListings)
}
 
  render () {
    return (this.state.inProgressListings.length > 0
    ?
    this.state.inProgressListings.map((listing, i) => {
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

export default InProgressListing;