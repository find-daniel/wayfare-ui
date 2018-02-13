import React from 'react';

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
              <img style={{height: '30px'}} src={message.userImage} alt=""/>
              {message.userName}
            </div>
            <div className="col-sm-9 d-flex justify-content-start">
              {message.message}
            </div>
          </div>
        </li>
      :
        <li className="list-group-item">
          <div className="row">
            <div className="col-sm-9 d-flex justify-content-end">
              {message.message}
            </div>
            <div className="col-sm-3">
              <img style={{height: '30px'}} src={message.userImage} alt=""/>
              {message.userName}
            </div>
          </div>
        </li>
    )
  }
}

export default MessageEntry;