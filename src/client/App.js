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
      playerVisible: false,
      isHomePage: true
    }

    this.revealPlayer = this.revealPlayer.bind(this);
    this.stopAndHidePlayer = this.stopAndHidePlayer.bind(this);
  }

  revealPlayer(){
    this.setState({playerVisible: true});
    this.setState({isHomePage: false});
  }

  stopAndHidePlayer(){
    this.setState({playerVisible: false});
    this.setState({isHomePage: true});
  }

  render() {
    console.log("--appProps", this.props);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React 16 Autoplay POC - { this.state.isHomePage ? 'Home Page' : 'Watch Page'}</h1>
        </header>
        {/*Button that switches pages*/}
        <div className="switch-btns">
          <div className="home-btn"><Link to="/">Home</Link></div>
          <div className="watch-btn"><Link to="/watch">Watch</Link></div>
        </div>
        
        <Player {...this.props} playerVisible={this.state.playerVisible} />
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
    test: state.AppReducers.string
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
