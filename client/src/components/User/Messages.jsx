import React from 'react';
import 'babel-polyfill';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'; 
import io from 'socket.io-client';
import { setActiveUser } from '../../actions/actionCreators';
import axios from 'axios';

class Messages extends React.Component {
  constructor() {
    super()
    this.state = {
      socket: null,
      author: null,
      messages: [],
      room: null
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
    e.preventDefault();
    this.setState({message: this.state.messages})
    this.state.socket.emit('client.message', {
      author: this.props.active_user.displayName,
      authorImage: this.props.active_user.photoURL,
      message: this.state.message,
      room: this.state.room
    })
  }


  render() {
    return (
      <div className="container">
      <div>
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
      </div>  
      <div className="card">
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
  );
}

}

function mapStateToProps(state) {
  return {
    active_user: state.active_user
  }
}

export default connect(mapStateToProps)(Messages);
