import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';
import Location from '../Location/Location';
import './List.css';

class List extends Component {
  
  constructor(props) {
    super(props);
    this._scroll = null;
    //this.observer = null;
    //this.observed = null;
    //this.unobserve = this.unobserve.bind(this);
    this.state = {
      maxDistance: 0,
    };
    moment.locale('it-IT');
  }

  componentDidUpdate( pProps ) {
    if ( JSON.stringify(this.props.days) !== JSON.stringify(pProps.days) ) {
      const locations = this.props.days.flatMap( day => day.locations );
      const distances = locations.flatMap( location => location.distance.fromRome );
      const max = Math.max(...distances);
      this.setState( { maxDistance: max } );
      /*
      this.observed = this._scroll.querySelectorAll('.Location');
      this.unobserve();
      const options = {
        root: this._scroll, // relative to document viewport 
        rootMargin: '0px', // margin around root. Values are similar to css property. Unitless values not allowed
        threshold: 0 // visible amount of item shown in relation to root
      };
      this.observer = new IntersectionObserver(
        (changes, observer) => {
          changes.forEach(
            change => {
              const id = change.target.getAttribute('id');
              if (
                change.isIntersecting === true 
              ) {
                this.props.change('put',id);
              } else if (
                change.isIntersecting === false 
                && (change.rootBounds.top + change.rootBounds.height / 2 > change.boundingClientRect.top)
              ) {
                this.props.change('pop',id);
              }
            }
          );
        },
        options
      );
      this.observed.forEach(location => this.observer.observe(location));
      */
    }
  }
/*
  componentWillUnmount() {
    this.unobserve();
  }

  unobserve() {
    if (this.observed && this.observer) this.observed.forEach(location => this.observer.unobserve(location));
  }
*/
  formatDate(day) {
    return moment(day).format('LL');
  }

  render() {
    return (
      <div className="List">
        <div className="Scroll"
          ref={ref => {
            this._scroll = ref;
          }}>
        {
          this.props.days.map(
            day => (
              <div className="Day" key={day.date}>
                <h2>{this.formatDate(day.date)}</h2>
                {
                  day.locations.map(
                    location => <Location key={location.id} location={location} maxDistance={this.state.maxDistance} centerMap={this.props.centerMap} />
                  )
                }
              </div>
            )
          )
        }
        </div>
      </div>
    )
  }
}

export default List;