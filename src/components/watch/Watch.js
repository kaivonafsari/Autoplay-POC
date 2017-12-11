import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../../actions/appActions';

class Watch extends Component {
  constructor(props){
    super(props);
    this.state = {};
    this.pauseOrPlayVideo = this.pauseOrPlayVideo.bind(this);
  }

  componentDidMount(){
    this.props.actions.storePlayerVisible(true);
  }

  componentWillUnmount(){
    this.props.actions.storePlayerVisible(false);
  }

  pauseOrPlayVideo(){
    if (this.props.videoState === "playing"){
      this.props.playerRef.pause();
      this.props.actions.storeVideoState('pause');
    } else {
      this.props.playerRef.play();
      this.props.actions.storeVideoState('playing');
    }
  }

  render() {
    return (
      <div className="watch">
        Watch Page
        <button className="pause-btn" onClick={this.pauseOrPlayVideo}>
          {`${this.props.videoState == "playing" ? "Pause" : "Play"} Music Video`}
        </button>
      </div>
    );
  }
}

function mapStateToProps(state, props){
  return {
    hasUserGesture: state.AppReducers.get('hasUserGesture'),
    playerRef: state.AppReducers.get('playerRef'),
    videoState: state.AppReducers.get('videoState')
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Watch);