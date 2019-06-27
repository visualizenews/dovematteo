import React, {Component} from 'react';
import classSet from "react-classset";

import Header from './Header/Header';
import Footer from './Footer/Footer';
import Map from './Map/Map';
import Intro from './Intro/Intro';
import List from './List/List';

import './index.css';

class WhereIsMatteo extends Component {
  

  constructor(props) {
    super(props);
    let zoom = 4;
    if (window.matchMedia('(min-width:1024px)').matches) {
      zoom = 4;
    }
    this.map = {
      center: [ 12.5674, 41.8719 ],
      controls: {
        position: 'bottom-right',
        zoom: true,
        compass: false,
      },
      css: {
        height: "100%",
        width: "100%"
      },
      fitBounds: [ [ 4, 35.5 ], [ 22, 47.5 ] ],
      interactive: true,
      layers: [
        {
          "id": "marker",
          "paint": {
            "circle-stroke-width": 0,
            "circle-radius": 10,
            "circle-blur": 0.15,
            "circle-color": "rgba(137,225,141,.25)",
          },
          "source": "points",
          "type": "circle",
        }
      ],
      maxBounds: [ [ 4, 35.5 ], [ 22, 47.5 ] ],
      maxZoom: (zoom + 1),
      minZoom: (zoom - 1),
      scrollZoom: false,
      sources: [{
        "id": "points",
        "definition": {
          "type": "geojson",
          "data": {
            "type": "FeatureCollection",
            "features": []
          }
        }
      }],
      style: "mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l",
      zoom: [ zoom ],
    };
    this.state = {
      data: [],
      days: [],
      empty: true,
      error: false,
      errorMessage: null,
      loading: true
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
        if ( data.length > 0 ) {
          // Prepare data
          const features = data.map( point => {
            return {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: point.coords,
                data: {
                  place: point.place,
                  date: point.date,
                  title: point.title,
                  description: point.description,
                }
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

          console.log(objDays);
          
          const keys = Object.keys(objDays);
          const rawDays = keys.map( day => {
            return {
              date: day,
              locations: objDays[day],
            }
          });
          const days = rawDays.sort( (a,b) => (a.date > b.date ? -1 : 1) );


          console.log( days );
          this.map.sources[0].definition.data.features = features.slice(0);
          this.setState( { data, days, error: false, loading: false, empty: false } );
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
              <Map options={this.map} />
              </div>
          </div>
          <div className="ListWrapper">
            <div className="ListPosition">
              <List days={this.state.days} />
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