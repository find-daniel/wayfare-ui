import React from 'react';
import axios from 'axios';

class CompletedListing extends React.Component {
  constructor () {
    super()
    this.state = {
      completedListings: []
    }
  }

async componentDidMount() {

let completedListings = await axios.get('http://localhost:3396/api/listing/getListingsByStatus', {params: {status: 'COMPLETED'}})
this.setState({
  completedListings: completedListings.data.rows
})
console.log('this.state.cooieme', this.state.completedListings)
}
  
  
  render () {
    
    return (
      <h2>This is a completed listing</h2>
    )
  }
};

export default CompletedListing;