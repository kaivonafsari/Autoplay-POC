import React, { Component } from 'react';

class Watch extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.revealPlayer();
  }

  componentWillUnmount(){
    this.props.stopAndHidePlayer();
  }

  render() {

    return (
      <div className="watch">
      </div>
    );
  }
}

export default Watch;