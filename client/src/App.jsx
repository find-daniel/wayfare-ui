import React from 'react';
import axios from 'axios'; 
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setActiveUser } from './actions/actionCreators';
import firebase from './lib.js';
import Home from './components/LandingPage/Home';
import SearchResults from './components/Search/SearchResultPage';
import ListingPage from './components/Listings/ListingPage';
import BookingForm from './components/Listings/BookingForm';
import UserPage from "./components/User/UserPage"
import PublicUserPage from './components/User/Public User/PublicUserPage'
import CreateListingForm from './components/User/Host/CreateListingForm'
import EditUserInfo from './components/User/EditUserInfo';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import NavBar from './components/Nav/NavBar';

class App extends React.Component {
  constructor(props){
    super(props)
  }
  
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem('activeUid', user.uid)
      }
      
      setTimeout(()=>{ 
        if (user) {
        this.props.setActiveUser(user);
        axios.get('http://localhost:3396/api/users/getUser', {params: {uid: user.uid}})
          .then((data) => {
            localStorage.setItem('activeId', data.data.rows[0].id); 
          })
      } else {
        localStorage.setItem('activeUid', '');
        localStorage.setItem('activeId', ''); 
        localStorage.setItem('activeUser', ''); 
        localStorage.setItem('email', ''); 
        localStorage.setItem('accountType', ''); 
      }
    }, 1000); 
    });
  }
  
 render () {
    return (
      <Provider store={this.props.store}>
        <BrowserRouter>
          <div>
            <Route path="/" component={NavBar} />
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              {/* Pass query into search request */}
              <Route path='/search/:search' component={SearchResults} />
              {/* Setup :listingId for specific listing */}
              <Route path='/listing/book/:listingId' component={BookingForm} />
              <Route path='/listing/:listingId' component={ListingPage} />
              {/* Setup :userId for specific user */}
              <Route path='/user/public/:userId' component={PublicUserPage} />
              <Route path='/user/:userId/create-listing' component={CreateListingForm} />
              <Route path='/user/:userId/edit' component={EditUserInfo} />
              <Route path='/user/:userId' component={UserPage} />
              <Route path='/' component={Home} />
            </Switch>
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}

function mapStateToProps(state) {
  return {
    active_user: state.active_user
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({setActiveUser: setActiveUser}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);