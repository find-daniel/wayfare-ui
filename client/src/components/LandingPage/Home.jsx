import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../Nav/NavBar';

class Home extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <h1> Inside Home </h1>
        <Link to="/user/:userId"><button>Switch to userpage </button></Link>
      </div>
    )
  }
}

export default Home;