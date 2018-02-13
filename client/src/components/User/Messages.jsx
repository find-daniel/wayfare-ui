import React from 'react';
import 'babel-polyfill';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import { Link, Route } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { setActiveUser } from '../../actions/actionCreators';
import MessageEntry from './MessageEntry';
import './UserInfo.css'

// rename to Chat
class Messages extends React.Component {
  constructor() {
    super()
    this.state = {
      socket: null,
      author: null,
      messages: [],
      room: null,
      rooms: [],
      message: '',
      currentUrl: ''
    }
    this.sendMessage = this.sendMessage.bind(this);
    this.onClickRefresh = this.onClickRefresh.bind(this);
  }

  async componentDidMount () {
    const data = await axios.get('http://localhost:4155/api/rooms/getRooms', {
      params: {
        id: localStorage.getItem('activeId'),
        accountType: localStorage.getItem('accountType')
      }
    });
    
    this.setState({
      rooms: data.data
    })

    const roomId = location.pathname.substr(location.pathname.lastIndexOf('/') + 1);
    const socket = io('http://localhost:4155', {
      query: {
        roomId
      }
    });   

    this.setState({ socket: socket, room: roomId });

    try {
       const data = await axios.get(`http://localhost:4155/api/chat/getMessages`, { 
         params: {
           roomId: this.state.room,
           userId: localStorage.getItem('activeId'),
           accountType: localStorage.getItem('accountType')
         }
        })

        this.setState({
          messages: data.data.reverse()
        })

        let chatBox = document.getElementById('chat-messages');
        chatBox.scrollTop = chatBox.scrollHeight;
      }
    catch (err) {
        console.log('couldnt fetch err', err)
      }
      
    
    socket.on('connect', () => {
      socket.emit('client.ready', this.state.room)
    })

    socket.on('server.initialState', () => {
      this.setState({socket})
    })

    socket.on('server.message', async (data) => {
      // console.log('this.state',this.state)
      // console.log('this.props',this.props)
      try {
        const lastmessage = await axios.get('http://localhost:4155/api/chat/getLastMessage')
         this.setState({
          messages: [...this.state.messages, lastmessage.data[0]]
        })
        
        let chatBox = document.getElementById('chat-messages');
        chatBox.scrollTop = chatBox.scrollHeight;
      }
      catch (err) {
        console.log('couldnt get last message', err)
      }
    })
  }

  sendMessage(e) {
  
    e.preventDefault();

    this.setState({message: this.state.messages})

    // by the time this component is loaded, information about the guest and the host
    // will already be on this.state. no need to grab anything from localStorage or redux.

    this.state.socket.emit('client.message', {
      userId: this.props.user_data.id,
      userName: this.props.user_data.name,
      userImage: this.props.user_data.image,
      message: this.state.message,
      room: this.state.room
    })

    this.setState({
      message: ''
    })
  }

  onClickRefresh () {
    this.setState({
      currentUrl: room.roomId
    })
  }

  render() {
    return (
      <div className="row chat">
        <div className="left col-sm-3 wireframe">
          <div className="rooms">
            <ul className="list-group-flush col-sm-12">
              {!this.state.rooms ? null :
                this.state.rooms.map((room) => {
                return <Link onClick={this.onClickRefresh} key={room.roomId} to={`/user/${localStorage.getItem('activeUid')}/inbox/${room.roomId}`} ><li className="list-group-item clearLink">{room.listingTitle}</li></Link>
              })}
            </ul>
          </div>
        </div>
        <div className="right col-sm-9 wireframe">
          <div className="chat-messages" id="chat-messages">
            <ul className="list-group-flush col-sm-12">
              {!this.state.messages.length > 0 ? null :
                this.state.messages.map((message, i) => {
                  return <MessageEntry key={i} message={message} />
                })
              }
            </ul>
          </div>
          <div className="row chat-footer input-group">
            <input className="offset-sm-1 col-sm-8 form-control" type="text" placeholder="Message" value={this.state.message} onChange={e => this.setState({message: e.target.value})}/>
            <button className="col-sm-2 input-group-append btn-outline-dark d-flex justify-content-center" onClick={(e) => this.sendMessage(e)}>Send</button>
          </div>
        </div>
      </div>
  );
}

}

function mapStateToProps(state) {
  return {
    active_user: state.active_user,
    user_data: state.user_data
  }
}

export default connect(mapStateToProps)(Messages);
