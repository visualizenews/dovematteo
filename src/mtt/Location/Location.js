import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';

import colosseo from './assets/colosseo.png';
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

  fromPrevious() {
    if (this.props.location.distance.fromPrevious) {
      return (
        <div className="FromPrevious" title="Distanza dalla tappa precedente"><div className="Wrapper"><div className="Text">{(new Intl.NumberFormat('it-IT').format(Math.round(this.props.location.distance.fromPrevious/1000)))}<br />Km</div></div></div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="Location" id={this.props.location.id}>
        <div className="Info" onClick={() => this.props.centerMap(this.props.location)} title="Vedi sulla mappa">
          <h2 ><small>{moment(this.props.location.date).format('HH:mm')}</small> - {this.props.location.place}</h2>
          <p>{this.abstract(this.props.location.description)}</p>
        </div>
        {this.fromPrevious()}
        <a href={this.props.location.link} target="_facebook" title="Leggi i dettagli su Facebook">f</a>
        
        <div className="Distance">
          <img src={colosseo} alt="Colosseo"/>Roma {(new Intl.NumberFormat('it-IT').format(Math.round(this.props.location.distance.fromRome / 1000)))}Km ➜
        </div>

      </div>
    );
  }
}

export default Location;