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

import './index.css';

const ENDPOINT = 'https://whereismatteo.elezioni.io/v0/events/get';

class WhereIsMatteo extends Component {

  constructor(props) {
    super(props);
    moment.locale('it-IT');

    this.listChanged = this.listChanged.bind(this);
    this.updatedMatrix = this.updatedMatrix.bind(this);
    this.centerMap = this.centerMap.bind(this);

    let zoom = 5;
    let center = { lon: 12.5674, lat: 41.8719, };
    let interactive = false;
    let controls = false;
    const bounds = [4.5, 36, 18.5, 46.5];
    
    if (window.matchMedia('(min-width:1600px)').matches) {
      zoom = 5;
      center = { lon: 10.75, lat: 41, };
      interactive = false;
      controls = false;
    } else if (window.matchMedia('(min-width:1024px)').matches) {
      zoom = 5;
      center = { lon: 7.75, lat: 41.8719, };
      interactive = false;
      controls = false;
    } else if (window.matchMedia('(min-width:768px)').matches) {
      zoom = 5;
    }
    this.map = {
      center: center,
      controls: controls,
      interactive: interactive,
      bounds: bounds,
      scrollZoom: false,
      style: "mapbox://styles/leeppolis/cjxxcsucw1h441co56f8wechy", //"mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l",
      zoom: zoom,
    };
    this.matrix = {};
    this.keys = [];
    this.state = {
      data: [],
      days: [],
      empty: true,
      error: false,
      errorMessage: null,
      loading: true,
      matrix: {},
      points: [],
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

  listChanged(action, id) {
    if (!this.state.loading) {
      if (action === 'put' && !this.matrix[id].visible) {
        this.matrix[id].visible = true;
        //this.updatedMatrix();
      } else if (action === 'pop' && this.matrix[id].visible) {
        this.matrix[id].visible = false;
        //this.updatedMatrix();
      }
    }
  }

  updatedMatrix() {
    const points = this.state.data.filter((item) => {
      return (this.matrix[item.id].visible)
    });
    this.setState( { points, loading: false } );
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
          response.data.forEach( (point, index) => {
            this.matrix[point.id] = {
              id: point.id,
              index: index,
              visible: true,
            };
          });
          this.keys = Object.keys(this.matrix);
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
          this.setState( { data: response.data, days, error: false, empty: false }, () => this.updatedMatrix() );
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
        <div className="Core">
          <div className="MapWrapper">
            <div className="MapPosition">
              <DeckGLMap options={this.map} points={this.state.points} selectedPin={this.state.selectedPin} />
              </div>
          </div>
          <div className="ListWrapper">
            <div className="ListPosition">
              <List days={this.state.days} change={this.listChanged} centerMap={this.centerMap} />
            </div>
          </div>
        </div>
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