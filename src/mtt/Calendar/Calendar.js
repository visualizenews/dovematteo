import React, {Component} from 'react';
import styled from 'styled-components';

import './Calendar.css';

const Day = styled.div`
  background: ${props => {
    if (props.properties.empty) return 'transparent';
    if (props.properties.events > 5) return '#4C8076';
    if (props.properties.events > 3) return '#64BAAA';
    if (props.properties.events > 0) return '#C4FCF0';
    // if (props.properties.weekend) return '#FFE3EC';
    return '#fffcfd';
  }};
  border: 1px solid #fff;
  border-color: ${props => {
    if (props.properties.empty) return 'transparent';
    if (props.properties.holiday || props.properties.weekend) return '#F2A7B5';
    return '#fff';
  }};
  border-radius: 5px;
  color: ${props => {
    if (props.properties.events > 3) return '#fff';
    return '#444';
  }};
  display: block;
  flex: 0 0 23px;
  font-size: 10px;
  height: 23px;
  line-height: 21px;
  margin: 1px;
  position: static;
  text-align: center;
  width: 23px;

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

    const byDays = {
      mon: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[0] && item[0].events) return acc + item[0].events; return acc
            },
            0
          )
          })(),
        percent: 0
      },
      tue: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[1] && item[1].events) return acc + item[1].events; return acc
            },
            0
          )
        })(),
        percent: 0
      },
      wed: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[2] && item[2].events) return acc + item[2].events; return acc
            },
            0
          )
        })(),
        percent: 0
      },
      thu: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[3] && item[3].events) return acc + item[3].events; return acc
            },
            0
          )
        })(),
        percent: 0
      },
      fri: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[4] && item[4].events) return acc + item[4].events; return acc
            },
            0
          )
        })(),
        percent: 0
      },
      sat: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[5] && item[5].events) return acc + item[5].events; return acc
            },
            0
          )
        })(),
        percent: 0
      },
      sun: {
        val: (() => {
          return weeks.reduce(
            (acc, item) => {
              if (!item.empty && item[6] && item[6].events) return acc + item[6].events; return acc
            },
            0
          )
        })(),
        percent: 0
      }
    }

    const byDayKeys = Object.keys(byDays);
    let maxDay = {
      day: null,
      val: -1
    };
    byDayKeys.forEach(
      key => {
        if (byDays[key].val > maxDay.val) {
          maxDay.val = byDays[key].val;
          maxDay.day = key;
        }
      }
    );
    byDayKeys.forEach(
      key => {
        byDays[key].percent = Math.round(byDays[key].val * 100 / maxDay.val);
      }
    );

    console.log(byDays, maxDay);

    
    return (
      <div className="Content">
        <div className="Intro">
            <p>La vista del calendario aiuta meglio a capire <strong>quanto e con che concentrazione</strong> si sono succeduti i viaggi mostrati nella mappa.</p>
            <p>Nel calendario, i giorni visualizzati in bianco sono quelli senza viaggi; in grigio chiaro i weekend. I giorni in cui sono sono svolti i viaggi invece sono mostrati con una scala colorata: <strong>il colore più chiaro è utilizzato per i giorni con pochi impegni</strong> (uno o due viaggi), quello intermedio per i giorni con tre o quattro viaggi, <strong>quello più scuro per i giorni più impegnativi</strong> (cinque o più viaggi).</p>
            <p>Le festività sono rappresentate con un bordo colorato.</p>

            <div className="Legend">
              <div className="item none">0</div>
              <div className="item low">1 - 2</div>
              <div className="item medium">3 - 4</div>
              <div className="item high">5+</div>
              <div className="item we">Weekend<br />& Festività</div>
            </div>

            <p>I grafici rappresentano invece una <strong>suddivisione dei viaggi in base al giorno della settimana</strong>. Secondo quanto reso pubblico dallo stesso Salvini, il giorno in cui si concentrano la maggior parte dei sui impegni è <strong>{this.days[maxDay.day].label}</strong>.</p>

            <div className="Bars">
              {
                byDayKeys.map(
                  key => ( <div key={key} className="Bar"><div className="Color" style={ { height: `${byDays[key].percent}%` } }></div><div className="Label">{this.shorten(this.days[key].label)}</div></div> )
                )
              }
            </div>
        </div>
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