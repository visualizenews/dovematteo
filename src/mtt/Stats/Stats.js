import React, {Component} from 'react';

import './Stats.css';

class Stats extends Component {
  render() {
    return (
      <div className="Stats">
        <ol>
          <li>Il viaggio piu' lontano</li>
          <li>La citta' piu' visitata</li>
          <li>Il giorno con piu' impegni</li>
        </ol>
      </div>
    );
  }
}

export default Stats;



