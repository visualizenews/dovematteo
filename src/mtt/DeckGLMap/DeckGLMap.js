import React, {Component} from 'react';

import DeckGL, {ScatterplotLayer, MapController, ArcLayer} from 'deck.gl';
import {StaticMap, NavigationControl} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';

import './DeckGLMap.css';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibGVlcHBvbGlzIiwiYSI6ImNpa3MzaHBtZTAwMG93N205bDA0NGJxNmsifQ.Dkw6ItpXcJjKbZBgeezEmw";
const MAPBOX_MAP_STYLE = 'mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l';

class DeckGLMap extends Component {
  constructor(props) {
    super(props);

    this.deck = null;

    this.state = {
      mapProperties: {
        longitude: 0,
        latitude: 0,
        zoom: 0
      }
    };
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(pProps) {
    /*
    if ( (!pProps.options) && (this.props.options) ) {
      this.draw();
    }
    */
  }

  draw() {
    this.setState({
      mapProperties: {
        bearing: 0,
        longitude: this.props.options.center.lon,
        latitude: this.props.options.center.lat,
        pitch: 45,
        zoom: this.props.options.zoom
      }
    });
  }

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    map.addLayer(new MapboxLayer({id: 'my-scatterplot', deck}), 'waterway-label');
  }

  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }


  render() {
    const {gl} = this.state;
    let layers = [];
    const reversed = this.props.points.slice(0).reverse();
    const arcs = [];
    reversed.forEach( (item, index) => {
      if (index < reversed.length - 1) {
        arcs.push({
          from: {
            coordinates: [ item.coordinates[0], item.coordinates[1] ],
            name: item.data.place,
            guests: item.guests,
          },
          to: {
            coordinates: [reversed[index+1].coordinates[0], reversed[index+1].coordinates[1] ],
            name: reversed[index+1].data.place,
            guests: reversed[index+1].guests,
            distance: reversed[index+1].data.distance,
          }
        });
      }
    });

    if ( this.props && this.props.points ) {

      layers = [];
      // Scatter
      layers.push(new ScatterplotLayer({
          data: this.props.points,
          filled: true,
          getPosition: d => d.coordinates,
          getRadius: d => d.guests,
          getFillColor: d => [0, 146, 65],
          id: 'scatter-points',
          opacity: .005,
          radiusMaxPixels: 10,
          radiusMinPixels: 5,
          stroked: false,
      }));
      layers.push(new ArcLayer({
        id: 'arc-layer',
        data: arcs,
        pickable: false,
        getWidth: 1,
        getSourcePosition: d => d.from.coordinates,
        getTargetPosition: d => d.to.coordinates,
        getSourceColor: d => [0, 146, 65, 150],
        getTargetColor: d => { if (d.to.distance >= 500000) return [255, 75, 100, 150]; return [0, 146, 65, 100]; },
        })
      );
    }

    return (
      <div className="Map">
        <div className="container">
          <DeckGL
            ref={ref => {
              // save a reference to the Deck instance
              this._deck = ref && ref.deck;
            }}
            layers={layers}
            controller={(this.props.options.controls) ? ({ type: MapController, dragRotate: false, scrollZoom: false, dragPan: true, doubleClickZoom: false, touchRotate: false, }) : ({type: MapController, dragRotate: false, scrollZoom: false, dragPan: false, doubleClickZoom: false, touchRotate: false})}
            initialViewState={this.state.mapProperties}
            viewState={this.state.mapProperties}
            onWebGLInitialized={this._onWebGLInitialized}
          >
            {gl && (
              <StaticMap
                ref={ref => {
                  this._map = ref && ref.getMap();
                }}
                gl={gl}
                mapStyle={MAPBOX_MAP_STYLE}
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                onLoad={this._onMapLoad}>
                <div className="mapboxgl-ctrl-top-right">
                  <NavigationControl 
                    onViewportChange={viewport => this.setState({ mapProperties: viewport })} />
                </div>
              </StaticMap>
            )}
          </DeckGL>
        </div>
      </div>
    );
  }
}

export default DeckGLMap;