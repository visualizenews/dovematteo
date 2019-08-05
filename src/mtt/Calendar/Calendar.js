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

    this.cellClass = this.cellClass.bind(this);
    this.outputGrid = this.outputGrid.bind(this);
    this.prepareData = this.prepareData.bind(this);
    this.shorten = this.shorten.bind(this);
  }

  cellClass(day) {
    let output = 'cell day ';
    if (day.empty) return output + 'empty';

    if (day.weekend) output = output + 'we ';
    if (day.holiday) output = output + 'ho ';
    if (day.day === "1")  output = output + 'first ';
    if (day.events > 5) output = output + 'high ';
    if (day.events > 2) output = output + 'medium ';
    if (day.events > 0) output = output + 'low ';
    if (day.events === 0) output = output + 'none ';
    output = output + day.day_of_the_week + ' ' + day.month + ' y' + day.year;
    return output;
  }

  outputGrid(chart) {
    const days = Object.keys(this.days);
    let calendar_days = [];
    chart.forEach(
      year => {
        year.months.forEach(
          month => {
            calendar_days = calendar_days.concat(month.days);
          }
        )
      }
    );
    const flatten = (calendar_days, week) => Array(
      Math.ceil(calendar_days.length / week))
        .fill()
        .map((_, index) => index * week)
        .map( begin => calendar_days.slice(begin, begin + week)
      );
    const weeks = flatten(calendar_days, 7);
    console.log('W', weeks);
    
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

  prepareData(data) {
    const model = [];
    const years = {};
    const months = {};
    console.log( data );
    // Aggregate Years
    data.forEach(element => {
      if (!years[element.year]) {
        years[element.year] = [];
      }
      years[element.year].push(element);
    });
    console.log('A', years);
    // Aggregate months
    const listOfYears = Object.keys(years);
    listOfYears.forEach(
      year => {
        console.log('B', year, years[year], Array.isArray(years[year]));
        years[year].forEach(
          element => {
            if (!months[year]) {
              months[year] = {};
            }
            if (!months[year][element.month]) {
              months[year][element.month] = {};
            }
            if (!months[year][element.month].days) {
              months[year][element.month].days = [];
            }
            months[year][element.month].days.push(element);
          }
        );
      }
    );
    // Transform in an array
    listOfYears.forEach(
      year => {
        model.push({
          year: year,
          months: (() => {
            const output = [];
            let month = null;
            years[year].forEach( element => {
              if (month !== element.month) {
                month = element.month;
                output.push( {
                  month: element.month,
                  days: months[year][element.month].days
                });
              }
            });
            return output.sort( (a, b) => ( Months[a.month].index - Months[b.month].index ) );
          })()
        });
      }
    );
    // Fix 1st week
    if ( model[0].months[0].days[0].day_of_the_week !== 'mon' ) {
      const offset = this.days[model[0].months[0].days[0].day_of_the_week].index;
      const buffer = [];
      let i = 0;
      while ( i < offset ) {
        buffer.push({ empty: true });
        i++;
      }
      model[0].months[0].days.unshift(...buffer);
    }
    return model;
  }

  shorten(string, length) {
    if (!length) length = 1;
    if (string) return string.substring(0, length);
    return null;
  }

  render() {
    if (this.props.data && this.props.data.length > 0) {
      const chart = this.prepareData( this.props.data);
      return (
        <div className="Calendar">
          <div className="Text">
            <h1>Il Calendario</h1>
            { this.outputGrid(chart) }
          </div>
        </div>
      );
    }
    return null;
  }
}

export default Calendar;