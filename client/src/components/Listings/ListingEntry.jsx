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
          <div className="fixLink card" >
            <img className="card-img-top img-fluid" src={this.state.img} alt=""/>
            <div className="card-body">
              <h5 className="card-title"> {this.props.info.title} </h5>
              <div className="offset-sm-1 text-muted row">
                <p className="badge badge-secondary">{this.props.info.startdate}</p>
                <span>-</span>
                <p className="badge badge-secondary">{this.props.info.enddate}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    )
  }
}

export default ListingEntry;