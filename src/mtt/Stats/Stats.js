import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';

import './Stats.css';

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

  render() {
    console.log(this.props);
    return (
      <div className="Stats">
        <h1>Un po' di numeri</h1>
        <div className="Cards">
          <div className="Card">
            <h2>Il viaggio più distante da Roma</h2>

            <ol>
              {
                this.props.charts.furthest.map(
                  item => (
                    <li key={item.id}>
                      <h3>{item.place}</h3>
                      <h4>{(new Intl.NumberFormat('it-IT').format(Math.round(item.distance.fromRome/1000)))}Km<sup><small>*</small></sup></h4>
                    </li>
                  )
                )
              }
            </ol>
          </div>
          <div className="Card">
            <h2>Il luogo più visitato</h2>

            <ol>
              {
                this.props.charts.mostVisited.map(
                  item => (
                    <li key={item.place}>
                      <h3>{(new Intl.NumberFormat('it-IT').format(item.counter))} volte: {item.place}</h3>
                    </li>
                  )
                )
              }
            </ol>
          </div>
          <div className="Card">
            <h2>Il giorno con più impegni</h2>

            <ol>
              {
                this.props.charts.busiest.map(
                  item => (
                    <li key={item.date}>
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
    );
  }
}

export default Stats;



