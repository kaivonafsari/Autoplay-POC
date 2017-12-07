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
    }
  }

  render() {
    console.log("--appProps", this.props);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React 16 Autoplay POC</h1>
        </header>
        {/*Button that switches pages*/}
        <div className="switch-btns" onClick={this.props.actions.testAction}>
          <div className="home-btn"><Link to="/">Home</Link></div>
          <div className="watch-btn"><Link to="/watch">Watch</Link></div>
        </div>
        
        <Player {...this.props} />
        {/*Child components of app*/}
        { React.Children.map(this.props.children, (child) => {
            // console.log("==== working on child: ", child);
            return React.cloneElement(child, {
                revealPlayer: this.revealPlayer,
                autoplayVideoIfPossible: this.autoplayVideoIfPossible,
                stopAndHidePlayer: this.stopAndHidePlayer,
                actions: this.props.actions
            });

        }) }
      </div>
    );
  }
}

function mapStateToProps(state, props){
  return {
    test: state
  }
}

function mapDispatchToProps(dispatch){
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
