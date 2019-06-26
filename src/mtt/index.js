import React, {Component} from 'react';
import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import classSet from "react-classset";
import './index.css';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoibGVlcHBvbGlzIiwiYSI6ImNpa3MzaHBtZTAwMG93N205bDA0NGJxNmsifQ.Dkw6ItpXcJjKbZBgeezEmw"
});

class WhereIsMatteo extends Component {
  

  constructor(props) {
    super(props);

    this.map = {
      boundaries: [ [ 4, 30 ], [ 24, 50 ] ],
      center: [ 42.6, 12.6 ],
      point: {
        'circle-stroke-width': 0,
        'circle-radius': 10,
        'circle-blur': 0.15,
        'circle-color': 'rgba(137,255,141,.25)',
      },
      style: {
        height: '100%',
        width: '100%'
      },
      zoom: [ 1 ],
    };

    this.state = {
      data: [],
      empty: true,
      error: false,
      loading: true
    }
  }

  componentDidMount() {
    this.load();
  }

  load() {
    fetch( '/data/tour.json' )
      .then( response => {
        console.log( response );
        if (response.ok && response.status === 200) {
          return response.json()
        }
        return false;
       })
      .then( data => {
        console.log( data );
        if ( data.length > 0 ) {
          this.setState( { data, error: false, loading: false, empty: false } );
        } else {
          this.setState( { error: false, loading: false, empty: true } );
        }
      })
      .catch( response => {
        console.log( response );
        this.setState( { error: true, loading: false, empty: false } );
      });
  }

  pointClicked(point) {
    alert(point.title);
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

    console.log( this.state.data );

    return (
      <div className="WhereIsMatteo">
        <div className="MapContainer">
          <Map
            center={this.map.center}
            style="mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l"
            containerStyle={this.map.style}
            maxBounds={this.map.boundaries}
            zoom={this.map.zoom}>
            <Layer
              type="circle"
              id="marker"
              paint={this.map.point} >
              {
                this.state.data.map((point, index) => (
                    <Feature
                      key={index}
                      coordinates={point.coords}
                      onClick={() => this.pointClicked(point)} />
                  )
                )
              }
            </Layer>
          </Map>
        </div>
        <div className={loadingClasses}>
          Loading
        </div>
        <div className={emptyClasses}>
          Empty
        </div>
        <div className={errorClasses}>
          Error
        </div>
      </div>
    );
  }
}

export default WhereIsMatteo;