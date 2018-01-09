import React, { Component } from 'react';
import logo from '../static/vevo-animated.svg';
import './App.css';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../actions/appActions';
import Player from '../components/player/Player';
import parser from 'ua-parser-js';

let dummySrc = "//h264-aws.vevo.com/v3/h264/2016/06/USCJY1531545/5fae8f50-1dc0-4a2b-9b28-3c037de055bc/uscjy1531545_high_1280x720_h264_2000_aac_128.mp4"

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
    }
    this.userAgent = new parser().getResult();
  }

  componentDidMount(){
    this.checkIfHasAutoplay();
  }

  /*
  We check for autoplay as soon as possible in the app so we have an empty video player
  in the top level component - I also had issues when doing this check with the player component

  @return    boolean     does the client have autoplay or not
  */
  checkIfHasAutoplay() {
    this.refs.testPlayer.load();
    // Test for autoplay support with our content player.

    /*make a note about this section, since the promise is async we cannot setup DFP inside the promise*/
    let playPromise = this.refs.testPlayer.play();

    if (playPromise !== undefined) {
      playPromise.then((res) => {
        // Automatic playback started!
        this.refs.testPlayer.pause();
        let browser = this.userAgent.browser;

        //Only has autoplay if it gets in here and isn't Safari 11
        if (browser.name === "Safari" && parseInt(browser.major, 10) >= 11) {
          this.props.actions.storeHasAutoplay(false);
          return false
        } else {
          this.props.actions.storeHasAutoplay(true);
          return true;

        }
      })
      .catch(error => {
        // Auto-play was prevented
        this.props.actions.storeHasAutoplay(false);
        return false;
      });
    } else {
      //if there isn't a play promise then assume the browser is lax on autoplay
      this.refs.testPlayer.pause();
      this.props.actions.storeHasAutoplay(true);
      return true;
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
          src={dummySrc}>
        </video>
        
        <Player {...this.props} />
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
