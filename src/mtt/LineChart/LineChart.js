import React, {Component} from 'react';
import './LineChart.css';
import {scaleLinear} from 'd3-scale';
import {line as d3Line, curveStep} from 'd3-shape';
import * as moment from 'moment';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.chart = React.createRef();

    this.draw = this.draw.bind(this);
    this.viewbox = this.viewbox.bind(this);

    this.activateAnnotation = this.activateAnnotation.bind(this);
    this.showTitle = this.showTitle.bind(this);
    this.hideTitle = this.hideTitle.bind(this);

    this.margins = [10, 5, 60, 25];
    this.labelsDistance = 60;

    this.state = {
      annotations: [],
      paths: {
        bullets: [],
        xlabels: [],
        ylabels: [],
        ylines: [],
        xlines: [],
        points: [],
        series: [],
        xAxis: {},
        yAxis: {},
      },
      points: {
        size: 4
      },
      size: {
        h: 0,
        w: 0,
      },
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.viewbox, false);
    this.viewbox();
  }

  componentDidUpdate(pProps) {
    if (pProps !== this.props) {
      this.viewbox();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.viewbox, false);
  }


  showTitle(annotation) {
    const annotations = this.state.annotations.slice(0);

    annotations[annotation.index].className = 'visible';
    annotations[annotation.index].lens.className = '';
    this.setState({annotations}, () => {
      annotations[annotation.index].className = 'visible animate';
      setTimeout(() => this.setState({annotations}), 10);
    });
  }

  hideTitle(annotation) {
    const annotations = this.state.annotations.slice(0);
    annotations[annotation.index].className = 'visible';
    this.setState({annotations}, () => {
      annotations[annotation.index].className = '';
      setTimeout(() => this.setState({annotations}), 10);
    });
  }

  draw() {
    console.log( this.props.Series, this.props.Options);
    if (this.props.Series && this.props.Series.length > 0 && this.props.Options) {
      // Define scaleX and scaleY
      const topBaseY = this.margins[0];
      const bottomBaseY = this.state.size.h - this.margins[2];
      const leftBaseX = this.margins[3];
      const rightBaseX = this.state.size.w - this.margins[1];

      const scaleX = scaleLinear()
        .domain([ this.props.Options.minX, this.props.Options.maxX ])
        .range([leftBaseX, rightBaseX]);

      const scaleY = scaleLinear()
        .domain([ this.props.Options.minY, this.props.Options.maxY ])
        .range([bottomBaseY, topBaseY]);

      const line = d3Line()
        .x(point => point.x)
        .y(point => point.y)
        .curve(curveStep);

      // Define SVG Areas
      const series = [];
      const dataPoints = [];
      this.props.Series.forEach(serie => {
        const points = [];
        serie.timeline.forEach(day => {
          points.push({
            x: scaleX(day.x),
            y: scaleY(day.y),
          });
          /*
          dataPoints.push({
            className: serie.className || '',
            x: scaleX(day.x),
            y: scaleY(day.y)
          });
          */
        });
        series.push({
          name: serie.name || '',
          className: serie.className || '',
          path: line(points),
          points,
        });
      });
      // Define Axis
      const xAxis = {
        x1: this.margins[3],
        y1: scaleY(0),
        x2: this.state.size.w - this.margins[1],
        y2: scaleY(0),
      };
      const yAxis = {
        x1: this.margins[3],
        y1: scaleY(this.props.Options.maxY),
        x2: this.margins[3],
        y2: scaleY(this.props.Options.minY),
      };
      
      // Lines and labels
      const xlines = [];
      const xlabels = [];
      const bullets = [];
      let prevX = 0;
      this.props.Series[this.props.Options.index].timeline.forEach(day => {
        const x = scaleX(day.x);
        const y1 = this.margins[0];
        const y2 = this.state.size.h - this.margins[2];
        if (
          (xlines.length === 0 || Math.abs(x - prevX) >= this.labelsDistance) &&
          x < this.state.size.w - this.labelsDistance &&
          x >= this.labelsDistance
        ) {
          xlines.push({
            x1: x,
            x2: x,
            y1,
            y2: y2 + 40,
          });
          bullets.push({
            cx: x,
            cy: y2 + 40,
            r: 2,
          });
          xlabels.push({
            label: day.xLabel,
            x,
            y: y2 + 55,
          });
          prevX = x;
        } else {
          xlines.push({
            x1: x,
            x2: x,
            y1,
            y2: y2,
          });
        }
      });
      const ylines = [ {
        x1: this.margins[3],
        y1: scaleY(5),
        x2: this.state.size.w - this.margins[1],
        y2: scaleY(5)
      },{
        x1: this.margins[3],
        y1: scaleY(15),
        x2: this.state.size.w - this.margins[1],
        y2: scaleY(15)
      }, {
        x1: this.margins[3],
        y1: scaleY(25),
        x2: this.state.size.w - this.margins[1],
        y2: scaleY(25)
      }, {
        x1: this.margins[3],
        y1: scaleY(30),
        x2: this.state.size.w - this.margins[1],
        y2: scaleY(30)
      } ];

      const ylabels = [{
        x: this.margins[3] - 10,
        y: scaleY(5),
        label: '5'
      }, {
        x: this.margins[3] - 10,
        y: scaleY(15),
        label: '15'
      }, {
        x: this.margins[3] - 10,
        y: scaleY(25),
        label: '25'
      }, {
        x: this.margins[3] - 10,
        y: scaleY(30),
        label: '30'
      }];

      // Annotations
      const annotations = [];
      if (this.props.Annotations) {
        this.props.Annotations.forEach((annotation, index) => {
          console.log('-',annotation, annotation.x.unix());
          if (index > 0) {
            console.log('--',this.props.Annotations[index-1].x.unix());
          }
          annotations.push({
            className: '',
            date: moment(annotation.date).format('DD/MM/YYYY'),
            display: { display: 'none' },
            style: {
              left: `${scaleX(annotation.x)}px`,
              bottom: (index > 0 && this.props.Annotations[index-1].x.unix() === annotation.x.unix()) ? '30px' : '45px'
            },
            title: annotation.title,
            url: annotation.link,
          });
        });
      }
      
      this.setState({
        annotations,
        paths: {bullets, xlabels, ylabels, ylines, xlines, points: dataPoints, series, xAxis, yAxis},
      });
    }
  }

  viewbox() {
    const svgWrapper = this.chart.current;
    const size = {
      h: svgWrapper.offsetHeight,
      w: svgWrapper.offsetWidth,
    };
    this.setState({size}, () => {
      this.draw();
    });
  }

  activateAnnotation(e, i) {
    e.preventDefault();
    const annotations = this.state.annotations.slice();
    if ( annotations[i].display.display === 'block' ) {
      annotations[i].display = { display: 'none' };
    } else {
      annotations.forEach(
        (annotation, index) => {
          annotations[index].display = { display: 'none' }
        }
      );
      annotations[i].display = { display: 'block' };
    }
    this.setState({
      annotations
    });
  }

  render() {
    const selectedIndex = this.props.Options.index || 0;

    return (
      <div className="LineChart" ref={this.chart}>
        <svg
          viewport={`0 0 ${this.state.size.w} ${this.state.size.h}`}
          preserveAspectRatio="xMidYMid meet"
          width={this.state.size.w}
          height={this.state.size.h}
        >
          <g>
            {this.state.paths.xlines.map((line, index) => {
              return (
                <line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className="dateLine"
                />
              );
            })}
          </g>
          <g>
            {this.state.paths.ylines.map((line, index) => {
              return (
                <line
                  key={index}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  className="dateLine"
                />
              );
            })}
          </g>
          <g>
            {this.state.paths.series.map((serie, index) => {
              return (
                <path
                  key={serie.className}
                  d={serie.path}
                  className={`line ${index === selectedIndex ? 'selected ' : ''}${serie.className}`}
                />
              );
            })}
          </g>
          { /*
          <g>
            {this.state.paths.points.map((point, index) => {
              return (
                <rect
                  key={index}
                  x={point.x - this.state.points.size / 2}
                  y={point.y - this.state.points.size / 2}
                  width={this.state.points.size}
                  height={this.state.points.size}
                  rx="2"
                  className={`point ${point.className}`}
                />
              );
            })}
          </g>
          */ }
          <g>
            <line
              x1={this.state.paths.xAxis.x1}
              y1={this.state.paths.xAxis.y1}
              x2={this.state.paths.xAxis.x2}
              y2={this.state.paths.xAxis.y2}
              className="xAxis"
            />
          </g>
          <g>
            <line
              x1={this.state.paths.yAxis.x1}
              y1={this.state.paths.yAxis.y1}
              x2={this.state.paths.yAxis.x2}
              y2={this.state.paths.yAxis.y2}
              className="yAxis"
            />
          </g>
          <g>
            {this.state.paths.bullets.map((bullet, index) => {
              return (
                <circle key={index} cx={bullet.cx} cy={bullet.cy} r={bullet.r} className="bullet" />
              );
            })}
          </g>
          <g>
            {this.state.paths.ylabels.map((label, index) => {
              return (
                <text
                  key={index}
                  x={label.x}
                  y={label.y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  dominantBaseline="middle"
                  className="label"
                >
                  {label.label}
                </text>
              );
            })}
          </g>
          <g>
            {this.state.paths.xlabels.map((label, index) => {
              return (
                <text
                  key={index}
                  x={label.x}
                  y={label.y}
                  textAnchor="middle"
                  alignmentBaseline="top"
                  dominantBaseline="top"
                  className="label"
                >
                  {label.label}
                </text>
              );
            })}
          </g>
        </svg>
        {this.state.annotations.map((annotation, index) => {
          return (
              <div
                key={annotation.url}
                className="annotation"
                style={annotation.style}>
                <article
                  style={annotation.display}>
                    <h3>{annotation.date}</h3>
                    <h2><a href={annotation.url} target="_read" title="Leggi la notizia">{annotation.title}</a></h2>
                </article>
                <div className="bullet" onClick={(e) => { this.activateAnnotation(e, index); }}></div>
              </div>
          );
        })}
      </div>
    );
  }
}

export default LineChart;
