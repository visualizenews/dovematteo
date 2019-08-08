import React, {Component} from 'react';
import classSet from "react-classset";

import moment from 'moment';
import 'moment/locale/it';
import reactGA from 'react-ga';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import DeckGLMap from './DeckGLMap/DeckGLMap';
import Intro from './Intro/Intro';
import Counter from './Counter/Counter';
import List from './List/List';
import Calendar from './Calendar/Calendar';
import Stats from './Stats/Stats';
import Disclaimer from './Disclaimer/Disclaimer';
import Control from './Control/Control';

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

reactGA.initialize('UA-137198797-4');

const ENDPOINT = 'https://whereismatteo.elezioni.io/v0/events/get';
const TIMER = 3000;

const HOLIDAYS = [
  // DDMM
  '0101',
  '0601',
  '2504',
  '0105',
  '0206',
  '1508',
  '0111',
  '0812',
  '2512',
  '2612'
];

class WhereIsMatteo extends Component {

  constructor(props) {
    super(props);
    moment.locale('it-IT');

    this.selectPin = this.selectPin.bind(this);
    this.centerMap = this.centerMap.bind(this);
    this.playPause = this.playPause.bind(this);
    this.prepareCalendar = this.prepareCalendar.bind(this);
    this.prepareCharts = this.prepareCharts.bind(this);
    this.prepareCounter = this.prepareCounter.bind(this);
    this.prepareDays =  this.prepareDays.bind(this);
    this.prepareDistance = this.prepareDistance.bind(this);
    this.prepareMap = this.prepareMap.bind(this);
    this.next = this.next.bind(this);

    this.map = {
      bounds: [4.5, 35, 18.5, 47.5]
    };
    this.data = [];

    this.timer = null;

    this.state = {
      calendar: [],
      charts: {
        busiest: [],
        furthest: [],
        mostVisited: [],
      },
      counter: {},
      days: [],
      empty: true,
      error: false,
      errorMessage: null,
      loading: true,
      map: [],
      playing: false,
      selectedPin: {},
      SelectedIndex: -1,
    }
  }

  componentDidMount() {
    this.load();
    reactGA.pageview(window.location.pathname + window.location.search);
  }

  centerMap(pin, index) {
    if (pin) {
      if (this.state.playing) {
        this.playPause(pin, index);
      } else {
        this.selectPin(pin, index);
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
        if (!response.error) {
          this.data = response.data;

          // Prepare data
          let days, charts, calendar, distance, counter, map;
          if ( this.data.map.length > 0 ) {
            // Map
            map = this.prepareMap(this.data);
            // Locations
            days = this.prepareDays(this.data);
            // Charts
            charts = this.prepareCharts(this.data, days);
            // Calendar
            calendar = this.prepareCalendar(this.data);
            // Distance
            distance = this.prepareDistance(this.data);
            // Counter
            counter = this.prepareCounter(this.data);
          }
          this.setState( { calendar, charts, counter, days, distance, error: false, empty: false, loading: false, map } );
        } else {
          this.setState( { error: false, loading: false, empty: true } );
        }
      })
      .catch( response => {
        console.error(response);
        this.setState( { error: true, errorMessage: response.toString(), loading: false, empty: false } );
      });
  }

  next() {
    const next = this.state.SelectedIndex + 1;
    if ( next < (this.state.data.map.length - 1) ) {
      this.selectPin(this.state.data.map[next], next);
      this.timer = setTimeout(
        this.next,
        TIMER
      );
    } else {
      this.setState({playing: false}, () => this.selectPin());
    }
  }

  playPause(pin, index) {
    this.setState(
      {playing:!this.state.playing},
      () => {
        if (!this.state.playing) {
          reactGA.pageview(window.location.pathname + window.location.search + '/pause');
          clearTimeout(this.timer);
          this.selectPin(pin, index);
        } else {
          reactGA.pageview(window.location.pathname + window.location.search + '/play');
          this.next();
        }
      }
    );
  }

  prepareCalendar(data) {
    const easter = function(year) {
      var a = (year / 100 | 0) * 1483 - (year / 400 | 0) * 2225 + 2613;
      var b = ((year % 19 * 3510 + (a / 25 | 0) * 319) / 330 | 0) % 29;
      var c = 148 - b - ((year * 5 / 4 | 0) + a - b) % 7;
      return moment({year: year, month: (c / 31 | 0) - 1, day: c % 31 + 1});
    }

    const checkHolidays = function(date) {
      if ( HOLIDAYS.indexOf( moment(date).format('DDMM') ) > -1 ) return true;
      let easterMonday = easter( moment(date).format('YYYY') ).add(1,'d').format('YYYYMMDD');
      if ( easterMonday === moment(date).format('YYYYMMDD') ) return true;
      return false;
    }

    const checkEvents = function(checkDate) {
      return data.filter( item => (checkDate === moment(item.date).format('YYYY-MM-DD') ) );
    }

    const calendar = [];
    const today = moment().format('YYYY-MM-DD');
    let currentDate = moment('2018-06-01').format('YYYY-MM-DD');
    const day = {
      day: null,
      month: null,
      month_label: null,
      year: null,
      date: null,
      day_of_the_week: null,
      day_of_the_week_index: null,
      holiday: false,
      weekend: false,
      events: 0
    }
    let currentDay;

    while(currentDate !== today) {
      currentDay = Object.assign({}, day);
      currentDay.day = moment(currentDate).format('D');
      currentDay.month = moment(currentDate).format('MM');
      currentDay.month_label = moment(currentDate).format('MMM');
      currentDay.year = moment(currentDate).format('YYYY');
      currentDay.date = moment(currentDate).format('YYYY-MM-DD');
      currentDay.day_of_the_week = moment(currentDate).format('dddd');
      currentDay.day_of_the_week_index = moment(currentDate).format('d');
      currentDay.holiday = checkHolidays(currentDate);
      currentDay.weekend = (moment(currentDate).format('d') === "0" || moment(currentDate).format('d') === "6") ? true : false;
      currentDay.events = checkEvents( currentDate ).length;
      calendar.push(currentDay);
      currentDate = moment(currentDate).add(1,'d').format('YYYY-MM-DD');
    }
    return calendar;
  }

