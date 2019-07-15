import React, { Component } from 'react';
import './Footer.css';
import VNLogo from './Assets/vn.png';

class Footer extends Component {
  render() {
    return (
        <footer className="Footer">
          <div className="Footer--wrapper">
            <div className="col">
              <h3><a href="https://visualize.news" target="_visualize"><img src={VNLogo} alt="Visualize News Logo"/> Visualize News</a></h3>
              <p>We are a collective of computational designers in love with data visualization.</p>
              
              <h3>Contact us</h3>
              <p>Web: <a href="https://visualize.news" target="_visualize">Visualize.News</a><br />
              Twitter: <a href="https://twitter.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Medium: <a href="https://medium.com/visualize-news" target="_medium">@visualize.news</a></p>
              <h3>Other projects</h3>
              <p><a href="https://india.visualize.news" target="_elezioni">Lok Sabha Elections</a><br />
              <a href="https://elezioni.io" target="_elezioni">Elezioni.io</a></p>
            </div>
            <div className="col">
              <h3>Copyright</h3>
              <p>&copy; {new Date().getFullYear()} <a href="https://visualize.news" target="_visualize">Visualize.News</a> &ndash; All rights reserved. All images and texts &copy; of the respective owners. This site has been designed and developed by <a href="https://simonelippolis.com" target="_simone">Simone Lippolis</a> and <a href="http://www.makinguse.com/" target="_carlo">Carlo Zapponi</a>.</p>
              <h3>Terms of service</h3>
              <p>All data and analysis are provided "as-is", without any warranty, implicit or explicit, of their correctness.</p>
              <h3>Privacy policy</h3>
              <p>This website does not save any information about you. We do not directly use cookies or other tracking technologies. We do, however, use <a href="https://www.google.com/analytics">Google Analytics</a> for mere statistical reasons. It is possible that <a href="https://www.google.com/analytics">Google Analytics</a> sets cookies or uses other tracking technologies, but this data is not directly accessible by us.</p>
              <p><strong>No data</strong> (including IP address, Host name, Broswer signature) <strong>is saved for any reason on our servers</strong>.</p>
            </div>
          </div>
        </footer>
    );
  }
}

export default Footer;
