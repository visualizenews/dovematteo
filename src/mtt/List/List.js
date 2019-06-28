import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it'
import Location from '../Location/Location';
import './List.css';

class List extends Component {
  
  constructor(props) {
    super(props);
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
    }
  }

  formatDate(day) {
    return moment(day).format('LL');
  }

  render() {
    return (
      <div className="List">
        <h2>Il Tour</h2>
        <div className="Scroll">
        {
          this.props.days.map(
            day => (
              <div className="Day" key={day.date}>
                <h2>{this.formatDate(day.date)}</h2>
                {
                  day.locations.map(
                    location => <Location key={location.id} location={location} maxDistance={this.state.maxDistance} />
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