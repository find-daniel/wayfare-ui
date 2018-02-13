import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'

class InProgressListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: []
    }

    this.completeListingHandler = this.completeListingHandler.bind(this); 
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${url.restServer}/api/listing/getListingsByStatus`, {
        params: {status: 'progress'}
      })
      const listings = response.data.rows
      const accountType = await localStorage.getItem('accountType')
      const activeId = await localStorage.getItem('activeId')

      const payload = []
      if (accountType === '0') {
        await listings.map(listing => {
          if (activeId === JSON.stringify(listing.guestid)) {
            payload.push(listing)
          }
        })
      }
      if (accountType === '1') {
        await listings.map(listing => {          
          if (activeId === JSON.stringify(listing.hostid)) {
            payload.push(listing)
          }
        })
      }
      await this.setState({
        listings: payload
      })
    } catch(err) {
      throw new Error(err)
    }
  }  

  async completeListingHandler(listing) {
    await axios.put('http://localhost:3396/api/listing/completeListing', {
      params: {listingId: listing.id}
    })
    this.componentDidMount(); 
  }

  render() {
    return (
      <div>
        <h2>This is the host's in-progress listing</h2>
        {
          this.state.listings.map((listing, i) => {
            return (
              <div key={i}>
                <div>
                  {`Listing: ${listing.title}`}
                </div>
                <div>
                  {`Status: ${listing.status}`}
                </div>
                <button type='button' className="btn btn-outline-secondary btn-sm" onClick={() => {this.completeListingHandler(listing)}}>Complete</button>
                <br/>            
              </div>
            )      
          })
        }
      </div>
    )      
  }
};

function mapStateToProps(state) {
  return {
    user_data: state.user_data
  }
}

export default connect(mapStateToProps)(InProgressListing);
