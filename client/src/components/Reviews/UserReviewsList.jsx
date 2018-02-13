import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import UserReviewEntry from './UserReviewEntry';
import GivenReview from '../User/Review Categories/GivenReview';
import ReceivedReview from '../User/Review Categories/ReceivedReview';
import '../User/UserInfo.css'

class UserReviewList extends React.Component {
  render() {
    return (
      <div>
        <div className="row">
          <div className="offset-sm-2 col-sm-3 text-center">
            <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/reviews/given`}>Given</Link>
            <hr/>
          </div>
          <div className="offset-sm-1 col-sm-3 text-center">
            <Link className="clearLink" to={`/user/${localStorage.getItem('activeUid')}/reviews/received`}>Recieved</Link>
            <hr/>
          </div>
        </div>
        <Switch>
          <Route path='/user/:userId/reviews/given' component={GivenReview}/>
          <Route path='/user/:userId/reviews/received' component={ReceivedReview}/>
        </Switch>
      </div>
    )
  }
}

export default UserReviewList;