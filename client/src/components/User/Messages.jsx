import React from 'react';
import io from 'socket.io-client';

class Messages extends React.Component {
  constructor() {
    super()
    this.state = {
      socket: null,
      message: '',
      author: null,
      message: null,
      room: null
    }
  }

  componentWillMount() {
    this.socket = io('http://localhost:4155', {
      query: {
        roomId: location.pathname.slice(1)
      }
    });
    console.log('socket', this.socket)
    this.setState({ socket: this.socket });
  }

  sendMessage(e) {
    e.preventDefault();
    this.setState({message: ''})
    console.log('message sent!')
    this.socket.emit('client.message', {
      author: 'eric',
      message: this.message,
      room: 'room2'
    })
  }


  render() {
    return (
      <div className="container">
          <div className="row">
              <div className="col-4">
                  <div className="card">
                      <div className="card-body">
                          <div className="card-title">Chat</div>
                          <hr/>
                          <div className="messages">

                          </div>
                          <div className="footer">
                              <br/>
                              <input type="text" placeholder="Message" className="form-control" value={this.state.message} onChange={e => this.setState({message: e.target.value})}/>
                              <br/>
                              <button className="btn btn-primary form-control" onClick={(e) => this.sendMessage(e)}>Send</button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );
}

}

export default Messages;


//                              <input type="text" placeholder="Username" value={this.state.username} onChange={ev => this.setState({username: ev.target.value})} className="form-control"/>
