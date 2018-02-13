import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PendingListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: [], 
      accountType: 0, 
      guestListings: []
    }
    this.acceptRequestHandler = this.acceptRequestHandler.bind(this); 
    this.rejectRequestHandler = this.rejectRequestHandler.bind(this); 
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:3396/api/listing/getListingsByStatus', {
        params: {status: 'pending'}
      })
      const listings = response.data.rows
      const accountType = await localStorage.getItem('accountType')
      const activeId = await localStorage.getItem('activeId')

      this.setState({
        accountType
      })

      
      const payload = []; 
      const guestPayload = []; 

      //if the user is a guest, get all the listing requests made by them
      if (accountType === '0') {
          const data = await axios.get('http://localhost:3396/api/listing/getRequestsByGuest', {
            params: {guestId: activeId}
          })
          await data.data.rows.map(request => {
            guestPayload.push(request)
        })
      }

      //if the user is a host, get all the listings they have with a pending status, and then all the requests made on those listings
      if (accountType === '1') {
        await listings.map(listing => {          
          if (activeId === JSON.stringify(listing.hostid)) {
            payload.push(listing)
          }
        })
      }
      await this.setState({
        listings: payload,
        guestListings: guestPayload
      })
    } catch(err) {
      throw new Error(err)
    }
  }  

  async acceptRequestHandler(listingId, guestId) {
    // const response = await axios.get('http://localhost:3396/api/listing/acceptListing', {
    //   params: {listingId: listingId , guestId: guestId}
    // })
    
  }

  async rejectRequestHandler(listing) {
    const activeId = await localStorage.getItem('activeId')
    const accountType = await localStorage.getItem('accountType')
    if (accountType === '0') {
      //reject for guest
      let tempGuestListings = this.state.guestListings; 
      tempGuestListings.forEach((guestListing, i) => {
        if (guestListing.id === listing.id) {
          delete tempGuestListings[i]; 
        }
      })
      this.setState({
        guestListings: tempGuestListings
      })
      await axios.delete('http://localhost:3396/api/listing/rejectListing', {
          params: {listingId: listing.id , guestId: activeId}
        })
    } else {
      //reject for host

    }
  }
  
  render() {
    return (
      <div>
        {this.state.accountType === '0' 
        ? 
          <div>
            <h2>This is the guests's pending listing</h2>
          {
            this.state.guestListings.map((listing, i) => {
              return (
                <div key={i}>
                  <div>
                    {`Listing: ${listing.title}`}
                  </div>
                  <div>
                    {`Status: ${listing.status}`}
                  </div>
                    <button type='button' className="btn btn-outline-secondary" onClick={() => {this.rejectRequestHandler(listing)}}>REJECT</button>
                  <br/>            
                </div>
              )      
            })
          }
          </div>
        :
        <div>
          <h2>This is the host's pending listing</h2>
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
                    {/* //add in map for requests
                      //for each request */}
                      <div>
                        <button type='button' className="btn btn-outline-primary" onClick={() => {this.acceptRequestHandler(listing)}}>ACCEPT</button>
                        <button type='button' className="btn btn-outline-secondary" onClick={() => {this.rejectRequestHandler(listing)}}>REJECT</button>
                      </div>
                  <br/>            
                </div>
              )      
            })
          }
        </div>
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

export default connect(mapStateToProps)(PendingListing);
