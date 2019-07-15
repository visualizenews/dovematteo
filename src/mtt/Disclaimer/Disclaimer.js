import React, {Component} from 'react';

import './Disclaimer.css';

class Disclaimer extends Component {
  render() {
    return (
      <div className="Disclaimer">
        <div className="Text">
          <h1><sup><small>*</small></sup>Note</h1>
          <p>I chilometri totali percorsi sono calcolati basandosi su una assunzione che <em>sicuramente</em> non rappresenta in maniera completa ed esaustiva i viaggio compiuti dal Ministro. Usiamo la <a href="https://www.facebook.com/salviniofficial/" target="_facebook">pagina ufficiale di Matteo Salvini su Facebook</a> per tenere traccia dei suoi impegni pubblici. La distanza totale percorsa è calcolata sommando la distanza stradale (ottenuta da <a href="https://maps.google.com" target="_google">Google Maps</a>) tra una tappa e la precedente. Ovviamente questo metodo non tiene conto di tutti gli spostamenti istituzionali non pubblici, di quelli personali, o dei rientri dopo apparizioni pubbliche verso Roma, ma è comunque un indicatore di quanto il Ministro viaggi. Crediamo che i chilometri <em>davvero percorsi</em> negli ultimi anni siano ben superiori alla nostra stima.</p>
          <p>Le distanze tra ogni tappa e Roma e tra ogni tappa e la precedente sono, come detto, calcolate utilizzando <a href="https://maps.google.com" target="_google">Google Maps</a>. Eventuali differenze chilometriche tra due località visitate in tempi differenti sono dovute al fatto che la geolocalizzazione e il calcolo delle distanze sono basate sull'effettivo indirizzo a cui l'evento è avvenuto, e che le condizioni stradali potrebbero essere cambiate tra la data di un evento e le successive.</p>
          <p>Nella mappa è citato il fatto che <em>la grandezza dei Pin è proporzionale al numero di persone presenti</em>: anche questo dato non è verificabile. Per calcolarlo, ci basiamo sul numero di persone che hanno risposto "ci sarò" all'evento su Facebook. Riteniamo quindi che il numero di effettivi partecipanti a ogni evento sia superiore a quello in nostro possesso; ritenitamo altresì che il numero ottenuto da Facebook, pur non essendo verificabile in termini assoluti, sia comunque utile per mostrare una relazione tra eventi, ed è questo il motivo per cui i numeri non vengono mostrati (<em>sono comunque presenti e accessibili a chiunque sulla pagina Facebook dell'evento</em>).</p>
          <p>Le <em>distanze chilometriche utilizzate per illustrare a che distanza i chilometri percorsi dal Ministro corrispondano</em> sono stati calcolati in questo modo:</p>
          <ul>
            <li><em>La circonferenza della terra all'altezza dell'equatore</em>: 40.075Km (<a href="https://it.wikipedia.org/wiki/Equatore" target="_source">fonte</a>)</li>
            <li><em>La quantità di chilometri corsi da Forrest Gump</em>: 24.539Km (<a href="https://movies.stackexchange.com/questions/92091/how-far-did-forrest-gump-run" target="_source">fonte</a>)</li>
            <li><em>La lunghezza delle coste italiane</em>: 7.458Km (<a href="https://it.wikipedia.org/wiki/Coste_italiane" target="_source">fonte</a>)</li>
            <li><em>La distanza in auto tra Milano e Roma</em>: 573Km (<a href="https://www.google.com/maps/dir/Milano,+Citt%C3%A0+Metropolitana+di+Milano/Roma,+Citt%C3%A0+Metropolitana+di+Roma/@43.6571507,8.6593138,7z/data=!3m1!4b1!4m14!4m13!1m5!1m1!1s0x4786c1493f1275e7:0x3cffcd13c6740e8d!2m2!1d9.189982!2d45.4642035!1m5!1m1!1s0x132f6196f9928ebb:0xb90f770693656e38!2m2!1d12.4963655!2d41.9027835!3e0" target="_source">fonte</a>)</li>
          </ul>
          <h1>Disclaimer</h1>
          <p>Leggendo i giornali abbiamo notato che Matteo Salvini viaggia molto in tutto il Paese. Con questo sito abbiamo voluto quantificare quel "molto" e abbiamo voluto provare a quantificare visualmente i numeri che siamo riusciti a ottenere. Questo sito ha un intento giocoso, e non vuole in alcun modo esprimere giudizi politici sul Ministro dell'Interno; crediamo che ciascuno debba formarsi una propria opinione autonomamente, utilizzando le fonti che preferisce.</p>
          <p>Se vuoi contattarci puoi farlo utilizzando <a href="https://twitter.com/visualizenews" target="_social">Twitter</a> o <a href="https://www.instagram.com/visualizenews/" target="_social">Instagram</a>. Se hai notato degli errori nei dati, scrivici all'indirizzo email <a href="mailto:tour@elezioni.io">tour@elezioni.io</a>.</p>
        </div>
      </div>
    );
  }
}

export default Disclaimer;



