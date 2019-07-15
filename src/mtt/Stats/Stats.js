import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';

import './Stats.css';
import './assets/washington.png';
import './assets/milano.png';

class Stats extends Component {
  computeDistance(item) {
    console.log(item);
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

  render() {
    console.log(this.props);
    return (
      <div className="Stats">
        <div className="Text">
          <h1>Un po' di numeri</h1>
          <div className="Cards">
            <div className="Card Furthest">
              <h2>Il viaggio più distante da Roma</h2>

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
              <h2>Il luogo più visitato</h2>

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
              <h2>Il giorno con più impegni</h2>

              <ol>
                {
                  this.props.charts.busiest.map(
                    (item, index) => (
                      <li key={item.date} className={item.locations[0].place.replace(/ /ig,'').toLowerCase()}>
                        {this.putImage(item.locations[0],index)}
                        <h3>{this.formatDate(item.date)}</h3>
                        <h4>{(new Intl.NumberFormat('it-IT').format(item.locations.length))} tappe per un totale di {(new Intl.NumberFormat('it-IT').format(this.computeDistance(item)))}Km<sup><small>*</small></sup></h4>
                        <ul>
                          {
                            item.locations.map(
                              location => (<li key={location.id}>{location.place}</li>)
                            )
                          }
                        </ul>
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



