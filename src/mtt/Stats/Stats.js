import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';

import './Stats.css';
import './assets/washington.png';
import './assets/milano.png';
import './assets/bassano.png';

class Stats extends Component {
  computeDistance(item) {
    return Math.round(item.locations.reduce(
        (accumulator, location, index) => (index < (item.locations.length-1)) ? (accumulator + location.distance.fromPrevious) : (accumulator), 0
      ) / 1000);
  }

  formatDate(day) {
    return moment(day).format('LL');
  }

  putImage(item,index) {
    if (index === 0) {
      return (<div className="image"></div>);
    }
    return false;
  }

  putList(locations) {
    let output = '';
    locations.forEach(
      (location, index) => {
        output += this.createLink(location.link, location.place);
        if (index < (locations.length - 1)) {
          output += ', ';
        }
      }
    );
    return output;
  }

  createLink(link, label) {
    return <a href={link} target="_facebook">{label}</a>
  }

  render() {
    return (
      <div className="Stats">
        <div className="Text">
          <h1>Un po' di numeri</h1>
          <div className="Cards">
            <div className="Card Furthest">
              <h2>I viaggi più lunghi</h2>

              <ol>
                {
                  this.props.charts.furthest.map(
                    (item, index) => (
                      <li key={item.id} className={item.place.replace(/ /ig,'').toLowerCase()}>
                        {this.putImage(item,index)}
                        <h3>{item.place}</h3>
                        <h4>{(new Intl.NumberFormat('it-IT').format(Math.round(item.distance.fromRome/1000)))}Km<sup><small>*</small></sup></h4>
                      </li>
                    )
                  )
                }
              </ol>
            </div>
            <div className="Card MostVisited">
              <h2>I luoghi più visitati</h2>

              <ol>
                {
                  this.props.charts.mostVisited.map(
                    (item, index) => (
                      <li key={item.place} className={item.place.replace(/ /ig,'').toLowerCase()}>
                        {this.putImage(item,index)}
                        <h3>{item.place}</h3>
                        <h4>{(new Intl.NumberFormat('it-IT').format(item.counter))} volte</h4>
                      </li>
                    )
                  )
                }
              </ol>
            </div>
            <div className="Card Busiest">
              <h2>I giorni più impegnativi</h2>

              <ol>
                {
                  this.props.charts.busiest.map(
                    (item, index) => (
                      <li key={item.date} className={item.locations[0].place.replace(/ /ig,'').toLowerCase()}>
                        {this.putImage(item.locations[0],index)}
                        <h3>{this.formatDate(item.date)}</h3>
                        <h4>{(new Intl.NumberFormat('it-IT').format(item.locations.length))} tappe per un totale di {(new Intl.NumberFormat('it-IT').format(this.computeDistance(item)))}Km<sup><small>*</small></sup>: <Links links={item.locations} /></h4>
                      </li>
                    )
                  )
                }
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Stats;


class Links extends Component {
  render() {
    return (
      <span>
      {
        this.props.links.map(
          (location, index) => (
            <span key={location.id}>
              <a href={location.link} target="_facebook">{location.place}</a>
              {(index < this.props.links.length-1) ? ', ' : '' }
            </span>
          )
        )
      }
      </span>
    )
  }
}