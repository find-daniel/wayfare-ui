import 'babel-polyfill';
import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import './listings.css'
import url from '../../config'

class ListingEntry extends React.Component {
  constructor(props) {  
    super(props);

    this.state = {
      img: ''
    }
  }

  async componentDidMount () {
    const data = await axios.get(`${url.restServer}/api/listing/getPhoto`, {
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
          <div className="fixLink card listing-card" >
            <img className="card-img-top card-listing-image" src={this.state.img} alt=""/>
            <div className="card-body">
              <h5 className="card-title text-center"> {this.props.info.title} </h5>
              <div className="d-flex justify-content-center text-muted row">
                <p className="badge badge-secondary">{this.props.info.startdate}</p>
                <span className="fix-height">-</span>
                <p className="badge badge-secondary">{this.props.info.enddate}</p>
              </div>
              <p className="card-footer text-muted">{this.props.info.city}</p>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default ListingEntry;