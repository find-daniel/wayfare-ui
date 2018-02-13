import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'

class CompletedListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: []
    }
    
    this.reviewHandler = this.reviewHandler.bind(this); 
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${url.restServer}/api/listing/getListingsByStatus`, {
        params: {status: 'complete'}
      })
      const listings = response.data.rows
      const accountType = await localStorage.getItem('accountType')
      const activeId = await localStorage.getItem('activeId')

      const payload = []
      if (accountType === '0') {
        await listings.map(async (listing) => {
          if (activeId === JSON.stringify(listing.guestid)) {
            const data = await axios.get(`${url.restServer}/api/users/getUserReviewsByListing`, {
              params: {listingId: listing.id, userId: listing.guestid}
            })
            const bool = data.data.rows.length > 0; 
            payload.push([listing, bool])
          }
        })
      }
      if (accountType === '1') {
        await listings.map(async (listing) => {          
          if (activeId === JSON.stringify(listing.hostid)) {
            const data = await axios.get(`${url.restServer}/api/users/getUserReviewsByListing`, {
              params: {listingId: listing.id, userId: listing.hostid}
            })
            const bool = data.data.rows.length > 0; 
            payload.push([listing, bool])
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
  
  reviewHandler(listing) {
    //change review in listings to false
    //redirect to review page
  }

  render() {
    return (
      <div>
        <h2>This is the host's complete listing</h2>
        {
          this.state.listings.map((listing, i) => {
            return (
              <div key={i}>
                <div>
                  {`Listing: ${listing[0].title}`}
                </div>
                <div>
                  {`Status: ${listing[0].status}`}
                </div>
                {listing[1] 
                ?
                  <div/>
                :
                  <button type='button' className="btn btn-outline-secondary btn-sm" onClick={() => {this.reviewHandler(listing)}}>Review</button>
                }
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

export default connect(mapStateToProps)(CompletedListing);
