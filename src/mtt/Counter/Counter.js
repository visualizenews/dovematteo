import React, {Component} from 'react';

import './Counter.css';
import './assets/boat.png';
import './assets/car.png';
import './assets/equator.png';

const EQUATOR = 40076;
const ITALY = 7896;
const MILAN = 574;

class Counter extends Component {
  state = {
    equator: 0,
    italy: 0,
    km: 0,
    milan: 0
  };

  componentDidUpdate(pProps) {
    if ( JSON.stringify(pProps.data) !== JSON.stringify(this.props.data) ) {
      const km = Math.round(this.props.data.reduce((acc, val) => (acc + val.distance.fromPrevious), 0) / 1000);
      const equator = Math.round(km / EQUATOR);
      const italy = Math.round(km / ITALY);
      const milan = Math.round(km / MILAN);
      this.setState({ equator, italy, km, milan});
    }
  }

  render() {
    return (
      <div className="Counter">
        <div className="Text">
          <h3>Dal <em>giorno del suo giuramento</em> davanti al Presidente della Repubblica il nostro eroe <em>ha già percorso</em> almeno</h3>
          <h1>{(new Intl.NumberFormat('it-IT').format(this.state.km))} km<sup><small>*</small></sup></h1>
          <h2>Più o meno...</h2>
          <div className="Cards">
            <div className="Card equator">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.equator))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha fatto <strong>{(new Intl.NumberFormat('it-IT').format(this.state.equator))}</strong><sup><small>*</small></sup> volte il giro del mondo</p>
            </div>
            <div className="Card boat">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.italy))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha circumnavigato <strong>{(new Intl.NumberFormat('it-IT').format(this.state.italy))}</strong><sup><small>*</small></sup> volte le coste italiane, isole comprese</p>
            </div>
            <div className="Card car">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.milan))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha percorso <strong>{(new Intl.NumberFormat('it-IT').format(this.state.milan))}</strong><sup><small>*</small></sup> volte la distanza stradale tra Milano e Roma</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Counter;