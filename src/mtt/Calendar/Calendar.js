import React, {Component} from 'react';
import styled from 'styled-components';

import './Calendar.css';

const Day = styled.div`
  background: ${props => {
    if (props.properties.empty) return 'transparent';
    if (props.properties.events > 5) return 'red';
    if (props.properties.events > 3) return 'orange';
    if (props.properties.events > 0) return 'yellow';
    if (props.properties.weekend) return '#eee';
  }};
  border: 2px solid #eee;
  border-color: ${props => {
    if (props.properties.empty) return 'transparent';
    if (props.properties.holiday) return 'cyan';
    return '#eee';
  }};
  display: block;
  flex: 0 0 25px;
  font-size: 10px;
  height: 25px;
  line-height: 21px;
  position: static;
  text-align: center;
  width: 25px;

  &::before {
    content: ${props => {
      if (props.properties.empty) return null;
      if (props.index === 0) return "'" + Months[props.properties.month].short + "'";
      if (props.properties.day === "1") return "'" + Months[props.properties.month].short + "'";
      return null;
    }};
    color: #444;
    display: block;
    font-size: 10px;
    height: 25px;
    left: 50px;
    line-height: 25px;
    position: absolute;
    text-align: left;
    text-transform: uppercase;
    top: 0;
    width: 50px;
  }

  &::after {
    content: ${props => {
      if (props.properties.empty) return null;
      if (props.index === 0) return "'" + props.properties.year + "'";
      if (props.properties.day === "1" && props.properties.month === "jan") return "'" + props.properties.year + "'";
      return null;
    }};
    color: #444;
    display: block;
    font-size: 10px;
    height: 25px;
    left: 0;
    line-height: 25px;
    position: absolute;
    text-align: left;
    text-transform: uppercase;
    top: 0;
    width: 50px;
  }
`;
    
const Months = {
  jan: {
    label: 'Gennaio',
    short: 'Gen',
    index: 0
  },
  feb: {
    label: 'Febbraio',
    short: 'Feb',
    index: 1
  },
  mar: {
    label: 'Marzo',
    short: 'Mar',
    index: 2
  },
  apr: {
    label: 'Aprile',
    short: 'Apr',
    index: 3
  },
  may: {
    label: 'Maggio',
    short: 'Mag',
    index: 4
  },
  jun: {
    label: 'Giugno',
    short: 'Giu',
    index: 5
  },
  jul: {
    label: 'Luglio',
    short: 'Lug',
    index: 6
  },
  aug: {
    label: 'Agosto',
    short: 'Ago',
    index: 7
  },
  sep: {
    label: 'Settembre',
    short: 'Set',
    index: 8
  },
  oct: {
    label: 'Ottobre',
    short: 'Ott',
    index: 9
  },
  nov: {
    label: 'Novembre',
    short: 'Nov',
    index: 10
  },
  dec: {
    label: 'Dicembre',
    short: 'Dic',
    index: 11
  }
};

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.days = {
      mon: {
        label: 'Lunedì',
        index: 0
      },
      tue: {
        label: 'Martedì',
        index: 1
      },
      wed: {
        label: 'Mercoledì',
        index: 2
      },
      thu: {
        label: 'Giovedì',
        index: 3
      },
      fri: {
        label: 'Venerdì',
        index: 4
      },
      sat: {
        label: 'Sabato',
        index: 5
      },
      sun: {
        label: 'Domenica',
        index: 6
      }
    }

    this.state = {
      data: []
    }

    this.outputGrid = this.outputGrid.bind(this);
    this.shorten = this.shorten.bind(this);
  }

  outputGrid(chart) {
    const days = Object.keys(this.days);
    
    if ( chart[0].day_of_the_week !== 'mon' ) {
      const offset = this.days[chart[0].day_of_the_week].index;
      const buffer = [];
      let i = 0;
      while ( i < offset ) {
        buffer.push({ empty: true });
        i++;
      }
      chart.unshift(...buffer);
    }

    const flatten = (calendar_days, week) => Array(
      Math.ceil(calendar_days.length / week))
        .fill()
        .map((_, index) => index * week)
        .map( begin => calendar_days.slice(begin, begin + week)
      );
    const weeks = flatten(chart, 7);
    
    return (
      <div className="Grid">
        <div className="row header">
          {
            days.map(
              day => (<div key={this.days[day].label} className="cell">{this.shorten(this.days[day].label)}</div>)
            )
          }
        </div>
        {
          weeks.map(
            (week, weekIndex) => {
              return (
                <div key={weekIndex} className={`row body week week${weekIndex}`}>
                  {
                    week.map(
                      (day, dayIndex) => {
                        return (
                          <Day key={dayIndex} properties={day} index={weekIndex}>{day.day}</Day>
                        )
                      }
                    )
                  }
                </div>
              )
            }
          )
        }
      </div>
    );
  }

  shorten(string, length) {
    if (!length) length = 1;
    if (string) return string.substring(0, length);
    return null;
  }

  render() {
    if (this.props.data && this.props.data.length > 0) {
      return (
        <div className="Calendar">
          <div className="Text">
            <h1>Il Calendario</h1>
            { this.outputGrid(this.props.data) }
          </div>
        </div>
      );
    }
    return null;
  }
}

export default Calendar;