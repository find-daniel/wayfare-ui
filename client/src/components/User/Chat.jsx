import React from 'react';
import io from 'socket.io-client/dist/socket.io.js';
import axios from 'axios';

class Chat extends React.Component {
  constructor() {
    this.state = {
      author: null,
      message: null,
      room: null
    }
  }

  componentDidMount(){
    socket.on('message', ({ author, message, room }) => {
      this.setState({
        author: author,
        message: message,
        room: room
      })
    })
  }

  send() {
    
  }

  render() {
    return (<div>
    
    </div>)
  }
}