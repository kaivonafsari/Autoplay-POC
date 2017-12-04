import React, { Component } from 'react';
import logo from '../static/logo.svg';
import './App.css';
import classnames from 'classnames';
import Watch from '../components/watch/Watch';
import Home from '../components/home/Home';

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
  }

  autoplayVideoIfPossible() {
    this.refs.player.load();
    // Test for autoplay support with our content player.
    this.refs.player.play().then(() => {
        // If we make it here, autoplay works. Pause content and play ads.
        this.refs.player.pause();
        this.refs.player.play()
      }, () => {
        // If we make it here, autoplay doesn't work. Show the play button.
        console.log("--Doesn't autoplay");
      });
  }

  revealPlayer(){
    this.setState({playerVisible: true});
  }

  stopAndHidePlayer(){
    this.refs.player.pause();
    this.setState({playerVisible: false});
  }

  switchPages(){
    console.log("--switchPages");
    this.setState({isHomePage: !this.state.isHomePage});
  }

  render() {

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
        <div className="switch-btn" onClick={this.switchPages}>Switch Pages</div>
        <video id="player" className={playerStyles} controls={true}
          ref="player"
          src="//h264-aws.vevo.com/v3/h264/2016/06/USCJY1531545/5fae8f50-1dc0-4a2b-9b28-3c037de055bc/uscjy1531545_high_1280x720_h264_2000_aac_128.mp4">
        </video>
        { this.state.isHomePage ? <Home /> : <Watch playerRef={this.refs.player} revealPlayer={this.revealPlayer} autoplayVideoIfPossible={this.autoplayVideoIfPossible} stopAndHidePlayer={this.stopAndHidePlayer} /> }
      </div>
    );
  }
}

export default App;
