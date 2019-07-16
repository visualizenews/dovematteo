import React, {Component} from 'react';

import './Counter.css';

const EQUATOR = 40075;
const FORREST = 24539;
const ITALY = 7458;
const LEMANS = 5410;
const MILAN = 573;

class Counter extends Component {
  state = {
    equator: 0,
    forrest: 0,
    italy: 0,
    km: 0,
    lemans: 0,
    milan: 0
  };

  componentDidUpdate(pProps) {
    if ( JSON.stringify(pProps.data) !== JSON.stringify(this.props.data) ) {
      const km = Math.round(this.props.data.reduce((acc, val) => (acc + val.distance.fromPrevious), 0) / 1000);
      const equator = Math.round(km / EQUATOR);
      const italy = Math.round(km / ITALY);
      const milan = Math.round(km / MILAN);
      const forrest = Math.round(km / FORREST);
      const lemans = Math.round(km / LEMANS);
      this.setState({ equator, forrest, italy, km, lemans, milan});
    }
  }

  render() {
    return (
      <div className="Counter">
        <div className="Text">
          <h3>Dal <em>giorno del suo giuramento</em> davanti al Presidente della Repubblica il nostro eroe <em>ha già percorso</em> almeno</h3>
          <h1>{(new Intl.NumberFormat('it-IT').format(this.state.km))} km<sup><small>*</small></sup></h1>
          <h2>Più o meno...</h2>
          <div className="Cards">
            <div className="Card equator">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.equator))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha fatto <strong>{(new Intl.NumberFormat('it-IT').format(this.state.equator))}</strong><sup><small>*</small></sup> volte il giro del mondo</p>
              <p><a className="twitter-share-button" target="_tweet"
  href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha fatto ' + (new Intl.NumberFormat('it-IT').format(this.state.equator)) + ' volte il giro dell\'equatore? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
Tweet</a></p>
            </div>
            <div className="Card forrest">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.forrest))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha percorso <strong>{(new Intl.NumberFormat('it-IT').format(this.state.forrest))}</strong><sup><small>*</small></sup> volte quanto corso da Forrest Gump</p>
              <p><a className="twitter-share-button" target="_tweet"
  href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha percorso ' + (new Intl.NumberFormat('it-IT').format(this.state.forrest)) + ' volte la strada corsa da Forrest Gump? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
Tweet</a></p>
            </div>
            <div className="Card boat">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.italy))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha circumnavigato <strong>{(new Intl.NumberFormat('it-IT').format(this.state.italy))}</strong><sup><small>*</small></sup> volte le coste italiane, isole comprese</p>
              <p><a className="twitter-share-button" target="_tweet"
  href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha circumnavigato ' + (new Intl.NumberFormat('it-IT').format(this.state.italy)) + ' volte le coste italiane (isole comprese)? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
Tweet</a></p>
            </div>
            <div className="Card car">
              <div className="image">
                <span>{(new Intl.NumberFormat('it-IT').format(this.state.milan))}<sup><small>*</small></sup></span>
              </div>
              <p>Ha percorso <strong>{(new Intl.NumberFormat('it-IT').format(this.state.milan))}</strong><sup><small>*</small></sup> volte la distanza stradale tra Milano e Roma</p>
              <p><a className="twitter-share-button" target="_tweet"
  href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha percorso ' + (new Intl.NumberFormat('it-IT').format(this.state.milan)) + ' volte la distanza stradale tra Milano e Roma? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
Tweet</a></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Counter;