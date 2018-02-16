import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSearchResults } from '../../actions/actionCreators';
import axios from 'axios'
import ListingEntry from '../Listings/ListingEntry';
import SearchMap from './SearchMap';
import NavBar from '../Nav/NavBar';
import url from '../../config'
import './Search.css';

class SearchResultPage extends React.Component {
  async componentDidMount () {
    
    const data = await axios.get(`${url.restServer}/api/listing/getSearchedListings`, { 
      params: { city: decodeURIComponent(location.pathname.substr(location.pathname.lastIndexOf('/') + 1)).split(',')[0].toLowerCase()}
    });
    let pendingOnly = data.data.rows.filter(listing => listing.status === 'pending')
    this.props.setSearchResults(pendingOnly);
  }

  render() {
    return (
      <div className="row">
        {!this.props.search_results ? <div className="col-sm-8"></div> :
          <div className="col-sm-8">
            <div className="header">
              <h1 className="d-flex justify-content-center">{localStorage.getItem('searchQuery')}</h1>
              <hr/>
            </div>
            <div className="container search-result-box">
              <div className="d-flex justify-content-around">
                <div className="card-columns row">
                  {this.props.search_results.map(entry => {
                    return <ListingEntry key={entry.id} info={entry} />
                  })}
                </div>
              </div>
            </div>
          </div>
        }
        <div className="col-sm-4">
          <div className="search-map">
            <SearchMap />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    search_results: state.search_results
  }
};

function matchDispatchToProps (dispatch) {
  return bindActionCreators({
    setSearchResults
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SearchResultPage);