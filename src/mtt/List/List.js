import React, {Component} from 'react';
import Location from '../Location/Location';
import './List.css';

class List extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      maxDistance: 0,
    }
  }

  componentDidUpdate( pProps ) {
    if ( JSON.stringify(this.props.days) !== JSON.stringify(pProps.days) ) {
      const locations = this.props.days.flatMap( day => day.locations );
      const distances = locations.flatMap( location => location.distance.fromRome );
      console.log( distances );
      const max = Math.max(...distances);
      console.log( max );
      this.setState( { maxDistance: max } );
    }
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
                <h2>{day.date}</h2>
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