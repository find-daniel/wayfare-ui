import React from 'react';
import io from 'socket.io-client';

class Messages extends React.Component {
  // state = {
  //   socket: null
  // }

  componentWillMount() {
    this.socket = io('http://localhost/4155', {
      query: {
        roomId: this.props.location.pathname.slice(1)
      }
    });
    this.setState({ socket: this.socket })
  }

  render() {
    return (
      <div>
        <h3> Inside Messages </h3>
      </div>
    )
  }
}

export default Messages;


//