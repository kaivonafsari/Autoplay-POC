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
import parser from 'ua-parser-js';

let AD_TAG = {
  adUnitCode: '/40576787/oo/dt/html5',
  isrc: '123456',
  language: 'de',
  user: {isLoggedIn: 0, gender: 'm', age: 35, ppid: 'shdhsjdhskjds'},
  app: {version: '2.0', build: '13'},
  playlistid: '0043029483',
  qa: localStorage.getItem('forceAd') || "",
  hasSound: false
}

class Player extends Component {
  constructor(props){
    super(props);
    this.state = {
      playerVisible: false,
      adStarted: false
    };
    this.userAgent = new parser().getResult();
    this._videoEvents = [
        "play",
        "pause",
        "ended",
        "error",
    ];

    this.playerEventHandlers = this.playerEventHandlers.bind(this);
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

  componentDidMount(){
    this.checkIfHasAutoplay();
    this.props.actions.storePlayerRef(this.refs.player);
    this._videoEvents.forEach((evt) => this.refs.player.addEventListener(evt, this.playerEventHandlers));
  }

  /*
  As soon as component mounts check if there is autoplay available

  @return    boolean     does the client have autoplay or not
  */
  checkIfHasAutoplay() {
    this.refs.player.load();
    // Test for autoplay support with our content player.

    /*make a note about this section, since the promise is async we cannot setup DFP inside the promise*/
    let playPromise = this.refs.player.play();

    if (playPromise !== undefined) {
      playPromise.then((res) => {
        // Automatic playback started!
        this.refs.player.pause();
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
      this.refs.player.pause();
      this.props.actions.storeHasAutoplay(true);
      return true;
    }

  }

  playerEventHandlers(evt){
    if(this.props.adState !== 'playing'){
      switch(evt.type){
        case "play":
          this.props.actions.storeVideoState('playing');
          break;
        case "pause":
          this.props.actions.storeVideoState('paused');
          break;
        case "error":
          this.props.actions.storeVideoState('error');
          break;

        default:
          break;
      }
    }
  }

  /*
	Begin ad playback
  */
  beginAds(){
    if (this.state.adStarted) { return };
    this.setVideoSrc();
    this.refs.player.load();
    this.setupDFP();
    
    let updatedAdTag = this.changeAdTag(AD_TAG);
    this.ads.request(updatedAdTag);
    this.setState({adStarted: true});
    this.props.actions.storeAdState('playing');
  }

  /*
  Have a silent ad if there is no autoplay and no gesture

  @AD_TAG     Object      AdTag needed by DFP
  @return     Object      returns an adTag config
  */
  changeAdTag(AD_TAG){
    if (this.props.hasAutoplay || this.props.hasUserGesture){
      AD_TAG.hasSound = true;
    }
      return AD_TAG;
  }

  /*
	Sets the video src of the video element
  */
  setVideoSrc(){
  	let currentIndex = videoArray.indexOf(this.props.videoSource);
  	this.props.actions.getVideoSrc(currentIndex);
  }

  /*
	Updates the adTime
  */
  onTimeUpdate(){
    console.log("--onTimeUpdate");
  }

  /*
	What to do when the ad completes
  */
  onAllAdsComplete(){
    this.props.actions.storeAdState('ended');
  }

  /*
	Sets a new video src and requests another ad
  */
  onAllContentComplete(){
    this.props.actions.storeVideoState('ended');
    this.setVideoSrc();
    this.refs.player.load();
    
    let updatedAdTag = this.changeAdTag(AD_TAG);
    this.ads.request(updatedAdTag);
  }

  /*
	DFP event handler
  */
  play(){
    this.refs.player.play();
  }

  /*
	DFP event handler
  */
  pause(){
    this.refs.player.pause();
  }


  /*
	Sets up DFP
  */
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

  /*
	Tears down DFP
  */
  destroyDFP(){
    if (this.ads){
      this.ads.destroy();
    }
  }


  /*
	When unmounting a watch page, stop and hide the player
  */
  stopAndHidePlayer(){
    this.refs.player.pause();
    this.destroyDFP();
    this.setState({playerVisible: false, adStarted: false});
    this.props.actions.storeVideoState(null);
    this.props.actions.storeAdState(null);
  }

  componentWillReceiveProps(nextProps){
  	if (nextProps.playerVisible && !this.state.adStarted && (nextProps.hasAutoPlay || nextProps.hasUserGesture)) {
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
    	"visible": !this.props.hasAutoPlay && !this.state.adStarted && this.props.playerVisible
    })

    return (
      <div className="player-component">
        
        <div className="dfp-container">
          <video id="player" className={playerStyles} controls={true}
            ref="player"
            playsInline={true}
            src={this.props.videoSource || "//h264-aws.vevo.com/v3/h264/2016/06/USCJY1531545/5fae8f50-1dc0-4a2b-9b28-3c037de055bc/uscjy1531545_high_1280x720_h264_2000_aac_128.mp4"}>
          </video>
          <div className="adContainer" ref="adContainer"></div>
          <div onClick={this.beginAds} className={videoPosterStyles}>
            <div className="poster-text">
              VIDEO POSTER
            </div>
          </div>
        </div>
        
      </div>
    );
  }
}

function mapStateToProps(state, props){
  return {
    playerVisible: state.AppReducers.get('playerVisible'),
    videoSource: state.AppReducers.get('videoSource'),
    adState: state.AppReducers.get('adState'),
    videoState: state.AppReducers.get('videoState'),
    hasAutoPlay: state.AppReducers.get('hasAutoplay')
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player);