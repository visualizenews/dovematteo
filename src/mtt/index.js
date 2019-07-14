import React, {Component} from 'react';
import classSet from "react-classset";

import moment from 'moment';
import 'moment/locale/it';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import DeckGLMap from './DeckGLMap/DeckGLMap';
import Intro from './Intro/Intro';
import Counter from './Counter/Counter';
import List from './List/List';
import Stats from './Stats/Stats';
import Disclaimer from './Disclaimer/Disclaimer';

import './index.css';

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
      data: [],
      days: [],
      empty: true,
      error: false,
      errorMessage: null,
      charts: {},
      loading: true,
      selectedPin: {}
    }
  }

  componentDidMount() {
    this.load();
  }

  centerMap(pin) {
    if (pin) {
      if (
        pin.id
        && this.state.selectedPin
        && this.state.selectedPin.id
        && pin.id === this.state.selectedPin.id) {
        this.setState({ selectedPin: null });
      } else {
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
          charts.furthest = response.data.slice(0);
          charts.furthest = charts.furthest.sort( (a,b) => (b.distance.fromRome - a.distance.fromRome) ).slice(0,10);
          const uniqueCities = [...new Set(charts.furthest.map(item => item.place))];
          console.log( uniqueCities );
          // charts.cities = 
          console.log(charts);
          this.setState( { data: response.data, days, error: false, empty: false, loading: false } );
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
        <div className="Intro-Map">
          <div className="text">
            <h1>Le Tappe</h1>
            <h3>La mappa mostra tutte le tappe del tour. Per ogni tappa, la lista mostra la distanza chilometrica dalla precedente, e quella da Roma. Cliccando sul nome di un luogo è possibile evidenziarlo sulla mappa. <em>La grandezza del Pin è proporzionale al numero di persone presenti all'evento<sup><small>*</small></sup></em>. Le linee collegano tra loro le diverse tappe.</h3>
          </div>
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
        <Stats days={this.state.days} points={this.state.data} />
        <Disclaimer />
        <Footer />
        <div className={loadingClasses}>
          Loading
        </div>
        <div className={emptyClasses}>
          Empty
        </div>
        <div className={errorClasses}>
          { this.state.errorMessage }
        </div>
      </div>
    );
  }
}

export default WhereIsMatteo;