import React, {Component} from 'react';

import './Header.css';

class Header extends Component {
  render() {
    return (
      <header className="Header">
        <div className="title">
          <h1>Matteo,<br  />
            dove sei?</h1>
        </div>
      </header>
    );
  }
}

export default Header;