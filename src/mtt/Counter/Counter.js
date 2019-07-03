import React, {Component} from 'react';

import './Counter.css';

class Counter extends Component {
  state = {
    km: 0,
  };

  componentDidUpdate(pProps) {
    if ( JSON.stringify(pProps.data) !== JSON.stringify(this.props.data) ) {
      this.setState({ km: Math.round(this.props.data.reduce((acc, val) => (acc + val.distance.fromPrevious), 0) / 1000) });
    }
  }

  render() {
    return (
      <div className="Counter">
        <div className="text">
          <h3>Dal <em>giorno del suo giuramento</em> davanti al Presidente della Repubblica il nostro eroe <em>ha già percorso</em> almeno</h3>
          <h1>{(new Intl.NumberFormat('it-IT').format(this.state.km))} km<sup><small>*</small></sup></h1>
        </div>
      </div>
    );
  }
}

export default Counter;