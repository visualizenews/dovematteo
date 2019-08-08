import React, {Component} from 'react';

import './Counter.css';

const EQUATOR = 40075;
const FORREST = 24539;
const ITALY = 7458;
const MILAN = 573;

class Counter extends Component {
  render() {
    if (this.props.totalDistance && this.props.totalDistance > 0) {
      const km = Math.round(this.props.totalDistance/1000);
      const equator = Math.floor(km / EQUATOR);
      const italy = Math.floor(km / ITALY);
      const milan = Math.floor(km / MILAN);
      const forrest = Math.floor(km / FORREST);
    
      return (
        <div className="Counter">
          <div className="Text">
            <h3>Dal <em>giorno del suo giuramento</em> davanti al Presidente della Repubblica il nostro eroe <em>ha già percorso</em> almeno</h3>
            <h1>{(new Intl.NumberFormat('it-IT').format(km))} km<sup><small>*</small></sup></h1>
            <h2>Più o meno...</h2>
            <div className="Cards">
              <div className="Card equator">
                <div className="image">
                  <span>{(new Intl.NumberFormat('it-IT').format(equator))}<sup><small>*</small></sup></span>
                </div>
                <p>Ha fatto <strong>{(new Intl.NumberFormat('it-IT').format(equator))}</strong><sup><small>*</small></sup> volte il giro del mondo</p>
                <p><a className="twitter-share-button" target="_tweet"
    href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha fatto ' + (new Intl.NumberFormat('it-IT').format(equator)) + ' volte il giro dell\'equatore? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
  Tweet</a> <a className="facebook-share-button" target="_facebook" title="Condividi su Facebook"
    href={'https://www.facebook.com/sharer/sharer.php?u=' + escape('https://matteointour.visualize.news') + '&src=sdkpreparse'}> <span>f</span>
  Condividi</a></p>
              </div>
              <div className="Card forrest">
                <div className="image">
                  <span>{(new Intl.NumberFormat('it-IT').format(forrest))}<sup><small>*</small></sup></span>
                </div>
                <p>Ha percorso <strong>{(new Intl.NumberFormat('it-IT').format(forrest))}</strong><sup><small>*</small></sup> volte quanto corso da Forrest Gump</p>
                <p><a className="twitter-share-button" target="_tweet"
    href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha percorso ' + (new Intl.NumberFormat('it-IT').format(forrest)) + ' volte la strada corsa da Forrest Gump? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
  Tweet</a> <a className="facebook-share-button" target="_facebook" title="Condividi su Facebook"
    href={'https://www.facebook.com/sharer/sharer.php?u=' + escape('https://matteointour.visualize.news') + '&src=sdkpreparse'}> <span>f</span>
  Condividi</a></p>
              </div>
              <div className="Card boat">
                <div className="image">
                  <span>{(new Intl.NumberFormat('it-IT').format(italy))}<sup><small>*</small></sup></span>
                </div>
                <p>Ha circumnavigato <strong>{(new Intl.NumberFormat('it-IT').format(italy))}</strong><sup><small>*</small></sup> volte le coste italiane, isole comprese</p>
                <p><a className="twitter-share-button" target="_tweet"
    href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha circumnavigato ' + (new Intl.NumberFormat('it-IT').format(italy)) + ' volte le coste italiane (isole comprese)? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
  Tweet</a> <a className="facebook-share-button" target="_facebook" title="Condividi su Facebook"
    href={'https://www.facebook.com/sharer/sharer.php?u=' + escape('https://matteointour.visualize.news') + '&src=sdkpreparse'}> <span>f</span>
  Condividi</a></p>
              </div>
              <div className="Card car">
                <div className="image">
                  <span>{(new Intl.NumberFormat('it-IT').format(milan))}<sup><small>*</small></sup></span>
                </div>
                <p>Ha percorso <strong>{(new Intl.NumberFormat('it-IT').format(milan))}</strong><sup><small>*</small></sup> volte la distanza stradale tra Milano e Roma</p>
                <p><a className="twitter-share-button" target="_tweet" title="Condividi su Twitter"
    href={'https://twitter.com/intent/tweet?text=' + escape('Chi ha percorso ' + (new Intl.NumberFormat('it-IT').format(milan)) + ' volte la distanza stradale tra Milano e Roma? Scoprilo con noi: https://matteointour.visualize.news - #matteointour Via @VisualizeNews')}>
  Tweet</a> <a className="facebook-share-button" target="_facebook" title="Condividi su Facebook"
    href={'https://www.facebook.com/sharer/sharer.php?u=' + escape('https://matteointour.visualize.news') + '&src=sdkpreparse'}> <span>f</span>
  Condividi</a></p>
              </div>
            </div>
          </div>
        </div>
      );
      } else {
        return null;
      }
  }
}

export default Counter;