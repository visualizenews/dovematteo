import React, {Component} from 'react';
import classSet from "react-classset";

import Header from './Header/Header';
import Footer from './Footer/Footer';
import DeckGLMap from './DeckGLMap/DeckGLMap';
import Intro from './Intro/Intro';
import Counter from './Counter/Counter';
import List from './List/List';

import './index.css';

class WhereIsMatteo extends Component {
  

  constructor(props) {
    super(props);
    let zoom = 4;
    let center = { lon: 12.5674, lat: 41.8719, };
    
    if (window.matchMedia('(min-width:1024px)').matches) {
      zoom = 5;
      center = { lon: 7.75, lat: 41.8719, };
    } else if (window.matchMedia('(min-width:768px)').matches) {
      zoom = 5;
    }
    this.map = {
      center: center,
      interactive: true,
      maxZoom: (zoom + 1),
      minZoom: (zoom - 1),
      scrollZoom: false,
      style: "mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l",
      zoom: zoom,
    };
    this.state = {
      data: [],
      days: [],
      empty: true,
      error: false,
      errorMessage: null,
      loading: true,
      points: []
    }
  }

  componentDidMount() {
    this.load();
  }

  load() {
    fetch( '/data/tour.json' )
      .then( response => {
        if (response.ok && response.status === 200) {
          return response.json()
        }
        return false;
       })
      .then( data => {
        console.log(data);
        if ( data.length > 0 ) {
          // Prepare data
          const points = data.map( point => {
            return {
              coordinates: point.coords,
              people: point.people,
              data: {
                place: point.place,
                date: point.date,
                title: point.title,
                description: point.description,
              }
            }
          });
          const objDays = {};
          data.forEach( point => {
            if ( !objDays[point.date] || !Array.isArray(objDays[point.date])) {
              objDays[point.date] = [];
            }
            objDays[point.date].push(point);
          });
          const keys = Object.keys(objDays);
          const rawDays = keys.map( day => {
            return {
              date: day,
              locations: objDays[day],
            }
          });
          const days = rawDays.sort( (a,b) => (a.date > b.date ? -1 : 1) );
          this.setState( { data, days, points, error: false, loading: false, empty: false } );
        } else {
          this.setState( { error: false, loading: false, empty: true } );
        }
      })
      .catch( response => {
        console.log( response );
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
        <div className="Core">
          <div className="MapWrapper">
            <div className="MapPosition">
              <DeckGLMap options={this.map} points={this.state.points} />
              </div>
          </div>
          <div className="ListWrapper">
            <div className="ListPosition">
              <List days={this.state.days} />
            </div>
          </div>
        </div>
        <Counter data={this.state.data} />
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