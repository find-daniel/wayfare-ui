import React from 'react';
import 'babel-polyfill';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import io from 'socket.io-client';
import { setActiveUser } from '../../actions/actionCreators';
import axios from 'axios';
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
      message: ''
    }
    this.sendMessage = this.sendMessage.bind(this);
  }

  async componentWillMount  () {
    const socket = io('http://localhost:4155', {
      query: {
        roomId: location.pathname.slice(1)
      }
    });   
    this.setState({ socket: socket, room: location.pathname.slice(1) });

    try {
       const data = await axios.get(`http://localhost:4155/api/chat/getMessages`)
        this.setState({
          messages: data.data
        })
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
      try {
        const lastmessage = await axios.get('http://localhost:4155/api/chat/getLastMessage')
         this.setState({
          messages: [...this.state.messages, lastmessage.data[0]]
        })
      }
      catch (err) {
        console.log('couldnt get last message', err)
      }
    })
  }

  sendMessage(e) {
    console.log(
      this.props
    )

    e.preventDefault();

    this.setState({message: this.state.messages})

    // by the time this component is loaded, information about the guest and the host
    // will already be on this.state. no need to grab anything from localStorage or redux.

    this.state.socket.emit('client.message', {
      guestName: this.props.active_user.displayName || 'i need a name',
      guestImage: this.props.active_user.photoURL,
      message: this.state.message,
      room: this.state.room
    })

    this.setState({
      message: ''
    })
  }


  render() {
    return (
      <div className="row chat">
        <div className="left col-sm-3 wireframe">
          <div className="rooms">
            <ul className="list-group">
              <li className="list-group-item"> this will be a room </li>
            </ul>
          </div>
        </div>
        <div className="right col-sm-9 wireframe">
          <div className="chat-messages wireframe">
            <ul>
              <li>these will be messages</li>
              <li>these will be messages</li>
              <li>these will be messages</li>
            </ul>
          </div>
          <div className="row chat-footer input-group">
            <input className="offset-sm-1 col-sm-8 form-control" type="text" placeholder="Message" value={this.state.message} onChange={e => this.setState({message: e.target.value})}/>
            <button className="col-sm-2 input-group-append" onClick={(e) => this.sendMessage(e)}>Send</button>
          </div>
        </div>
        {/* Mapping through messages */}
        {/* <div>
          {this.state.messages.length > 0
          ?
          this.state.messages.map((message, i) => {
            return (<div key={i}>
              <li>
              <img src={message.authorImage} />
              <span>({message.author}) : {message.message} </span>
              </li>
            </div>)
          })
          :
          null
          }
        </div>   */}  
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
