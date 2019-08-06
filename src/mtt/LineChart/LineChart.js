import React, {Component} from 'react';
import './LineChart.css';
import {scaleLinear} from 'd3-scale';
import {line as d3Line, curveCatmullRom, curveStep} from 'd3-shape';
import * as moment from 'moment';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.chart = React.createRef();

    this.draw = this.draw.bind(this);
    this.viewbox = this.viewbox.bind(this);

    this.showTitle = this.showTitle.bind(this);
    this.hideTitle = this.hideTitle.bind(this);

    this.margins = [10, 5, 30, 5];
    this.labelsDistance = 40;

    this.state = {
      annotations: [],
      paths: {
        bullets: [],
        labels: [],
        lines: [],
        points: [],
        series: [],
        xAxis: {},
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
          dataPoints.push({
            className: serie.className || '',
            x: scaleX(day.x),
            y: scaleY(day.y)
          });
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
      // Lines and labels
      const lines = [];
      const labels = [];
      const bullets = [];
      let prevX = 0;
      this.props.Series[this.props.Options.index].timeline.forEach(day => {
        const x = scaleX(parseInt(day.timestamp, 10));
        const y1 = this.margins[0];
        const y2 = this.state.size.h - this.margins[2];
        if (
          (lines.length === 0 || Math.abs(x - prevX) >= this.labelsDistance) &&
          x < this.state.size.w - this.labelsDistance &&
          x >= this.labelsDistance
        ) {
          lines.push({
            x1: x,
            x2: x,
            y1,
            y2: y2 + 10,
          });
          bullets.push({
            cx: x,
            cy: y2 + 10,
            r: 2,
          });
          labels.push({
            label: moment(day.date_short).format('DD/MM'),
            x,
            y: y2 + 25,
          });
          prevX = x;
        }
      });
      // Annotations
      const annotations = [];
      if (this.props.Annotations) {
        this.props.Annotations.forEach((annotation, index) => {
          let id = Math.random();
          id = ` ${id} `;
          id = id.replace(/\./gi, '').trim();
          annotations.push({
            className: '',
            date: moment(annotation.date).format('DD/MM'),
            id: `annotation-${index}-${id}`,
            index,
            lens: {
              className: 'animate',
              style: {
                animationDelay: `${Math.floor(Math.random() * 1 + 1) + 0.5}s`,
                animationDuration: `${Math.floor(Math.random() * 2 + 1) + 0.5}s`,
                left: `${scaleX(annotation.timestamp)}px`,
                top: `${scaleY(annotation.peak)}px`,
              },
            },
            orientation: {
              x: scaleX(annotation.timestamp) > this.state.size.w / 2 ? 'right' : 'left',
              y: scaleY(annotation.peak) < this.state.size.h / 2 ? 'bottom' : 'top',
            },
            style: {
              left: `${scaleX(annotation.timestamp)}px`,
              top: `${scaleY(annotation.peak)}px`,
              width: `${Math.floor(this.state.size.w / 3)}px`,
            },
            source: annotation.source,
            title: annotation.title,
            url: annotation.link,
          });
        });
      }
      console.log('P', dataPoints);
      this.setState({
        // loading: false,
        annotations,
        paths: {bullets, labels, lines, points: dataPoints, series, xAxis},
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

  render() {
    const selectedIndex = this.props.Options.index || 0;

    const cleanURL = function cleanURL(url) {
      return url;
    };

    return (
      <div className="LineChart" ref={this.chart}>
        <svg
          viewport={`0 0 ${this.state.size.w} ${this.state.size.h}`}
          preserveAspectRatio="xMidYMid meet"
          width={this.state.size.w}
          height={this.state.size.h}
        >
          <g>
            {this.state.paths.lines.map((line, index) => {
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
            {this.state.paths.bullets.map((bullet, index) => {
              return (
                <circle key={index} cx={bullet.cx} cy={bullet.cy} r={bullet.r} className="bullet" />
              );
            })}
          </g>
          <g>
            {this.state.paths.labels.map((label, index) => {
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
        {this.state.annotations.map(annotation => {
          return (
            <div
              id={annotation.id}
              key={annotation.id}
              onMouseLeave={() => this.hideTitle(annotation)}
            >
              <div
                className={`annotation ${annotation.className} ${annotation.orientation.x} ${annotation.orientation.y}`}
                style={annotation.style}>
                <article>
                  <a href={cleanURL(annotation.url)} target="_read">
                    <h2>{annotation.title}</h2>
                  </a>
                </article>
              </div>
              <div
                onMouseEnter={() => this.showTitle(annotation)}
                className={`lens ${annotation.lens.className}`}
                style={annotation.lens.style}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

export default LineChart;
