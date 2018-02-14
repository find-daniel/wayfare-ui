import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'
import { Link } from 'react-router-dom';


class CompletedListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: [], 
      type: 0
    }
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
        listings: payload, 
        type: accountType
      })
    } catch(err) {
      throw new Error(err)
    }
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
                <Link type='button' className="btn btn-outline-secondary btn-sm" to={{
                  pathname:`/user/${this.props.match.params.userId}/review`,
                  state: { commentor: (this.state.type === '0' ? listing[0].guestid : listing[0].hostid), 
                      commentee: (this.state.type === '1' ? listing[0].guestid : listing[0].hostid), 
                      listingId: listing[0].id,
                      type: (this.state.type === '0' ? 'guest' : 'host')}
                  }}>Review</Link>
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
