import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setSearchResults } from '../../actions/actionCreators';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Search.css'

class SearchBar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      search: ''
    }
    
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler() {
    window.location.reload(true);
    this.props.setSearchResults('');
  }

  onChangeHandler (e) {
    this.setState({
      [e.target.name] : e.target.value
    });
    localStorage.setItem('searchQuery', e.target.value);
  }

  render() {
    return (
      <div>
        <form className="form-inline">
          <input name="search" className="form-control search-bar" onChange={this.onChangeHandler} type="text" placeholder="Search"/>
          <Link onClick={this.onClickHandler} style={{display: 'none'}} to={`/search/${localStorage.getItem('searchQuery')}`}><button>Submit</button></Link>
        </form>
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

export default connect(mapStateToProps, matchDispatchToProps)(SearchBar);