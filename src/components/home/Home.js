import React, { Component } from 'react';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  componentDidMount(){
    this.props.actions.testAction();
  }

  render() {

    return (
      <div className="home">
      I am a boring home page!
      </div>
    );
  }
}

export default Home;