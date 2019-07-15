import React, { Component } from 'react';
import './Footer.css';
import VNLogo from '../assets/vn.png';

class Footer extends Component {
  render() {
    return (
        <footer className="Footer">
          <div className="Footer--wrapper">
            <div className="col">
              <h3><a href="https://visualize.news" target="_visualize"><img src={VNLogo} alt="Visualize News Logo"/> Visualize News</a></h3>
              <p>Siamo un collettivo di computational designer appassionati di data visualization.</p>
              
              <h3>Contatti</h3>
              <p>Web: <a href="https://visualize.news" target="_visualize">Visualize.News</a><br />
              Twitter: <a href="https://twitter.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Instagram: <a href="https://instagram.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Medium: <a href="https://medium.com/visualize-news" target="_medium">@visualize.news</a></p>
              <h3>Other projects</h3>
              <p><a href="https://india.visualize.news" target="_elezioni">Lok Sabha Elections</a><br />
              <a href="https://elezioni.io" target="_elezioni">Elezioni.io</a></p>
            </div>
            <div className="col">
              <h3>Copyright</h3>
              <p>&copy; {new Date().getFullYear()} <a href="https://visualize.news" target="_visualize">Visualize.News</a> &ndash; Tutti i diritti riservati. Tutte le immagini e i testi &copy; dei rispettivi proprietari. Questo sito è stato progettato, disegnato e sviluppato da <a href="https://simonelippolis.com" target="_simone">Simone Lippolis</a>.</p>
              <h3>Termini del servizio</h3>
              <p>Tutte le analisi sono fornite "as-is" ("così come sono"), senza alcuna garanzia esplicita o implicita della loro correttezza.</p>
              <h3>Privacy policy</h3>
              <p>Questo sito non salva alcun cookie, né utilizza alcun altro tipo di tecnologia di tracking. Usiamo <a href="https://www.google.com/analytics">Google Analytics</a> per soli scopi statistici. È possibile che <a href="https://www.google.com/analytics">Google Analytics</a> salvi cookies o utilizzi altre tecnologie di tracking; questi dati, in ogni caso, non sono a noi accessibili.</p>
              <p><strong>Nessun dato</strong> (inclusi IP address, Host name, Broswer signature) <strong>viene salvato, per alcun motivo, sui nostri server</strong>.</p>
            </div>
          </div>
        </footer>
    );
  }
}

export default Footer;
