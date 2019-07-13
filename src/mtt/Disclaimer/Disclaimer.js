import React, {Component} from 'react';

import './Disclaimer.css';

class Disclaimer extends Component {
  render() {
    return (
      <div className="Disclaimer">
        <ol>
          <li>Come sono calcolate le distanze</li>
          <li>Dove prendiamo i dati</li>
          <li>Che tecnologia usiamo</li>
          <li>Vedi degli errori?</li>
        </ol>
      </div>
    );
  }
}

export default Disclaimer;



