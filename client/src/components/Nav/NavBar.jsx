import React from 'react';
import SearchBar from '../Search/SearchBar';
import { Link } from 'react-router-dom';

class NavBar extends React.Component {
  render() {
    return (
      <div>
        <div>
          <Link to="/">Wayfare</Link>
        </div>
        <SearchBar />
        {/* if not logged in do this */}
        <div>
          <Link to="/login"><button>Login</button></Link>
          <Link to="/signup"><button>Signup</button></Link>
        </div>
        {/* else show logout button */}
        {/* <div>
          <button>Logout</button>
        </div> */}
        <hr/>
      </div>
    )
  }
};

export default NavBar;