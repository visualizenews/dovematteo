import React, {Component} from 'react';

import './Location.css';

class Location extends Component {

  progress() {
    const dist = parseInt(this.props.maxDistance, 10);
    if ( !Number.isNaN(dist) && dist !== 0 ) {
      const perc = Math.round( (100 * this.props.location.distance.fromRome) / dist );
      return (
        <div className="Progress" style={{width:perc+'%'}}>
          <div className="Label">🏛{this.props.location.distance.fromRome}Km</div>
        </div>
      )
    }
    return null;
  }

  fromPrevious() {
    if (this.props.location.distance.fromPrevious) {
      return (
        <div className="FromPrevious">{this.props.location.distance.fromPrevious}Km</div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="Location" >
        <h2>{this.props.location.place}</h2>
        <div className="Distance">
          { this.progress() }
        </div>
        <h1>{this.props.location.title}</h1>
        <p>{this.props.location.description}</p>
        {this.fromPrevious()}
      </div>
    );
  }
}

export default Location;