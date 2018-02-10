import React from 'react';
import axios from 'axios'; 
import "babel-polyfill";
import './listings.css'

class Pictures extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {
      image: ''
    }
  }

    async componentDidMount() {
      //console.log('sup... i am listingId', this.props.listingId)
    let img = await axios.get('http://localhost:3396/api/listing/getPhoto', {
      params: {listingId: this.props.listingId}
    }); 
    //console.log('i am img...', img)
    this.setState ({
      image : img.data
    })
   }

  render() {
    return (
      <div>
        <img className="listingImage" src={this.state.image}/>
      </div>
    )
  }
}

export default Pictures;