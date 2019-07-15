import React, {Component} from 'react';
import classSet from "react-classset";

import moment from 'moment';
import 'moment/locale/it';
import ReactGA from 'react-ga';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import DeckGLMap from './DeckGLMap/DeckGLMap';
import Intro from './Intro/Intro';
import Counter from './Counter/Counter';
import List from './List/List';
import Stats from './Stats/Stats';
import Disclaimer from './Disclaimer/Disclaimer';

import './assets/boat.png';
import './assets/car.png';
import './assets/equator.png';
import './assets/forrest.png';
import './assets/lemans.png';
import './assets/washington.png';
import './assets/milano.png';
import './assets/bassano.png';
import './assets/genova.png';
import './assets/roma.png';

import './index.css';

ReactGA.initialize('UA-137198797-4');

const ENDPOINT = 'https://whereismatteo.elezioni.io/v0/events/get';

class WhereIsMatteo extends Component {

  constructor(props) {
    super(props);
    moment.locale('it-IT');

    this.centerMap = this.centerMap.bind(this);

    this.map = {
      bounds: [4.5, 35, 18.5, 47.5]
    };

    this.state = {
      charts: {
        busiest: [],
        furthest: [],
        mostVisited: [],
      },
      data: [],
      days: [],
      empty: true,
      error: false,
      errorMessage: null,
      loading: true,
      selectedPin: {}
    }
  }

  componentDidMount() {
    this.load();
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  centerMap(pin) {
    if (pin) {
      if (
        pin.id
        && this.state.selectedPin
        && this.state.selectedPin.id
        && pin.id === this.state.selectedPin.id) {
          ReactGA.pageview(window.location.pathname + window.location.search);
        this.setState({ selectedPin: null });
      } else {
        ReactGA.pageview(window.location.pathname + window.location.search + '/event/' + pin.id + '/' + pin.place);
        this.setState({ selectedPin: pin});
      }
    }
  }

  load() {
    fetch( ENDPOINT )
      .then( response => {
        if (response.ok && response.status === 200) {
          return response.json()
        }
        return false;
       })
      .then( response => {
        if ( response.data.length > 0 ) {
          // Prepare data
          // Days
          const objDays = {};
          response.data.forEach( point => {
            const datekey = moment(point.date).format('YYYYMMDD');
            if ( !objDays[datekey] || !Array.isArray(objDays[datekey])) {
              objDays[datekey] = [];
            }
            if (point.coords.length === 2 && point.coords[0] !== 0 && point.coords[1] !== 0) {
              objDays[datekey].push(point);
            }
          });
          const datekeys = Object.keys(objDays);
          const rawDays = datekeys.map( day => {
            return {
              date: day,
              locations: objDays[day],
            }
          });
          const days = rawDays.sort( (a,b) => (a.timestamp > b.timestamp ? 1 : -1) );
          // Charts
          const charts = {};
          // Furthest
          const filterCities = [];
          charts.furthest = response.data.slice(0);
          charts.furthest = charts.furthest.sort(
              (a,b) => (b.distance.fromRome - a.distance.fromRome)
            ).slice(0,15).filter(
              (item) => {
                if (filterCities.indexOf(item.place) < 0) {
                  filterCities.push(item.place);
                  return true;
                }
                return false;
              }
            ).slice(0,3);
          // Most visited
          const mostVisited = response.data.slice(0);
          const uniqueCities = [...new Set(mostVisited.map(item => item.place))];
          charts.mostVisited = uniqueCities.map( item => ({ place: item, counter: 0 }) );
          const mostVisitedMap = {};
          uniqueCities.forEach( (item, index) => {
            return (mostVisitedMap[item] = index);
          });
          mostVisited.forEach( item => {
            charts.mostVisited[mostVisitedMap[item.place]].counter++;
          });
          charts.mostVisited = charts.mostVisited.sort( (a,b) => (b.counter - a.counter) ).slice(0,3);
          // Most busy
          charts.busiest = days.slice(0);
          charts.busiest = charts.busiest.sort( (a, b) => (b.locations.length - a.locations.length) ).slice(0, 3);
          this.setState( { charts, data: response.data, days, error: false, empty: false, loading: false } );
        } else {
          this.setState( { error: false, loading: false, empty: true } );
        }
      })
      .catch( response => {
        this.setState( { error: true, errorMessage: response.toString(), loading: false, empty: false } );
      });
  }

  render() {
    let loadingClasses = classSet({
      'loading': true,
      'is-visible': this.state.loading
    });

    let emptyClasses = classSet({
      'empty': true,
      'is-visible': this.state.empty
    });

    let errorClasses = classSet({
      'error': true,
      'is-visible': this.state.error
    });

    return (
      <div className="WhereIsMatteo">
        <Header />
        <Intro />
        <Counter data={this.state.data} />
        <div className="Text">
          <h1>Le Tappe</h1>
          <h3>La mappa mostra tutte le tappe del tour. Per ogni tappa, la lista mostra sia la distanza chilometrica dalla precedente, sia quella da Roma. Cliccando sul nome di un luogo è possibile evidenziarlo sulla mappa. <em>La grandezza del Pin è proporzionale al numero di persone presenti all'evento<sup><small>*</small></sup></em>. Le linee collegano tra loro le diverse tappe.</h3>
        </div>
        <div className="Core">
          <div className="MapWrapper">
            <div className="MapPosition">
              <DeckGLMap options={this.map} points={this.state.data} selectedPin={this.state.selectedPin} />
              </div>
          </div>
          <div className="ListWrapper">
            <div className="ListPosition">
              <List days={this.state.days} change={this.listChanged} centerMap={this.centerMap} selectedPin={this.state.selectedPin} />
            </div>
          </div>
        </div>
        <Stats charts={this.state.charts} />
        <Disclaimer />
        <Footer />
        <div className={loadingClasses}>
          <svg viewBox="0 0 436 395">
            <g stroke="none" fill="none">
              <g transform="translate(-40.000000, -58.000000)" stroke="#55a1ff">
                <polygon id="V-Line" points="150.365234 251.410156 40.6835937 251.410156 89.2675781 58.9550781 250.337891 58.9550781 363.109375 452.166016 475.470703 201.083984 320.097656 201.083984 213.667969 452.166016 89.2675781 58.9550781"></polygon>
              </g>
            </g>
          </svg>
        </div>
        <div className={emptyClasses}>
          <div>
            <h1>Errore!</h1>
            <p>Non sono riuscito a caricare i dati, riprova più tardi!</p>
            <hr />
            <p>Web: <a href="https://visualize.news" target="_visualize">Visualize.News</a><br />
              Twitter: <a href="https://twitter.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Instagram: <a href="https://instagram.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Medium: <a href="https://medium.com/visualize-news" target="_medium">@visualize.news</a></p>
          </div>
        </div>
        <div className={errorClasses}>
          <div>
            <h1>Errore!</h1>
            <p>{ this.state.errorMessage }</p>
            <hr />
            <p>Web: <a href="https://visualize.news" target="_visualize">Visualize.News</a><br />
              Twitter: <a href="https://twitter.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Instagram: <a href="https://instagram.com/visualizenews" target="_twitter">@visualizenews</a><br />
              Medium: <a href="https://medium.com/visualize-news" target="_medium">@visualize.news</a></p>
          </div>
        </div>
      </div>
    );
  }
}

export default WhereIsMatteo;