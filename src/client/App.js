import React, { Component } from 'react';
import logo from '../static/logo.svg';
import './App.css';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../actions/appActions';
import Player from '../components/player/Player';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasAutoPlay: false
    }
  }

  componentDidMount(){
    this.checkIfHasAutoplay();
  }

  checkIfHasAutoplay() {
    this.refs.testPlayer.load();
    // Test for autoplay support with our content player.

    /*make a note about this section, since the promise is async we cannot setup DFP inside the promise*/
    let playPromise = this.refs.testPlayer.play();

    if (playPromise !== undefined) {
      playPromise.then((res) => {
        // Automatic playback started!
        this.refs.testPlayer.pause();
        this.setState({hasAutoPlay: true});
        return true;
      })
      .catch(error => {
        // Auto-play was prevented
        this.setState({hasAutoPlay: false});
        return false;
      });
    }

  }

  render() {
    return (
      <div className="App" onClick={this.props.actions.hasUserGesture}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React 16 Autoplay POC</h1>
        </header>
        {/*Button that switches pages*/}
        <div className="switch-btns" >
          <div className="home-btn btn"><Link to="/">Home</Link></div>
          <div className="watch-btn btn"><Link to="/watch">Watch</Link></div>
        </div>
        <video id="test-player" className="test-player" controls={true}
          ref="testPlayer"
          src="//h264-aws.vevo.com/v3/h264/2016/06/USCJY1531545/5fae8f50-1dc0-4a2b-9b28-3c037de055bc/uscjy1531545_high_1280x720_h264_2000_aac_128.mp4">
        </video>
        
        <Player {...this.props} hasAutoPlay={this.state.hasAutoPlay} />
        {/*Child components of app*/}
        { React.Children.map(this.props.children, (child) => {
            // console.log("==== working on child: ", child);
            return React.cloneElement(child, {
                autoplayVideoIfPossible: this.autoplayVideoIfPossible,
                actions: this.props.actions
            });

        }) }
      </div>
    );
  }
}

function mapStateToProps(state, props){
  return {
    hasUserGesture: state.AppReducers.get('hasUserGesture')
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
