import React from 'react';
import "babel-polyfill";
import axios from 'axios'; 
import { Link } from 'react-router-dom'
import './listings.css'


class ListingInfo extends React.Component {
  constructor(props) {
    super(props); 

    this.messageHandler = this.messageHandler.bind(this); 
  }

  messageHandler() {
   //create a message room here
  }

  render() {
    return (
      <div className="card hostInfo">
        <div className="card">
          <div className="card-body body">
            <h4 className="card-title">{this.props.listing.startdate} - {this.props.listing.enddate}, {this.props.listing.city}</h4>
            <hr/>
            <p className="card-text">
              {this.props.listing.description}
            </p>
            <hr/>
            <h6 className="skills"> Skills for Stay: </h6>
              {this.props.skills.length > 0 
                ? <ul>
                    {this.props.skills.map(skill => {
                      return  <li>{skill.skill}</li>
                    })}
                  </ul>
                :
                <div>
                  <p></p>
                  <p></p>
                  <div></div>
                </div>
                }
            <div className="container">
              <Link to={`/listing/book/${this.props.listing.id}`} type="button" className="btn btn-light col-sm-5">Request Booking</Link>
              <span className="col-sm-2"/>
              <Link to={`/user/${localStorage.getItem('activeUser')}/inbox/${localStorage.getItem('activeUser')+this.props.listing.id+this.props.listing.hostid}`} type="button" className="btn btn-light col-sm-5" onClick={this.messageHandler}>Message Host</Link>
            </div>
          </div>
        </div>
        <p></p>
        <div className="card hostBox">
          <span>
            <img className="host-image" src={this.props.user.image}/>
            <span className="hostInfoBox">
              <Link className="hostInfoLink" to={`/${this.props.user.uid}`}>{this.props.user.name}</Link>
            </span>
          </span>
        </div>
      </div>
    )
  }
};

export default ListingInfo;