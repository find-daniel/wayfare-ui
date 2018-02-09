import React from 'react';
import "babel-polyfill";
import axios from 'axios'; 
import { Link } from 'react-router-dom'
import './listings.css'


class ListingInfo extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      edit : false,
      skills: this.props.skills 
    }
    this.messageHandler = this.messageHandler.bind(this); 
    this.editListing = this.editListing.bind(this); 
    this.saveListing = this.saveListing.bind(this); 
    this.addSkill = this.addSkill.bind(this); 
    this.deleteSkill = this.deleteSkill.bind(this); 

  }

  
  editListing() {
    this.setState({
      edit : true
    })
    this.props.editInfo(); 
  }

  saveListing() {
    this.setState({
      edit : false
    })
    //send request to save stuff
    //reset fields 
    this.props.submitInfo(); 
  }

  addSkill() {
    let arr = this.state.skills; 
    console.log('arr', this.state.skills)
    arr.push(this.refs.skill.value); 
    this.setState({
      skills: arr
    })
  }

  deleteSkill() {

  }

  messageHandler() {
   //create a message room here
  }

  render() {
    return (
      <div className="card hostInfo">
        <div className="card">

          <div className="card-body body">
            {this.state.edit 
            ?
              <div>
                <input type="text" placeholder={this.props.listing.startdate}></input>
                <input type="text" placeholder={this.props.listing.enddate}></input>
                <input type="text" placeholder={this.props.listing.city}></input>
              </div>
            : 
            <h4 className="card-title">{this.props.listing.startdate} - {this.props.listing.enddate}, {this.props.listing.city}</h4>
            }
            <hr/>

            {this.state.edit 
            ?
              <div>
                <textarea className="descriptionInput" type="text" placeholder={this.props.listing.description}></textarea>
              </div>
            : 
              <p className="card-text">
                {this.props.listing.description}
              </p>
            }

            <hr/>
            <h6 className="skills"> Skills for Stay: </h6>

            <div>
              {this.state.edit
              ?
                <div>
                  <input type="text" ref="skill" placeholder="Skill for stay"></input><button onClick={this.addSkill}>+</button>
                  <ul>
                      {this.props.skills.map(skill => {
                        return  <li>{skill}<button onClick={this.deleteSkill}>-</button></li>
                      })}
                    </ul>
                </div>
              :
                this.props.skills.length > 0 
                  ? <ul>
                      {this.props.skills.map(skill => {
                        return  <li>{skill}</li>
                      })}
                    </ul>
                  :
                  <div></div>
                
              }
            </div>

            <div className="container">
              {this.props.listingOwner 
              ? 
                <div className="center" >
                  {this.state.edit 
                  ?
                    <button onClick={this.saveListing} type="button" className="btn btn-dark"> Save </button> 
                  :
                    <button onClick={this.editListing} type="button" className="btn btn-dark">Edit Listing</button>
                  }
                </div>
              :
                <div>
                  <Link to={`/listing/book/${this.props.listing.id}`} type="button" className="btn btn-light col-sm-5">Request Booking</Link>
                  <span className="col-sm-2"/>
                  <Link to={`/user/${localStorage.getItem('activeUser')}/inbox/${localStorage.getItem('activeUser')+this.props.listing.id+this.props.listing.hostid}`} type="button" className="btn btn-light col-sm-5" onClick={this.messageHandler}>Message Host</Link>
                </div>
              }
            </div>

          </div>

        <p></p>


        </div>
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