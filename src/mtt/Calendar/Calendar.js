import React, {Component} from 'react';
import styled from 'styled-components';
import moment from 'moment';
import 'moment/locale/it';
import LineChart from '../LineChart/LineChart';

import './Calendar.css';

const Day = styled.div`
  background: ${props => {
    if (props.properties.empty) return 'transparent';
    if (props.properties.events > 5) return '#4C8076';
    if (props.properties.events > 3) return '#64BAAA';
    if (props.properties.events > 0) return '#C4FCF0';
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
      if (props.index === 0) return "'" + props.properties.month_label + "'";
      if (props.properties.day === "1") return "'" + props.properties.month_label + "'";
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

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    }

    this.outputGrid = this.outputGrid.bind(this);
    this.shorten = this.shorten.bind(this);
  }

  outputGrid(chart) {
    const days = [ 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica' ];
    const daysMap = { mon: 'Lunedì', tue: 'Martedì', wed: 'Mercoledì', thu: 'Giovedì', fri: 'Venerdì', sat: 'Sabato', sun: 'Domenica' }

    if ( chart[0].day_of_the_week_index !== '1' && !chart[0].empty ) {
      const offset = parseInt(chart[0].day_of_the_week_index) - 1;
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
          maxDay.label = daysMap[key];
        }
      }
    );
    byDayKeys.forEach(
      key => {
        byDays[key].percent = Math.round(byDays[key].val * 100 / maxDay.val);
      }
    );
 
    const months = {};

    chart.forEach(
      day => {
        if (!day.empty) {
          if (!months[day.year + day.month]) {
            months[day.year + day.month] = {
              year: day.year,
              month: day.month,
              month_label: day.month_label,
              x: moment(`${day.year}-${day.month}-15`),
              busy: 0,
              free: 0
            };
          }
          if (day.events > 0) {
            months[day.year + day.month].busy = months[day.year + day.month].busy + 1;
          } else {
            months[day.year + day.month].free = months[day.year + day.month].free + 1;
          }
        }
      }
    );

    const monthKeys = Object.keys(months);
    const series = [ [], [] ];
    let maxX = -1;
    let maxY = -1;
    let minX = Number.MAX_SAFE_INTEGER;
    let minY = Number.MAX_SAFE_INTEGER;

    series[0] = {
      name: 'free',
      id: 'free',
      className: 'free',
      timeline: []
    }
    series[1] = {
      name: 'busy',
      id: 'busy',
      className: 'busy',
      timeline: []
    }

    monthKeys.forEach(
      key => {
        const month = months[key];
        if (month.x > maxX) maxX = month.x;
        if (month.x < minX) minX = month.x;
        if (month.free > maxY) maxY = month.free;
        if (month.free < minY) minY = month.free;
        if (month.busy > maxY) maxY = month.busy;
        if (month.busy < minY) minY = month.busy;

        series[0].timeline.push( {
          xLabel: month.month_label + ' ' + month.year,
          x: month.x,
          y: month.free
        } );
        series[1].timeline.push( {
          xLabel: month.month_label + ' ' + month.year,
          x: month.x,
          y: month.busy
        } );
      }
    );

    const lineOptions = {
      maxX: maxX,
      maxY: Math.max(maxY,31),
      minX: minX,
      minY: Math.min(0,minY),
      index: 0
    }

    const annotations = [
      {
        title: `Video: Genova, il crollo in diretta del ponte Morandi`,
        link: `https://stream24.ilsole24ore.com/video/notizie/genova-crollo-diretta-ponte-morandi/AE05V2aF`,
        date: moment('2018-08-14'),
        x: moment('2018-08-15')
      },
      {
        title: `Corinaldo, otto indagati per la strage in discoteca`,
        link: `https://www.huffingtonpost.it/2018/12/10/corinaldo-due-fermi-per-droga-si-ipotizza-una-banda-per-rapinare-i-giovani-in-discoteca_a_23613910/`,
        date: moment('2018-12-08'),
        x: moment('2018-12-15')
      },
      {
        title: `Elezioni europee 2019: candidati, partiti e risultati`,
        link: `https://www.tgcom24.mediaset.it/politica/elezioni-2019/europee/`,
        date: moment('2019-05-26'),
        x: moment('2019-05-15')
      },
      {
        title: `La Sea Watch 3 è arrivata a Lampedusa`,
        link: `https://www.ilpost.it/2019/06/26/sea-watch-3-italia/`,
        date: moment('2019-06-19'),
        x: moment('2019-06-15')
      },
      {
        title: `Cosa sappiamo dell’inchiesta sugli abusi a Reggio Emilia`,
        link: `https://www.ilpost.it/2019/07/01/inchiesta-abusi-reggio-emilia-elettroshock/`,
        date: moment('2019-06-27'),
        x: moment('2019-06-15')
      },
      {
        title: `Giallo sui soldi russi alla Lega. Salvini: "Mai preso un rublo, pronto a querelare"`,
        link: `http://www.ilgiornale.it/news/politica/giallo-sui-soldi-russi-lega-salvini-mai-preso-rublo-pronto-1724208.html`,
        date: moment('2019-07-10'),
        x: moment('2019-07-15')
      },
      {
        title: `Decreto sicurezza bis, Unhcr: «Ci saranno più morti in mare»`,
        link: `https://www.corriere.it/buone-notizie/19_agosto_06/decreto-sicurezza-bis-unhcr-ci-saranno-piu-morti-mare-6e7591cc-b833-11e9-b2de-ac53be46e6c6.shtml`,
        date: moment('2019-08-05'),
        x: moment('2019-08-15')
      },
      {
        title: `Governo, la linea di Salvini: basta perdere tempo, l’unica alternativa sono le elezioni anticipate`,
        link: `https://www.corriere.it/politica/19_agosto_08/crisi-governo-salvini-ha-deciso-elezioni-anticipate-basta-perdere-tempo-7bc82150-b9dc-11e9-8fe8-844ac90f9596.shtml`,
        date: moment('2019-08-08'),
        x: moment('2019-08-15')
      }
    ];

    return (
      <div className="CalendarWrapper">
      <div className="Content">
        <div className="Intro">
            <p>La vista del calendario aiuta meglio a capire <strong>quanto e con che concentrazione</strong> si sono succeduti i viaggi mostrati nella mappa.</p>
            <p>Nel calendario, i giorni visualizzati in bianco sono quelli senza viaggi; con il bordo rosso sono mostrati weekend e festività. I giorni in cui sono sono svolti i viaggi invece sono mostrati con una scala colorata: <strong>il colore più chiaro è utilizzato per i giorni con pochi impegni</strong> (uno o due viaggi), quello intermedio per i giorni con tre o quattro viaggi, <strong>quello più scuro per i giorni più impegnativi</strong> (cinque o più viaggi).</p>
            <p>Le festività sono rappresentate con un bordo colorato.</p>

            <div className="Legend">
              <div className="item none">0</div>
              <div className="item low">1 - 2</div>
              <div className="item medium">3 - 4</div>
              <div className="item high">5+</div>
              <div className="item we">Weekend<br />& Festività</div>
            </div>

            <p>Il grafico rappresenta invece una <strong>suddivisione dei viaggi in base al giorno della settimana</strong>. Secondo quanto reso pubblico dallo stesso Salvini, il giorno in cui si concentrano la maggior parte dei sui impegni è <strong>{maxDay.label}</strong>.</p>

            <div className="Bars">
              {
                byDayKeys.map(
                  key => ( <div key={key} className="Bar"><div className="Color" style={ { height: `${byDays[key].percent}%` } }></div><div className="Label">{this.shorten(daysMap[key])}</div></div> )
                )
              }
            </div>
        </div>
        <div className="Grid">
          <div className="row header">
            {
              days.map(
                day => (<div key={day} className="cell">{this.shorten(day)}</div>)
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
          
        <div className="Outro">
          <p>Ma che rapporto c'è tra i giorni "liberi" e quelli con impegni di diverso tipo? La loro distribuzione è cambiata nel tempo? Abbiamo provato ad aggregare, su base mensile, il numero di <strong className="green">giorni liberi</strong> (<strong className="green">in verde</strong>) e quelli con <strong className="red">almeno un impegno</strong> (<strong className="red">in rosso</strong>) per vedere se le abitudini di viaggio del Ministro hanno subito qualche cambiamento nel tempo. Per facilitare la lettura, abbiamo aggiunto come riferimento alcuni fatti di cronaca avvenuti durante il periodo monitorato (contrassegnati da <strong className="bullet"></strong>, clicca per accedere ai dettagli).</p>

          <div className="Lines">
            
            <LineChart Series={series} Options={lineOptions} Annotations={annotations} />
            
          </div>

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