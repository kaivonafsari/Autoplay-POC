import React, { Component } from 'react';
import logo from '../static/vevo-animated.svg';
import './App.css';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../actions/appActions';
import Player from '../components/player/Player';

class App extends Component {
  constructor(props){
    super(props);
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
