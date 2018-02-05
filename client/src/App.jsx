import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Provider, connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { activeUser } from './actions/actionCreators';

import Home from './components/LandingPage/Home';
import SearchResults from './components/Search/SearchResultPage';
import ListingPage from './components/Listings/ListingPage';
import BookingForm from './components/Listings/BookingForm';
import UserPage from "./components/User/UserPage"
import CreateListingForm from './components/User/Host/CreateListingForm'
import EditUserInfo from './components/User/EditUserInfo';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import NavBar from './components/Nav/NavBar';
import firebase from './lib';

class App extends React.Component {
  constructor(props){
    super(props)
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.activeUser(user);
        console.log('activeuserrr', this.props.active_user)
      } 
    })
  }
  
 render () 
  {return (
    <Provider store={this.props.store}>
      <BrowserRouter>
        <div>
          <Route path="/" component={NavBar} />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={SignUp} />
            {/* Pass query into search request */}
            <Route path='/search/:query' component={SearchResults} />
            {/* Setup :listingId for specific listing */}
            <Route path='/listing/book/:listingId' component={BookingForm} />
            <Route path='/listing/:listingId' component={ListingPage} />
            {/* Setup :userId for specific user */}
            <Route path='/user/:userId/create-listing' component={CreateListingForm} />
            <Route path='/user/:userId/edit' component={EditUserInfo} />
            <Route path='/user/:userId' component={UserPage} />
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  )}
}

function mapStateToProps(state) {
  return {
    active_user: state.active_user
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({activeUser: activeUser}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(App);