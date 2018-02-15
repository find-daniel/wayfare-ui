import React from 'react';
import axios from 'axios';
import 'babel-polyfill';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'
import './listingCategories.css'
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
            payload.push(listing)
          }
        }
      }
      if (accountType === '1') {
        for (let i = 0; i < listings.length; i++) {
          if (activeId === JSON.stringify(listings[i].hostid)) {
            payload.push(listing)
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
      <div>
      { this.state.listings.length > 0 
        ?
          this.state.listings.map((listing, i) => {
            return (
              <div key={i}>
                <div>
                  Listing: <Link to={{pathname:`/listing/${listing.id}`}} className="link">{listing.title}</Link>
                </div>
                <div>
                  {`Status: ${listing.status}`}
                </div>
                {this.state.accountType === '0' 
                ?
                <p/>
                :
                <button type='button' className="btn btn-outline-secondary btn-sm" onClick={() => {this.completeListingHandler(listing)}}>Complete</button>
                }
                <br/>            
              </div>
            )      
          })
        :
        <h4>You currently have no in-progress listings! </h4>
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
