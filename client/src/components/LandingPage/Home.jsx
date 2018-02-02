import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1> Inside Home </h1>
        <Link to="/user/:userId"><button>Switch to userpage </button></Link>
      </div>
    )
  }
}

export default Home;