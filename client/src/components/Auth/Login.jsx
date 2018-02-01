import React from 'react';

class Login extends React.Component {
  onSubmitHandler(e) {
    e.preventDefault();
    console.log('submitted');
    // Auth stuff here for email/password
  }

  onGoogleClickHandler(e) {
    // Google/Facebook login handled here
    console.log('clicked google');
  }

  onFacebookClickHandler(e) {
    // Google/Facebook login handled here
    console.log('clicked facebook');
  }

  render() {
    return (
      <div>
        Inside Login
        <br/>
        <button onClick={this.onGoogleClickHandler.bind(this)}>Google</button>
        <button onClick={this.onFacebookClickHandler.bind(this)}>Facebook</button>
        <hr/>
        <form action="submit" onSubmit={this.onSubmitHandler.bind(this)} >
          email:
          <input type="text" placeholder="email"/>
          password:
          <input type="text" placeholder="password"/>
          <button>Login</button>
        </form>
      </div>
    )
  }
}

export default Login;