import React, {Component} from 'react';

import DeckGL, {ScatterplotLayer, MapController, ArcLayer} from 'deck.gl';
import {StaticMap} from 'react-map-gl';
import {MapboxLayer} from '@deck.gl/mapbox';

import './DeckGLMap.css';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibGVlcHBvbGlzIiwiYSI6ImNpa3MzaHBtZTAwMG93N205bDA0NGJxNmsifQ.Dkw6ItpXcJjKbZBgeezEmw";
const MAPBOX_MAP_STYLE = 'mapbox://styles/leeppolis/cjxdae3pz0u9y1cpf3xcwlk2l';
//'mapbox://styles/leeppolis/cjxxcsucw1h441co56f8wechy';//

class DeckGLMap extends Component {
  constructor(props) {
    super(props);

    this._deck = null;
    this._map = null;

    this.draw = this.draw.bind(this);
    this._onMapLoad = this._onMapLoad.bind(this);
    this._onWebGLInitialized = this._onWebGLInitialized.bind(this);
    this.layers = this.layers.bind(this);
    this.debounce = this.debounce.bind(this);

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
    // console.log(pProps.selectedPin, this.props.selectedPin);
    if (
      (
        pProps.selectedPin
        && pProps.selectedPin.id
        && this.props.selectedPin
        && this.props.selectedPin.id
        && pProps.selectedPin.id !== this.props.selectedPin.id
      )
      || (
        pProps.selectedPin
        && !pProps.selectedPin.id
        && this.props.selectedPin
        && this.props.selectedPin.id
      )
    ) {
      const map = this._map;
      if (this.props.selectedPin.id) {
        console.log('fly');
        map.zoomTo(8, { duration: 250, animate: true })
            .flyTo( { center: [ this.props.selectedPin.coords[0], this.props.selectedPin.coords[1] ], speed: .75 } );
      } else {
        map.fitBounds( this.props.options.bounds );
      }
    }
  }

  debounce(func, delay) {
    let inDebounce
    return function() {
      const context = this
      const args = arguments
      clearTimeout(inDebounce)
      inDebounce = setTimeout(() => func.apply(context, args), delay)
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
    const debounceCenter = this.debounce( (evt) => {      
      const zoom = map.getZoom();
      const coords = map.getCenter();
      const mapProperties = Object.assign({}, this.state.mapProperties);
      mapProperties.zoom = zoom;
      mapProperties.longitude = coords.lng;
      mapProperties.latitude = coords.lat;
      this.setState({ mapProperties });
    }, 500 );
    const debounceZoom = this.debounce( (evt) => {      
      const zoom = map.getZoom();
      const coords = map.getCenter();
      const mapProperties = Object.assign({}, this.state.mapProperties);
      mapProperties.zoom = zoom;
      mapProperties.longitude = coords.lng;
      mapProperties.latitude = coords.lat;
      this.setState({ mapProperties });
    }, 250 );
    map.on( 'moveend', (evt) => {
      debounceCenter(evt);
    } );
    map.on( 'zoomend', (evt) => {
      debounceZoom(evt);
    } );

    map.fitBounds( this.props.options.bounds );
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
      this.setState( { layers } );
    }
  }


  render() {
    const {gl} = this.state;

    const controller = (this.props.options.controls) ? ({ type: MapController, dragRotate: false, scrollZoom: true, dragPan: true, doubleClickZoom: true, touchRotate: true, }) : ({type: MapController, dragRotate: false, scrollZoom: false, dragPan: false, doubleClickZoom: false, touchRotate: false});

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