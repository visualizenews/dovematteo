import React, {Component} from 'react';

import './List.css';

class List extends Component {
  render() {
    return (
      <div className="List">
        <h2>Il Tour</h2>

        {
          this.props.days.map(
            day => (
              <div className="Day" key={day.date}>
                <h2>{day.date}</h2>
                {
                  day.locations.map(
                    location => (
                      <div className="Location" key={location.id}>
                        <h2>{location.place}</h2>
                        <h1>{location.title}</h1>
                        <p>{location.description}</p>
                      </div>
                    )
                  )
                }
              </div>
            )
          )
        }
      </div>
    )
  }
}

export default List;