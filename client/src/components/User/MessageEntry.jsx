import React from 'react';
import { Link } from 'react-router-dom';

class MessageEntry extends React.Component {
  constructor (props) {
    super(props);
    console.log(props);
  }

  render () {
    const { message } = this.props;
    return (
      // If 
      parseInt(localStorage.getItem('activeId')) !== message.userId ?
        <li className="list-group-item">
          <div className="row">
            <div className="col-sm-3">
              <Link to={`/user/public/${message.userId}`} ><img className="chat-profile-pic" src={message.userImage} alt=""/></Link>
              {/* <span className="badge badge-secondary">{message.userName}</span> */}
            </div>
            <div className="col-sm-9 d-flex justify-content-center otherMessage">
              <p className="text-center text-div">{message.message}</p>
            </div>
          </div>
        </li>
      :
        <li className="list-group-item">
          <div className="row">
            <div className="col-sm-9 d-flex justify-content-center userMessage">
              <p className="text-center text-div">{message.message}</p>
            </div>
            <div className="col-sm-3">
              <img className="chat-profile-pic" src={message.userImage} alt=""/>
              {/* <span className="badge badge-secondary">{message.userName}</span> */}
            </div>
          </div>
        </li>
    )
  }
}

export default MessageEntry;