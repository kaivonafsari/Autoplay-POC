import React, { Component } from 'react';
import logo from '../static/logo.svg';
import './App.css';
import classnames from 'classnames';
import { initializeAds, dfp } from '@vevo/dfp-js';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../actions/appActions'

let AD_TAG = {
  adUnitCode: '/40576787/oo/dt/html5',
  isrc: '123456',
  language: 'de',
  user: {isLoggedIn: 0, gender: 'm', age: 35, ppid: 'shdhsjdhskjds'},
  app: {version: '2.0', build: '13'},
  playlistid: '0043029483',
  qa: '1'
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerVisible: false,
      isHomePage: true
    }

    this.autoplayVideoIfPossible = this.autoplayVideoIfPossible.bind(this);
    this.revealPlayer = this.revealPlayer.bind(this);
    this.stopAndHidePlayer = this.stopAndHidePlayer.bind(this);
    this.switchPages = this.switchPages.bind(this);
    this.onAllAdsComplete = this.onAllAdsComplete.bind(this);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onAllContentComplete = this.onAllContentComplete.bind(this);

    this.eventListenerCbs = {
      ALL_ADS_COMPLETE: this.onAllAdsComplete,
      CONTENT_PAUSE_REQUESTED: this.pause,
      CONTENT_RESUME_REQUESTED: this.play,
      ON_TIME_UPDATE: this.onTimeUpdate,
      ALL_CONTENT_COMPLETE: this.onAllContentComplete
    }
  }

  autoplayVideoIfPossible() {
    this.refs.player.load();
    // Test for autoplay support with our content player.
    this.setupDFP();
    this.ads.request(AD_TAG);

    /*make a not about this section, since the promise is async we cannot setup DFP inside the promise*/

    // this.refs.player.play().then(() => {
    //   // If we make it here, autoplay works. Pause content and play ads.
    //   this.refs.player.pause();
    //   this.setupDFP();
    //   this.ads.request(AD_TAG);
    // }, () => {
    //   // If we make it here, autoplay doesn't work. Show the play button.
    //   console.log("--Doesn't autoplay");
    // });
  }

  onTimeUpdate(){
    console.log("--onTimeUpdate");
  }

  onAllAdsComplete(){
    console.log("--onAllAdsComplete");
  }

  onAllContentComplete(){
    console.log("--onAllContentComplete")
    this.refs.player.load();
    this.ads.request(AD_TAG);
  }

  play(){
    this.refs.player.play();
  }

  pause(){
    this.refs.player.pause();
  }

  setupDFP(){
    let adsConfig = {
      videoElement: this.refs.player,
      adContainer: this.refs.adContainer,
      brandedTicker: this.refs.brandedTicker,
      isCustom: false,
      locale: 'en',
      automaticResize: false,
      platform: dfp.platforms.Web.DESKTOP,
      overlayBottomOffset: 0
    }


    if (!this.ads){
      this.ads = initializeAds(adsConfig);
      
      let dfpEvents= dfp.events.AdEvent;

      Object.keys(dfpEvents).forEach((key)=>{
        if (this.eventListenerCbs[key]){
          this.ads.addEventListener(dfpEvents[key], this.eventListenerCbs[key]);
        }
      });
    }
  }

  destroyDFP(){
    if (this.ads){      
      let dfpEvents= dfp.events.AdEvent;

      //these is a remove all event listeners
      Object.keys(dfpEvents).forEach((key)=>{
        if (this.eventListenerCbs[key]){
          this.ads.removeEventListener(dfpEvents[key], this.eventListenerCbs[key]); 
        }
      });

      this.ads.destroy();
    }
  }

  revealPlayer(){
    this.setState({playerVisible: true});
  }

  stopAndHidePlayer(){
    this.refs.player.pause();
    this.destroyDFP();
    this.setState({playerVisible: false});
  }

  switchPages(){
    if (this.state.isHomePage){
      this.revealPlayer();
      this.autoplayVideoIfPossible();
    }
    this.setState({isHomePage: !this.state.isHomePage});
  }

  render() {
    console.log("--appProps", this.props);

    let playerStyles = classnames({
      "player": true,
      "player-visible": this.state.playerVisible,
      "player-hidden": !this.state.playerVisible
    })

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React 16 Autoplay POC - { this.state.isHomePage ? 'Home Page' : 'Watch Page'}</h1>
        </header>
        {/*Button that switches pages*/}
        <div className="switch-btns">
          <div className="home-btn" onClick={this.props.actions.testAction}><Link to="/">Home</Link></div>
          <div className="watch-btn"><Link to="/watch">Watch</Link></div>
        </div>
        
        {/*Container that holds the vide oelement and ad container*/}
        <div className="dfp-container">
          <video id="player" className={playerStyles} controls={true}
            ref="player"
            src="//h264-aws.vevo.com/v3/h264/2016/06/USCJY1531545/5fae8f50-1dc0-4a2b-9b28-3c037de055bc/uscjy1531545_high_1280x720_h264_2000_aac_128.mp4">
          </video>
          <div className="adContainer" ref="adContainer"></div>
        </div>
        
        {/*Child components of app*/}
        { React.Children.map(this.props.children, (child) => {
            // console.log("==== working on child: ", child);
            return React.cloneElement(child, {
                revealPlayer: this.revealPlayer,
                autoplayVideoIfPossible: this.autoplayVideoIfPossible,
                stopAndHidePlayer: this.stopAndHidePlayer
            });

        }) }
      </div>
    );
  }
}

function mapStateToProps(state, props){
  return {
    test: state.AppReducers
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
