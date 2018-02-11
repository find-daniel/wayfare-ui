import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSearchResults } from '../../actions/actionCreators';
import axios from 'axios'
import ListingEntry from '../Listings/ListingEntry';
import SearchMap from './SearchMap';
import NavBar from '../Nav/NavBar';

class SearchResultPage extends React.Component {
  async componentDidMount () {
    // Setup axios request to fetch results
    const data = await axios.get('http://localhost:3396/api/listing/getSearchedListings', { 
      params: { city: localStorage.getItem('searchQuery') }
    });
    this.props.setSearchResults(data.data.rows);
  }

  render() {
    return (
      <div>
        {!this.props.search_results ? null :
          <div className="row" >
            <div className="col-sm-8">
              <h1>{localStorage.getItem('searchQuery')}</h1>
              <div className="container row" >
                {this.props.search_results.map(entry => {
                  return <ListingEntry key={entry.id} info={entry} />
                })}
              </div>
            </div>
            <div className="col-sm-4" style={{border: '1px solid black'}} >
              <SearchMap />
            </div>
          </div>
        }
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