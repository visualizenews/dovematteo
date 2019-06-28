import React, {Component} from 'react';

import DeckGL, {ScatterplotLayer, MapController} from 'deck.gl';
import {StaticMap} from 'react-map-gl';
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
    if ( JSON.stringify(pProps.options) !== JSON.stringify(this.props.options) ) {
      this.draw();
    }
  }

  draw() {
    this.setState({
      mapProperties: {
        longitude: this.props.options.center[0],
        latitude: this.props.options.center[1],
        zoom: this.props.options.zoom[0]
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
    if ( this.props && this.props.options ) {
        layers = this.props.options.layers.map(
        (layer, index) => 
          new ScatterplotLayer({
            data: this.props.options.sources[index].definition.data.features,
            filled: true,
            getPosition: d => d.geometry.coordinates,
            getRadius: d => 200,
            getFillColor: d => [137, 225, 141],
            id: layer.id,
            opacity: 0.15,
            radiusMaxPixels: 10,
            radiusMinPixels: 5,
            stroked: false,
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
            controller={{ type: MapController, dragRotate: false, scrollZoom: false, dragPan: true }}
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
                onLoad={this._onMapLoad}
              />
            )}
          </DeckGL>
        </div>
      </div>
    );
  }
}

export default DeckGLMap;