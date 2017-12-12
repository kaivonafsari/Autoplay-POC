import React, { Component } from 'react';
import logo from '../static/vevo-animated.svg';
import './App.css';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as AppActions from '../actions/appActions';
import Player from '../components/player/Player';
import parser from 'ua-parser-js';

let emptyBase64 = "data:video/mp4;base64,AAAAHGZ0eXBtcDQyAAAAAW1wNDFtcDQyaXNvbQAAAyZtb292AAAAbG12aGQAAAAA0tGoIdLRqCEAAOpgAAAbXwABAAABAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAClnRyYWsAAABcdGtoZAAAAAHS0agh0tGoIQAAAAEAAAAAAAAbXwAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAEAAAAADwAAAAhwAAAAAACRlZHRzAAAAHGVsc3QAAAAAAAAAAQAAG18AAAAAAAEAAAAAAg5tZGlhAAAAIG1kaGQAAAAA0tGoIdLRqCEAAOpgAAAbX1XEAAAAAAAxaGRscgAAAAAAAAAAdmlkZQAAAAAAAAAAAAAAAENvcmUgTWVkaWEgVmlkZW8AAAABtW1pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAXVzdGJsAAAAznN0c2QAAAAAAAAAAQAAAL5hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAA8ACHABIAAAASAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGP//AAAAO2F2Y0MBZAAg/+EAJCdkACCsExbA8BF+8BagwCDIAAE4gAA9CQcDAAXcAAF3Be98FAEABCjuHywAAAATY29scm5jbHgABgABAAYAAAAACmZpZWwBAAAAABBwYXNwAAAAAQAAAAEAAAAYc3R0cwAAAAAAAAABAAAABwAAA+kAAAAUc3RzcwAAAAAAAAABAAAAAQAAABNzZHRwAAAAACAQEBAQEBAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAcAAAABAAAAMHN0c3oAAAAAAAAAAAAAAAcAAAExAAAAJAAAAB4AAAAeAAAAHgAAAB4AAAAeAAAAFHN0Y28AAAAAAAAAAQAAA1IAAAAcdWR0YQAAABR0aXRsAAAAABXHRW1wdHkAAAAACHdpZGUAAAHzbWRhdAAAABQGBRC57bkwXSFLcYNxLBCjFLspgAAAARUluABAAAN/zfge5+dNGJXY/99lBqplGd3zh8AJ/4GD/L7AAAADAAADAAADAAADAjvTpl2G5gAACLABbgBmgCwgFPAK0AfoBMAENAPAAxQDhAAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAAAwAaopflfV0ooLFuW2MUtilfNvQXgI/jPMZ7OX4TNPd9p9KXYrSNpUzACP/y4VTUaBg8T7QAAAMAABh7fHD/m5M/0jilqbqfXzWK41/8wj3ysChf4nRse1+vPMR70P+aFTMosN8t7z6Mw6pRySw/TOZniV11dJ+HbvYeTT53I3DTcO14zdlP1USMJmQw1CKgAAAAICHgAgAQQb/+tSqAAAADAAADAAADAAADAA49e5/Y3On0AAAAGiHgBAAgQb/+tSqAAAADAAADAAADAAADAAqoAAAAGiHgBgAwQb/+tSqAAAADAAADAAADAAADAAqoAAAAGiHgCABAQb/+tSqAAAADAAADAAADAAADAAqoAAAAGiHgCgBQQb/+tSqAAAADAAADAAADAAADAAqoAAAAGiHgDABgQb/+tSqAAAADAAADAAADAAADAAqo";

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      hasAutoPlay: false
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
          this.setState({hasAutoPlay: false});
          return false
        } else {
          this.setState({hasAutoPlay: true});
          return true;

        }
      })
      .catch(error => {
        // Auto-play was prevented
        this.setState({hasAutoPlay: false});
        return false;
      });
    } else {
      //if there isn't a play promise then assume the browser is lax on autoplay
      this.setState({hasAutoPlay: true});
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
          src={emptyBase64}>
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
