import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import io from 'socket.io-client';
import { activeUser } from '../../actions/actionCreators';
import axios from 'axios';

class Messages extends React.Component {
  constructor() {
    super()
    this.state = {
      socket: null,
      message: '',
      author: null,
      message: '',
      messages: [],
      room: null
    }
    this.sendMessage = this.sendMessage.bind(this);
  }

  componentWillMount() {
    this.socket = io('http://localhost:4155', {
      query: {
        roomId: location.pathname.slice(1)
      }
    });
    console.log('socket', this.socket)
    axios.get('http://localhost:4155/api/chat/getMessages')
      .then((res) => {
        console.log('resss', res)
        this.setState({
          messages: res.data
        })
      })
      .catch(() => {
        console.log('error fetching messages')
      })

    this.setState({ socket: this.socket, room: location.pathname.slice(1) });
    console.log('messages', this.state.messages)
  }

  sendMessage(e) {
    e.preventDefault();
    this.setState({message: this.message})
    this.socket.emit('client.message', {
      author: this.props.active_user.displayName,
      authorImage: this.props.active_user.photoURL,
      message: this.state.message,
      room: this.state.room
    })
  }


  render() {
    return (
      <div className="container">
        <div className="card">
            <div className="card-body">
                <div className="card-title">Chat</div>
                <hr/>
                <div className="messages">

                </div>
                <div className="footer">
                    <br/>
                    <input type="text" placeholder="Message"  value={this.state.message} onChange={e => this.setState({message: e.target.value})}/>
                    <br/>
                    <button  onClick={(e) => this.sendMessage(e)}>Send</button>
                </div>
            </div>
        </div>  
      </div>
  );
}

}

function mapStateToProps(state) {
  return {
    active_user: state.active_user
  }
}

export default connect(mapStateToProps)(Messages);


//                              <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