  prepareCharts(data, days) {
    const charts = {};
    // Furthest
    const filterCities = [];
    charts.furthest = data.slice(0);
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
    const mostVisited = data.slice(0);
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
    return charts;
  }

  prepareCounter(data) {
    const counter = data;
    return counter;
  }

  prepareDays(data) {
    const objDays = {};
    data.forEach( point => {
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
    return rawDays.sort( (a,b) => (a.date < b.date ? 1 : -1) );
  }

  prepareDistance(data) {
    const distance = {
      month: [],
      year: [],
      total: 0
    };
    let currentDateMonth = null;
    let currentDateYear = null;
    const year = {
      year: null,
      distance_start: 0,
      distance_covered: 0
    };
    const month = {
      code: null,
      month: null,
      month_label: null,
      year: null,
      distance_start: 0,
      distance_covered: 0
    }
    let currentMonth = null;
    let currentYear = null;
    let totalDistance = 0;

    data.reverse().forEach(
      (item, index) => {
        const thisMonth = moment(item.date).format('YYYYMM');
        const thisYear = moment(item.date).format('YYYY');
        if (currentDateMonth !== thisMonth) {
          if (index > 0) distance.month.push(currentMonth);
          currentDateMonth = thisMonth;
          currentMonth = Object.assign({}, month);
          currentMonth.code = thisMonth;
          currentMonth.month = moment(item.date).format('MM');
          currentMonth.month_label = moment(item.date).format('MMM');
          currentMonth.year = moment(item.date).format('YYYY');
          currentMonth.distance_start = totalDistance;
          currentMonth.distance_covered = parseInt(item.distance.fromPrevious);
        } else {
          currentMonth.distance_covered = currentMonth.distance_covered + parseInt(item.distance.fromPrevious);
        }
        if (currentDateYear !== thisYear) {
          if (index > 0) distance.year.push(currentYear);
          currentDateYear = thisYear;
          currentYear = Object.assign({}, year);
          currentYear.year = thisYear;
          currentYear.distance_start = totalDistance;
          currentYear.distance_covered = parseInt(item.distance.fromPrevious);
        } else {
          currentYear.distance_covered = currentYear.distance_covered + parseInt(item.distance.fromPrevious);
        }
        totalDistance = totalDistance + parseInt(item.distance.fromPrevious);
      }
    )
    distance.month.push(currentMonth);
    distance.year.push(currentYear);
    distance.total = totalDistance;
    // console.log(distance);
    return distance;
  }

  prepareMap(data) {
    const map = data;
    return map;
  }

  selectPin(pin, index) {
    if (
      (pin === undefined)
      || (
        pin
        && pin.id
        && this.state.selectedPin
        && this.state.selectedPin.id
        && pin.id === this.state.selectedPin.id
      )
    ) {
        reactGA.pageview(window.location.pathname + window.location.search);
      this.setState({ selectedPin: null });
    } else {
      reactGA.pageview(window.location.pathname + window.location.search + '/event/' + pin.id + '/' + pin.place);
      this.setState({ selectedPin: pin, SelectedIndex: index});
    }
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
        <Counter data={this.state.counter} />
        <div className="Text">
          <h1>Le Tappe</h1>
          <p>La mappa mostra tutte le tappe del tour. Per ogni tappa, la lista mostra sia la distanza chilometrica dalla precedente, sia quella da Roma. Cliccando sul nome di un luogo è possibile evidenziarlo sulla mappa. <em>La grandezza del Pin è proporzionale al numero di persone presenti all'evento<sup><small>*</small></sup></em>. Le linee collegano tra loro le diverse tappe.</p>
        </div>
        <div className="Core">
          <div className="MapWrapper">
            <div className="MapPosition">
              <DeckGLMap options={this.map} points={this.state.map} selectedPin={this.state.selectedPin} />
            </div>
          </div>
          <div className="ListWrapper">
            <div className="ListPosition">
              <List days={this.state.days} change={this.listChanged} centerMap={this.centerMap} selectedPin={this.state.selectedPin} index={this.state.SelectedIndex} />
            </div>
          </div>
          <div className="MapMask"></div>
          <Control selectedPin={this.state.selectedPin} isPlaying={this.state.playing} playPause={this.playPause} />
        </div>
        <Stats charts={this.state.charts} />
        <Calendar data={this.state.calendar} />
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