import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import UserReviewEntry from './UserReviewEntry';
import GivenReview from '../User/Review Categories/GivenReview';
import ReceivedReview from '../User/Review Categories/ReceivedReview';

class UserReviewList extends React.Component {
  render() {
    return (
      <div>
        <Link to={`/user/${localStorage.getItem('activeUid')}/reviews/given`}>Given</Link>
        <Link to={`/user/${localStorage.getItem('activeUid')}/reviews/received`}>Recieved</Link>
        <Switch>
          <Route path='/user/:userId/reviews/given' component={GivenReview}/>
          <Route path='/user/:userId/reviews/received' component={ReceivedReview}/>
        </Switch>
      </div>
    )
  }
}

export default UserReviewList;