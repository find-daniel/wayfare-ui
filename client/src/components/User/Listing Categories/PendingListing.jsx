import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'
import url from '../../../config'

class PendingListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: [], 
      accountType: 0, 
      guestListings: [], 
      listingRequests: []
    }
    this.acceptRequestHandler = this.acceptRequestHandler.bind(this); 
    this.rejectRequestHandler = this.rejectRequestHandler.bind(this); 
  }

  async componentDidMount() {
    try {
      const response = await axios.get(`${url.restServer}/api/listing/getListingsByStatus`, {
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
      const listingRequests = []; 
      //if the user is a guest, get all the listing requests made by them
      if (accountType === '0') {
          const data = await axios.get(`${url.restServer}/api/listing/getRequestsByGuest`, {
            params: {guestId: activeId}
          })
          await data.data.rows.map(request => {
            guestPayload.push(request)
        })
      }

      //if the user is a host, get all the listings they have with a pending status, and then all the requests made on those listings
      if (accountType === '1') {
        await listings.map( async listing => {          
          if (activeId === JSON.stringify(listing.hostid)) {
            payload.push(listing)
            const data = await axios.get(`${url.restServer}/api/listing/getRequestsByListing`, {
              params: {listingId: listing.id}
            }); 
            data.data.rows.forEach(request => {
              listingRequests.push(request); 
            })
          }
        })
      }
      await this.setState({
        listings: payload,
        guestListings: guestPayload, 
        listingRequests
      })
    } catch(err) {
      throw new Error(err)
    }
    console.log(this.state); 
  }  

  async acceptRequestHandler(listingId, guestId) {
    const response = await axios.put(`${url.restServer}/api/listing/acceptListing`, {
      params: {listingId: listingId , guestId: guestId}
    })
    this.componentDidMount(); 
  }

  async rejectRequestHandler(listing, request) {
    const activeId = await localStorage.getItem('activeId')
    const guestId = request === undefined ? activeId : request.guestid; 
    const accountType = await localStorage.getItem('accountType')

    await axios.delete(`${url.restServer}/api/listing/rejectListing`, {
        params: {listingId: listing.id , guestId: guestId}
      })
    this.componentDidMount(); 
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
                    <button type='button' className="btn btn-outline-secondary btn-sm" onClick={() => {this.rejectRequestHandler(listing)}}>REJECT</button>
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
                <dl key={i}>
                  <dt>
                    {`Listing: ${listing.title}`}
                  </dt>
                  <dt>
                    {`Status: ${listing.status}`}
                  </dt>
                    {this.state.listingRequests.map((request, i) => {
                      if (listing.id === request.listingid) {
                        return (
                        <dd key={i}>
                          <Link to={{pathname:`/user/public/${request.uid}`}} style={{color:'black'}}>{request.name}</Link>
                          <button type='button' className="btn btn-outline-primary btn-sm" onClick={() => {this.acceptRequestHandler(listing.id, request.guestid)}}>ACCEPT</button>
                          <button type='button' className="btn btn-outline-secondary btn-sm" onClick={() => {this.rejectRequestHandler(listing, request)}}>REJECT</button>
                        </dd>
                        )
                      }
                    })}
                  <br/>            
                </dl>
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
