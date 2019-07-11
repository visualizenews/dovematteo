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
    moment.locale('it-IT');
  }

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
                    location => <Location key={location.id} location={location} centerMap={this.props.centerMap} />
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