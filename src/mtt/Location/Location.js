import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';

import './Location.css';

class Location extends Component {
  componentDidMount() {
    moment.locale('it-IT');
  }

  abstract(text) {
    const words = text.split(' ');
    if (words.length <= 8) return text;
    const abstract = words.splice(0, 8);
    return abstract.join(' ') + '…';
  }

  progress() {
    const dist = parseInt(this.props.maxDistance, 10);
    if ( !Number.isNaN(dist) && dist !== 0 ) {
      const perc = Math.round( (100 * this.props.location.distance.fromRome) / dist );
      return (
        <div className="Progress" style={{width:perc+'%'}}>
          <div className="Label">🏛{Math.round(this.props.location.distance.fromRome / 1000)}Km</div>
        </div>
      )
    }
    return null;
  }

  fromPrevious() {
    if (this.props.location.distance.fromPrevious) {
      return (
        <div className="FromPrevious">{Math.round(this.props.location.distance.fromPrevious/1000)}Km</div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="Location" >
        <h2><a href={this.props.location.link} target="_facebook"><small>{moment(this.props.location.date).format('HH:mm')}</small> - {this.props.location.place}</a></h2>
        <div className="Distance">
          { this.progress() }
        </div>
        <p><a href={this.props.location.link} target="_facebook">{this.abstract(this.props.location.description)}</a></p>
        {this.fromPrevious()}
      </div>
    );
  }
}

export default Location;