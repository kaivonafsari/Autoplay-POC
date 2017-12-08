/*
	Player Component
*/

import React, { Component } from 'react';
import classnames from 'classnames';
import { initializeAds, dfp } from '@vevo/dfp-js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../../actions/appActions';
import videoArray from '../../services/mockService';

let AD_TAG = {
  adUnitCode: '/40576787/oo/dt/html5',
  isrc: '123456',
  language: 'de',
  user: {isLoggedIn: 0, gender: 'm', age: 35, ppid: 'shdhsjdhskjds'},
  app: {version: '2.0', build: '13'},
  playlistid: '0043029483',
  qa: localStorage.getItem('forceAd') || ""
}

class Player extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerVisible: false,
      adStarted: false,
      currentSrc: ""
    }
    this.adStarted = false;

    this.revealPlayer = this.revealPlayer.bind(this);
    this.stopAndHidePlayer = this.stopAndHidePlayer.bind(this);
    this.onAllAdsComplete = this.onAllAdsComplete.bind(this);
    this.pause = this.pause.bind(this);
    this.play = this.play.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.beginAds = this.beginAds.bind(this);
    this.onAllContentComplete = this.onAllContentComplete.bind(this);

    this.eventListenerCbs = {
      ALL_ADS_COMPLETE: this.onAllAdsComplete,
      CONTENT_PAUSE_REQUESTED: this.pause,
      CONTENT_RESUME_REQUESTED: this.play,
      ON_TIME_UPDATE: this.onTimeUpdate,
      ALL_CONTENT_COMPLETE: this.onAllContentComplete
    }
  }

  beginAds(){
  	this.setVideoSrc();
  	this.refs.player.load();
    this.setupDFP();
    this.ads.request(AD_TAG);
    this.setState({adStarted: true});
  }

  setVideoSrc(){
  	let currentIndex = videoArray.indexOf(this.state.currentSrc);
  	let nextIndex = currentIndex+1;

		if (videoArray[nextIndex]){
  		this.setState({currentSrc: videoArray[nextIndex]});
		} else {
			this.setState({currentSrc: videoArray[0]});
		}
  }

  onTimeUpdate(){
    console.log("--onTimeUpdate");
  }

  onAllAdsComplete(){
    console.log("--onAllAdsComplete");
  }

  onAllContentComplete(){
    console.log("--onAllContentComplete")
    this.setVideoSrc();
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
      this.ads = null;
    }
  }

  revealPlayer(){
    this.setState({playerVisible: true});
  }


  stopAndHidePlayer(){
    this.refs.player.pause();
    this.destroyDFP();
    this.setState({playerVisible: false});
    this.setState({adStarted: false});
  }

  componentWillReceiveProps(nextProps){
  	if (nextProps.playerVisible && !this.adStarted && (nextProps.hasAutoPlay || nextProps.hasUserGesture)) {
  		this.revealPlayer();
  		this.beginAds();
  	} else if (!nextProps.playerVisible && this.props.playerVisible) {
  		this.stopAndHidePlayer();
  	}
  }


  render() {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
    let playerStyles = classnames({
      "player": true,
      "player-visible": this.props.playerVisible,
      "player-hidden": !this.props.playerVisible
    })

    let videoPosterStyles = classnames({
    	"video-poster": true,
    	"visible": !this.props.hasAutoPlay && !this.state.adStarted
    })

    return (
      <div className="player-component">
        
        <div className="dfp-container">
          <video id="player" className={playerStyles} controls={true}
            ref="player"
            src={this.state.currentSrc}>
          </video>
          <div className="adContainer" ref="adContainer"></div>
          <div onClick={this.beginAds} className={videoPosterStyles}>VIDEO POSTER</div>
        </div>
        
      </div>
    );
  }
}

function mapStateToProps(state, props){
  return {
    playerVisible: state.AppReducers.get('playerVisible')
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);