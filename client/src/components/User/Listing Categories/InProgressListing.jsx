import React from 'react';
import axios from 'axios';
import 'babel-polyfill';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'
import './ListingCategories.css'
import { Link } from 'react-router-dom';


class InProgressListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: [], 
      accountType: 0
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
        for (let i = 0; i < listings.length; i++) {
          if (activeId === JSON.stringify(listings[i].guestid)) {
            payload.push(listings[i])
          }
        }
      }
      if (accountType === '1') {
        for (let i = 0; i < listings.length; i++) {
          if (activeId === JSON.stringify(listings[i].hostid)) {
            payload.push(listings[i])
          }
        }
      }
      await this.setState({
        listings: payload, 
        accountType
      })
    } catch(err) {
      throw new Error(err)
    }
  }  

  async completeListingHandler(listing) {
    await axios.put(`${url.restServer}/api/listing/completeListing`, {
      params: {listingId: listing.id}
    })
    this.componentDidMount(); 
  }

  render() {
    return (
      <div className="listings-box">
        <ul className="list-group">
          {
            this.state.listings.map((listing, i) => {
              return (
                <li className="list-group-item listing-box d-flex justify-content-around" key={i}>
                  <div className="col-sm-9 pending-item-content">
                    <div>
                      <Link className="fix-link" to={{pathname:`/listing/${listing.id}`}}>
                        <h5>
                          {listing.title}
                        </h5>
                      </Link>
                      <hr/>
                    </div>
                    <div className="d-flex justify-content-start">
                      <div>
                        <p>Status:</p>
                      </div>
                      <div>
                        <h5><span className="badge badge-success pending-badge">{listing.status}</span></h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 d-flex justify-content-around pending-buttons">
                    <button className="btn btn-outline-primary" onClick={() => {this.completeListingHandler(listing)}}>Complete</button>
                  </div>
                </li>
              )      
            })
          }
        </ul>
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
