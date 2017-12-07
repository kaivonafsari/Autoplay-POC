import React, { Component } from 'react';

class Watch extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.actions.storePlayerVisible(true);
    this.props.actions.testAction();
  }

  componentWillUnmount(){
    this.props.actions.storePlayerVisible(false);
  }

  render() {

    return (
      <div className="watch">
      </div>
    );
  }
}

export default Watch;