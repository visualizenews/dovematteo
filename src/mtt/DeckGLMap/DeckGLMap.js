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

    this.draw = this.draw.bind(this);
    this._onMapLoad = this._onMapLoad.bind(this);
    this._onWebGLInitialized = this._onWebGLInitialized.bind(this);
    this.layers = this.layers.bind(this);

    this.state = {
      layers: [],
      mapProperties: {
        bearing: 0,
        longitude: 0,
        latitude: 0,
        pitch: 0,
        bounds: 0,
        zoom: 0
      },
      points:[]
    };
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(pProps) {
    if (pProps.points.length !== this.props.points.length) {
      this.setState( { points: this.props.points }, () => this.layers() );
    }
  }

  draw() {
    this.setState({
      mapProperties: {
        bearing: 0,
        longitude: this.props.options.center.lon,
        latitude: this.props.options.center.lat,
        pitch: 45,
        bounds: this.props.options.bounds,
        zoom: this.props.options.zoom
      }
    });
    this.layers();
  }

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    map.addLayer(new MapboxLayer({id: 'my-scatterplot', deck}), 'waterway-label');
  }

  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }

  layers() {
    const layers = [];
    if ( this.state && this.state.points ) {
      const reversed = this.state.points.slice(0).reverse();
      const arcs = [];
      reversed.forEach( (item, index) => {
        if (index < reversed.length - 1) {
          arcs.push({
            from: {
              coords: [ item.coords[0], item.coords[1] ],
              name: item.place,
              guests: item.guests,
            },
            to: {
              coords: [reversed[index+1].coords[0], reversed[index+1].coords[1] ],
              name: reversed[index+1].place,
              guests: reversed[index+1].guests,
              distance: reversed[index+1].distance,
            }
          });
        }
      });
      // Scatter
      layers.push(new ScatterplotLayer({
          data: this.state.points,
          filled: true,
          getPosition: d => d.coords,
          getRadius: d => d.guests,
          getFillColor: d => [0, 146, 65],
          id: 'scatter-points',
          opacity: .005,
          radiusMaxPixels: 10,
          radiusMinPixels: 5,
          stroked: false,
      }));
      // Arcs
      layers.push(new ArcLayer({
        id: 'arc-layer',
        data: arcs,
        pickable: false,
        getWidth: 1,
        getSourcePosition: d => d.from.coords,
        getTargetPosition: d => d.to.coords,
        getSourceColor: d => [0, 146, 65, 150],
        getTargetColor: d => { if (d.to.distance >= 500000) return [255, 75, 100, 150]; return [0, 146, 65, 100]; },
        })
      );
      this.setState( { layers } );
    }
  }


  render() {
    const {gl} = this.state;

    const controller = (this.props.options.controls) ? ({ type: MapController, dragRotate: false, scrollZoom: false, dragPan: true, doubleClickZoom: false, touchRotate: false, }) : ({type: MapController, dragRotate: false, scrollZoom: false, dragPan: false, doubleClickZoom: false, touchRotate: false});

    return (
      <div className="Map">
        <div className="container">
          <DeckGL
            ref={ref => this._deck = ref && ref.deck}
            layers={this.state.layers}
            controller={controller}
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