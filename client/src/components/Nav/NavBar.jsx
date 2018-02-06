import React from 'react';
import SearchBar from '../Search/SearchBar';
import { Link } from 'react-router-dom';

class NavBar extends React.Component {
  render() {
    return (
      <div className="navbar" >
        <div>
          <Link className="navbar-brand" to="/">Wayfare</Link>
        </div>
        <div className="navbar-nav" >
          <div>
            <SearchBar />
          </div>
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
      </div>
    )
  }
};

export default NavBar;