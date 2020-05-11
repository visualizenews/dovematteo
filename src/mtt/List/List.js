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
    this.scrollTo = this.scrollTo.bind(this);
    moment.locale('it-IT');
  }

  componentDidUpdate(pProps) {
    if (
      pProps
      && pProps.index
      && pProps.index !== this.props.index
    ) {
      this.scrollTo(this.props.index);
    }
  }

  formatDate(day) {
    return moment(day).format('D MMM YY');
  }

  centerMap(pin, index) {
    if (window.matchMedia('screen and (min-width:768px)').matches) {
      this.scrollTo(index);
    }
    this.props.centerMap(pin, index);
  }

  scrollTo(index) {
    const left = this._scroll.current.querySelector('.Location').offsetWidth * index;
    try {
      this._scroll.current.scrollTo({
        top: 0,
        left,
        behavior: 'smooth'
      });
    } catch(e) {
      this._scroll.current.scrollTo(left,0);
    }
    
  }

  render() {
    let realIndex = -1;
    return (
      <div className="List">
        <div className="Scroll" ref={this._scroll}>
        {
          this.props.days.map(
            (day, index) => {
              return (
                <div className="Day" key={day.date}>
                  <h2>{this.formatDate(day.date)}</h2>
                  {
                    day.locations.map(
                      location => {
                        realIndex++;
                        return (<Location key={location.id} location={location} centerMap={this.centerMap} selectedPin={this.props.selectedPin} index={realIndex} />)
                      }
                    )
                  }
                </div>
              )
            }
          )
        }
        </div>
      </div>
    )
  }
}

export default List;