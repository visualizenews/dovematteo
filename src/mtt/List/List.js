import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';
import Location from '../Location/Location';
import './List.css';

class List extends Component {
  
  constructor(props) {
    super(props);
    this._scroll = React.createRef();
    this.centerMap = this.centerMap.bind(this);
    moment.locale('it-IT');
  }

  formatDate(day) {
    return moment(day).format('LL');
  }

  centerMap(pin) {
    try {
      this._scroll.current.scrollBy({
        top: 0,
        left: 300,
        behavior: 'smooth'
      });
    } catch(e) {
      this._scroll.current.scrollBy(300,0);
    }
    this.props.centerMap(pin);
  }

  render() {
    return (
      <div className="List">
        <div className="Scroll" ref={this._scroll}>
        {
          this.props.days.map(
            day => (
              <div className="Day" key={day.date}>
                <h2>{this.formatDate(day.date)}</h2>
                {
                  day.locations.map(
                    location => <Location key={location.id} location={location} centerMap={this.centerMap} selectedPin={this.props.selectedPin} />
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