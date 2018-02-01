import React from 'react';

class SearchBar extends React.Component {
  onSubmitHandler(e) {
    e.preventDefault();
    e.target.reset();
    console.log('submitted');
    
    // Setup axios request to fetch results
  }

  render() {
    return (
      <div>
        <form action="submit" onSubmit={this.onSubmitHandler.bind(this)} >
          <input type="text" placeholder="Search"/>
        </form>
      </div>
    )
  }
}

export default SearchBar;