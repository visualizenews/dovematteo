import React, {Component} from 'react';

import DeckGL, {ScatterplotLayer, MapController, ArcLayer, IconLayer} from 'deck.gl';
import {StaticMap} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';
import atlas from './assets/atlas.png';

import './DeckGLMap.css';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibGVlcHBvbGlzIiwiYSI6ImNpa3MzaHBtZTAwMG93N205bDA0NGJxNmsifQ.Dkw6ItpXcJjKbZBgeezEmw";
const MAPBOX_MAP_STYLE = 'mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l';
const ICON_MAPPING = {
  marker: {x: 0, y: 0, width: 512, height: 1024, mask: true}
};

class DeckGLMap extends Component {
  constructor(props) {
    super(props);

    this._deck = null;
    this._map = null;

    this.draw = this.draw.bind(this);
    this.layers = this.layers.bind(this);
    this.resetView = this.resetView.bind(this);
    this._onMapLoad = this._onMapLoad.bind(this);
    this._onWebGLInitialized = this._onWebGLInitialized.bind(this);

    this.state = {
      controller: {
        doubleClickZoom: false,
        dragPan: false,
        dragRotate: false,
        scrollZoom: false,
        touchRotate: false,
        type: MapController,
      },
      layers: [],
      initialView: {
        bearing: 0,
        bounds: null,
        latitude: 0,
        longitude: 0,
        pitch: 45,
        zoom: 1
      },
      view: {},
      points:[]
    };
  }

  componentDidMount() {
    // this.draw();
  }

  componentDidUpdate(pProps) {
    if (pProps.options !== this.props.options) {
      this.draw();
    }
    if (pProps.points.length !== this.props.points.length) {
      this.setState( { points: this.props.points }, () => this.layers() );
    }
    const currentPin = (this.props.selectedPin && this.props.selectedPin.id) ? this.props.selectedPin.id : null;
    const previousPin = (pProps.selectedPin && pProps.selectedPin.id) ? pProps.selectedPin.id : null;
    if (
      currentPin
      && currentPin !== previousPin
    ) {
      this.layers();
      this.flyTo();
    } else if (previousPin && !currentPin) {
      this.layers();
      this.resetView();
    }
  }

  draw() {
    this.layers();
  }

  flyTo() {
    const map = this._map;
    if ( this.props.selectedPin && this.props.selectedPin.id ) {
      map.flyTo( { center: [ this.props.selectedPin.coords[0], this.props.selectedPin.coords[1] ], zoom: 8 });
    }
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
              distance: item.distance.fromRome,
            },
            to: {
              coords: [reversed[index+1].coords[0], reversed[index+1].coords[1] ],
              name: reversed[index+1].place,
              guests: reversed[index+1].guests,
              distance: reversed[index+1].distance.fromRome,
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
        getSourceColor: d => (d.from.distance >= 500000) ? [255, 75, 100, 150] : [0, 146, 65, 100],
        getTargetColor: d => (d.to.distance >= 500000) ? [255, 75, 100, 150] : [0, 146, 65, 100],
        })
      );
      // Marker
      let pinData = [];
      if ( this.props.selectedPin && this.props.selectedPin.id ) {
        pinData = [ this.props.selectedPin ];
      }
      layers.push(new IconLayer({
        id: 'icon-layer',
        data: pinData,
        pickable: false,
        // iconAtlas and iconMapping are required
        // getIcon: return a string
        iconAtlas: atlas,
        iconMapping: ICON_MAPPING,
        getIcon: d => 'marker',
        sizeScale: 10,
        billboard: true,
        getPosition: d => d.coords,
        getSize: d => 5 + ( d.guests % 10 ),
        getColor: d => (d.distance.fromRome >= 500000) ? [0, 146, 65, 100] : [255, 75, 100, 150],
        })
      );
      this.setState( { layers } );
    }
  }

  resetView() {
    const map = this._map;
    if ( this.props.options.bounds && Array.isArray(this.props.options.bounds) ) {
      map.fitBounds( this.props.options.bounds );
    }
  }

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;
    map.addLayer(new MapboxLayer({id: '1', deck}), '');
    this.resetView();
  }

  _onWebGLInitialized = (gl) => {
    this.setState({gl});
  }

  render() {
    const {gl} = this.state;
    return (
      <div className="Map">
        <div className="container">
          <DeckGL
            ref={ref => this._deck = ref && ref.deck}
            layers={this.state.layers}
            controller={this.state.controller}
            initialViewState={this.state.initialView}
            viewState={this.state.view}
            onWebGLInitialized={this._onWebGLInitialized}
          >
              <StaticMap
                ref={ref => {
                  this._map = ref && ref.getMap();
                }}
                gl={gl}
                mapStyle={MAPBOX_MAP_STYLE}
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
                onLoad={this._onMapLoad}>
              </StaticMap>
          </DeckGL>
        </div>
      </div>
    );
  }
}

export default DeckGLMap;