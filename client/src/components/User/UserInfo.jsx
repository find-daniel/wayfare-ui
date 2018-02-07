import 'babel-polyfill';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { userData } from '../../actions/actionCreators';
import axios from 'axios';

class UserInfo extends React.Component {
  async componentDidMount() {
    const data = await axios.get('http://localhost:3396/api/users/getUser', {params: {uid: localStorage.getItem('activeUser')}});
    this.props.userData(data.data.rows[0])
    console.log('this is the user data: ', data.data.rows[0]);
  }

  render() {
    if (!this.props.user_data) {
      return null
    } else {
      return (
        <div className="card">
          <div className="card-img-top">
            <img className="img-fluid rounded" src={this.props.user_data.image} alt=""/>
          </div>
          <div className="card-body" >
            <div>
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
            {/* Check for active_user */}
            <div>
              <Link to={`/user/${localStorage.getItem('activeUser')}/edit`}><button className="btn-outline-dark">Edit</button></Link>
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
    userData: userData
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(UserInfo);