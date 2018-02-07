import React from 'react';
import "babel-polyfill";
import axios from 'axios'; 
import { Link } from 'react-router-dom'
import './listings.css'


class ListingInfo extends React.Component {
  constructor(props) {
    super(props); 
  }

  render() {
    return (
      <div className="card hostInfo">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">{this.props.listing.startdate} - {this.props.listing.enddate}, {this.props.listing.city}</h4>
            <p className="card-text">
              {this.props.listing.description}
            </p>
            <h6> Skills for Stay: </h6>
              <ul>
              {this.props.skills.length > 0 
                ? 
                  this.props.skills.map(skill => {
                    return <li>{skill.skill}</li>
                  })
                :
                <li></li>
                }
              </ul>
            <div className="bookingButtonEntry">
              <a href="#" type="button" className="btn btn-light">Request Booking</a>
            </div>
          </div>
        </div>
        <p></p>
        <div className="card hostBox">
          <span>
            <img className="host-image" src={this.props.user.image}/>
            <Link class="hostInfoLink" to={`/user/${this.props.user.uid}`}>{this.props.user.name}</Link>
          </span>
        </div>
      </div>

      //   <div className="hostBox">
      //     <span className="hostImageBox">
      //       <img className="host-image " src={this.props.user.image}/> 
      //     </span>
      //     {/* <span className="hostInfoBox"> */}
      //     <Link class="hostInfoLink" to={`/user/${this.props.user.uid}`}>{this.props.user.name}</Link>
      //     {/* </span> */}
      //   </div>
      // </div>
    )
  }
};

export default ListingInfo;