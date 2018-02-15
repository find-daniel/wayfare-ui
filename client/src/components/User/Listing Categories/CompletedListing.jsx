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
      <div className="listings-box">
        <ul className="list-group">
          {
            this.state.listings.map((listing, i) => {
              return (
                <li key={i} className="list-group-item listing-box d-flex justify-content-around">
                  <div className="col-sm-9 pending-item-content">
                    <div>
                      <Link className="fix-link" to={{pathname:`/listing/${listing[0].id}`}}>
                        <h5>
                          {listing[0].title}
                        </h5>
                      </Link>
                      <hr/>
                    </div>
                    <div className="d-flex justify-content-start">
                      <div>
                        <h6>Status:</h6>
                      </div>
                      <div>
                        <h5><span className="badge badge-success pending-badge">{`${listing[0].status}`}</span></h5>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3 d-flex justify-content-around pending-buttons">
                    {
                      listing[1] 
                    ?
                      null
                    :
                    <div>
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

export default connect(mapStateToProps)(CompletedListing);
