import React, {Component} from 'react';

import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <div className="title">
          <h1>Matteo</h1>
          <h2>In Tour</h2>
        </div>
      </header>
    );
  }
}

export default Header;