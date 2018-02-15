import React from 'react';
import axios from 'axios';
import 'babel-polyfill';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'
import url from '../../../config'
import './ListingCategories.css'

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
          for (let i = 0; i <data.data.rows.length; i++) {
            guestPayload.push(data.data.rows[i])
          }
      }

      //if the user is a host, get all the listings they have with a pending status, and then all the requests made on those listings
      if (accountType === '1') {
        for (let i = 0; i < listings.length; i++) {
          if (activeId === JSON.stringify(listings[i].hostid)) {
            payload.push(listings[i])
            const data = await axios.get(`${url.restServer}/api/listing/getRequestsByListing`, {
              params: {listingId: listings[i].id}
            }); 
            for (let j = 0; j < data.data.rows.length; j++ ) {
              listingRequests.push(data.data.rows[j])
            }
          }
        }
      }
      this.setState({
        listings: payload,
        guestListings: guestPayload, 
        listingRequests
      })
    } catch(err) {
      throw new Error(err)
    }
  }  

  async acceptRequestHandler(listingId, guestId) {
    const response = await axios.put(`${url.restServer}/api/listing/acceptListing`, {
      params: {listingId: listingId , guestId: guestId}
    })

    await axios.delete(`${url.restServer}/api/listing/rejectListing`, {
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
      <div className="listings-box">
        {
          this.state.accountType === '0' 
          ? 
            <ul className="list-group">
              { this.state.guestListings.map((listing, i) => {
                  return (
                    <li className="list-group-item listing-box d-flex justify-content-around" key={i}>
                      <div className="col-sm-9 pending-item-content">
                        <div>
                          <h5> {listing.title} </h5>
                          <hr/>
                        </div>
                        <div className="d-flex justify-content-start">
                          <div>
                            <p>Status:</p>
                          </div>
                          <div>
                            <h5><span className="badge badge-secondary pending-badge">{listing.status}</span></h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3 d-flex justify-content-around pending-buttons">
                        <div className="text-center">
                          <Link to={`/listing/${listing.listingid}`}><button className="btn btn-outline-secondary btn-sm col-sm-12">View</button></Link>
                        </div>
                        <div className="text-center">
                          <button className="btn btn-outline-danger btn-sm col-sm-12" onClick={() => {this.rejectRequestHandler(listing)}}>Reject</button>        
                        </div>
                      </div>
                    </li>
                  )      
                })
              }
            </ul>
          :
            <ul className="list-group">
              { this.state.listings.map((listing, i) => {
                  return (
                    <li className="list-group-item listing-box d-flex justify-content-around" key={i}>
                      <div className="col-sm-9 pending-item-content">
                        <div>
                          <Link className="fix-link" to={`/listing/${listing.id}`}>
                            <h5> {listing.title} </h5>
                            <hr/>
                          </Link>
                        </div>
                        <div className="d-flex justify-content-start">
                          <div>
                            <p>Status:</p>
                          </div>
                          <div>
                            <h5><span className="badge badge-secondary pending-badge">{listing.status}</span></h5>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-3">
                        { this.state.listingRequests.map((request, i) => {
                          if (listing.id === request.listingid) {
                            return (
                              <div key={i} className="row d-flex justify-content-around host-pending-buttons">
                                <Link to={{pathname:`/user/public/${request.uid}`}} style={{color:'black'}}>
                                  <h5 className="requester-badge">
                                    <span className="badge badge-secondary"> {request.name} </span>
                                  </h5>
                                </Link>
                                <button type='button' className="btn btn-outline-success btn-sm" onClick={() => {this.acceptRequestHandler(listing.id, request.guestid)}}>ACCEPT</button>
                                <button type='button' className="btn btn-outline-danger btn-sm" onClick={() => {this.rejectRequestHandler(listing, request)}}>REJECT</button>
                              </div>
                            )
                          }
                        })}
                      </div>            
                    </li>
                  )      
                })
              }
            </ul>
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
