import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl';
import './Map.css';

mapboxgl.accessToken = "pk.eyJ1IjoibGVlcHBvbGlzIiwiYSI6ImNpa3MzaHBtZTAwMG93N205bDA0NGJxNmsifQ.Dkw6ItpXcJjKbZBgeezEmw";


class Map extends Component {
  constructor(props) {
    super(props);

    this.map = null;
    this.state = {
      ready: false,
    };
  }

  componentDidMount() {
    this.addMap();
  }

  componentDidUpdate(pProps) {
    if ( JSON.stringify(pProps.options) !== JSON.stringify(this.props.options) ) {
      this.addMap();
    }
  }

  componentWillUnmount() {
    this.map.remove();
    this.map = null;
  }

  addMap() {
    if (!this.state.ready) {
      const options = JSON.parse(JSON.stringify( this.props.options ));
      options.container = this.mapContainer;
      this.map = new mapboxgl.Map( options );

      if ( this.props.options.controls.zoom || this.props.options.controls.compass ) {
        let nav = new mapboxgl.NavigationControl( { showZoom: this.props.options.controls.zoom, showCompass: this.props.options.controls.compass } );
        this.map.addControl(nav, this.props.options.controls.position);
      }
  
      this.map.on('load', () => {
        this.setState( { ready: true }, this.addPoints );
      })
    }
    this.addPoints();
  }

  addPoints() {
    if (this.state.ready) {
      try {
        this.props.options.sources.forEach( source => {
          if (this.map.getSource(source.id)) {
            this.map.removeSource(source.id);
          }
          this.map.addSource( source.id, source.definition );
        });
        this.props.options.layers.forEach( layer => {
          if (this.map.getLayer(layer.id)) {
            this.map.removeLayer(layer.id);
          }
          this.map.addLayer(layer);
        });
      } catch(e) {
        console.log(e);
      }
    }
  }

  render() {
    return (
      <div className="Map">
        <div className="container" ref={el => this.mapContainer = el} />
      </div>
    );
  }
}

export default Map;