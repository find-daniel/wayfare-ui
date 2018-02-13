import React from 'react';
import axios from 'axios';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class CompletedListing extends React.Component {
  constructor () {
    super()
    this.state = {
      listings: []
    }
  }

  async componentDidMount() {
    try {
      const response = await axios.get('http://localhost:3396/api/listing/getListingsByStatus', {
        params: {status: 'complete'}
      })
      const listings = response.data.rows
      const accountType = await localStorage.getItem('accountType')
      const activeId = await localStorage.getItem('activeId')
      const activeUserName = await this.props.user_data.name      

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
  
  render() {
    return (
      <div>
        <h2>This is the host's complete listing</h2>
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
