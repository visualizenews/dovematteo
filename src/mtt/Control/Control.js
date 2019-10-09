import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/it';
import './Control.css';

class Control extends Component {
  constructor(props) {
    super(props);
    moment.locale('it-IT');

    this.playPause = this.playPause.bind(this);
    this.playStatus = this.playStatus.bind(this);
    this.pointInfo = this.pointInfo.bind(this);
    this.openLink = this.openLink.bind(this);
  }

  componentDidMount() {}

  openLink() {
    if (this.props.isPlaying) {
      this.playPause();
    }
  }

  playPause() {
    this.props.playPause();
  }

  playStatus() {
    if (this.props.isPlaying) {
      return <span className="pause"></span>
    }
    return <span className="play"></span>
  }

  pointInfo() {
    if (this.props.selectedPin && this.props.selectedPin.id) {
      return <span><a href={this.props.selectedPin.link} target="_facebook" onClick={this.openLink} title={this.props.selectedPin.description}>{moment(this.props.selectedPin.date).format('L')} - {this.props.selectedPin.place}: {this.props.selectedPin.description}</a></span>
    }
    return <span>Clicca su un evento o premi play</span>
  }

  render() {
    return null;
    /*
    return (
      <div className="Control">
        <button onClick={this.playPause}>{this.playStatus()}</button>
        <div className="playing">{this.pointInfo()}</div>
      </div>
    );
    */
  }
}

export default Control;