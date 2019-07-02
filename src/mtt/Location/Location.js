import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';

import './Location.css';

class Location extends Component {
  componentDidMount() {
    moment.locale('it-IT');
  }

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
        <h2>[{moment(this.props.location.date).format('HH:mm')}] {this.props.location.place}</h2>
        <div className="Distance">
          { this.progress() }
        </div>
        <p>{this.props.location.description}</p>
        {this.fromPrevious()}
      </div>
    );
  }
}

export default Location;