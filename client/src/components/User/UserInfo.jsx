import 'babel-polyfill';
import React from 'react';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { setUserData } from '../../actions/actionCreators';
import axios from 'axios';
import './UserInfo.css';
import url from '../../config'

class UserInfo extends React.Component {
  async componentDidMount() {
    const data = await axios.get(`${url.restServer}/api/users/getUser`, {params: {uid: localStorage.getItem('activeUid')}});
    this.props.setUserData(data.data.rows[0])
    localStorage.setItem('accountType', this.props.user_data.type);
  }

  async accountUpgradeHandler () {
    try {
      const payload = {
        uid: localStorage.getItem('activeUid'),
        type: this.props.user_data.type
      };
      // toggles host/guest
      const data = await axios.put(`${url.restServer}/api/users/upgradeUser`, payload);
      if (localStorage.getItem('accountType'), 0) {
        localStorage.setItem('accountType', 1)
      } else {
        localStorage.setItem('accountType', 0);
      }

    } catch (err) {
      console.error(err);
    }
    
    window.location.reload(true);
  }

  render() {
    if (!this.props.user_data) {
      return null
    } else {
      return (
        <div className="card card-box user-page-component">
          <div className="card-img-top img-background">
            <img className="img-fluid profile-pic" src={this.props.user_data.image} alt=""/>
          </div>
          <div className="card-body user-body">
            <div>
              <div style={{marginTop: '20px'}} >
                <h6>Rating:</h6>
                <p>{this.props.user_data.guestrating}</p>
              </div>
              <div>
                <h6>City:</h6>
                <p>{this.props.user_data.city}</p>
              </div>
              <div>
                <h6>Bio:</h6>
                <p>{this.props.user_data.bio}</p>
              </div>
            </div>
            {/* Check for active_user */}
            <div className="">
              <div className="col-sm-5">
                <Link to={`/user/${localStorage.getItem('activeUid')}/edit`}><button className="btn btn-sm btn-outline-dark">Edit</button></Link>
              </div>
              <div className="col-sm-5">
                {!this.props.user_data ? null :
                this.props.user_data.type === 0 ? 
                  <div>
                    <Link onClick={this.accountUpgradeHandler.bind(this)} to={`/user/${localStorage.getItem('activeUid')}/`}><button className="btn btn-outline-dark btn-sm switch-button">Switch to Host</button></Link>
                  </div>
                  :
                  <div>
                    <Link onClick={this.accountUpgradeHandler.bind(this)} to={`/user/${localStorage.getItem('activeUid')}/`}><button className="btn btn-outline-dark btn-sm switch-button">Switch to Guest</button></Link>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
}

function mapStateToProps (state) {
  return {
    active_user: state.active_user,
    user_data: state.user_data
  }
};

function matchDispatchToProps (dispatch) {
  return bindActionCreators({
    setUserData: setUserData
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(UserInfo);