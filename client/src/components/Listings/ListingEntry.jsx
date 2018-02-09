import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import './listings.css'

class ListingEntry extends React.Component {
  constructor(props) {  
    super(props);

    this.state = {
      img: ''
    }
  }

  async componentDidMount () {
    const data = await axios.get('http://localhost:3396/api/listing/getPhoto', {
      params: { listingId: this.props.info.id }
    });

    this.setState({
      img: data.data
    });
  }

  render() {
    return (
      <div className="col-sm-3">
        <Link to={`/listing/${this.props.info.id}`}>
          <div className="fixLink" >
            <img className="card-img-top img-fluid" src={this.state.img} alt=""/>
            <h5 className="card-body" > {this.props.info.title} </h5>
          </div>
        </Link>
      </div>
    )
  }
}

export default ListingEntry;