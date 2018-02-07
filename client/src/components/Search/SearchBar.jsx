import React from 'react';
import { Redirect } from 'react-router-dom';

class SearchBar extends React.Component {
  onSubmitHandler(e) {
    e.preventDefault();
    e.target.reset();
    console.log('submitted');
    // this.props.history.push('/search/something'); //
    
    // Setup axios request to fetch results
  }

  render() {
    return (
      <div>
        <form className="form-inline" onSubmit={this.onSubmitHandler.bind(this)}>
          <input className="form-control" type="text" placeholder="Search"/>
        </form>
      </div>
    )
  }
}

export default SearchBar;