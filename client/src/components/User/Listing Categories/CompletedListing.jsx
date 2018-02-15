import React from 'react';
import axios from 'axios';
import 'babel-polyfill';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import url from '../../../config'
import { Link } from 'react-router-dom';
import './ListingCategories.css'


class CompletedListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: [], 
      type: 0
    }
  }

  async componentWillMount() {
    try {
      const response = await axios.get(`${url.restServer}/api/listing/getListingsByStatus`, {
        params: {status: 'complete'}
      })
      const listings = response.data.rows
      const accountType = await localStorage.getItem('accountType')
      const activeId = await localStorage.getItem('activeId')

      const payload = []
      if (accountType === '0') {
        for (let i = 0; i < listings.length; i++) {
          if (activeId === JSON.stringify(listings[i].guestid)) {
            const data = await axios.get(`${url.restServer}/api/users/getUserReviewsByListing`, {
              params: {listingId: listings[i].id, userId: listings[i].guestid}
            })
            const bool = data.data.rows.length > 0; 
            payload.push([listings[i], bool])
          }
        }

      }
      if (accountType === '1') {
        for (let i = 0; i < listings.length; i++ ) {
          if (activeId === JSON.stringify(listings[i].hostid)) {
            const data = await axios.get(`${url.restServer}/api/users/getUserReviewsByListing`, {
              params: {listingId: listings[i].id, userId: listings[i].hostid}
            })
            const bool = data.data.rows.length > 0; 
            payload.push([listings[i], bool])
          }
        }
      }
      await this.setState({
        listings: [...payload, ...this.state.listings], 
        type: accountType
      })
    } catch(err) {
      throw new Error(err)
    }
  }  


  render() {
    return (
      <ul className="list-group">
        {
          this.state.listings.map((listing, i) => {
            return (
              <li key={i} className="list-group-item listing-box d-flex justify-content-around">
                <div className="col-sm-4 text-center">
                  <h6>Listing</h6>
                  <hr/>
                  <h4><Link to={{pathname:`/listing/${listing[0].id}`}} className="badge badge-secondary link">{listing[0].title}</Link></h4>
                </div>
                <div className="col-sm-4 text-center">
                  <h6>Status</h6>
                  <hr/>
                  <h4><span className="badge badge-success">{`${listing[0].status}`}</span></h4>
                </div>
                {listing[1] 
                ?
                  null
                :
                <div className="col-sm-2 completed-review-button">
                  <Link to={{
                    pathname:`/user/${this.props.match.params.userId}/review`,
                    state: { commentor: (this.state.type === '0' ? listing[0].guestid : listing[0].hostid), 
                        commentee: (this.state.type === '1' ? listing[0].guestid : listing[0].hostid), 
                        listingId: listing[0].id,
                        type: (this.state.type === '0' ? 'guest' : 'host')}
                    }}><button className="btn btn-outline-primary"> Review </button>
                  </Link>
                </div>
                }         
              </li>
            )      
          })
        }
      </ul>
    )      
  }
};

function mapStateToProps(state) {
  return {
    user_data: state.user_data
  }
}

export default connect(mapStateToProps)(CompletedListing);
