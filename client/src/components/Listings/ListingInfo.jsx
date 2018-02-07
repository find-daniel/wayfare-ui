import React from 'react';
import "babel-polyfill";
import axios from 'axios'; 
import { Link } from 'react-router-dom'


class ListingInfo extends React.Component {
  constructor(props) {
    super(props); 
    console.log(this.props); 
  }

  render() {
    return (
      <div>
        <img src={this.props.user.image}/> 
        <Link to={`/user/${this.props.user.uid}`}>{this.props.user.name}</Link>
        <p>{this.props.listing.startdate} - {this.props.listing.enddate}, {this.props.listing.city}</p>
        <p>{this.props.listing.description}</p>
        <p>Skills for Stay: </p>
        <ul>
        {this.props.skills.length > 0 
        ? 
          this.props.skills.map(skill => {
            return <li>{skill.skill}</li>
          })
        :
         <div></div>
        }
        </ul>
      </div>
    )
  }
};

export default ListingInfo;