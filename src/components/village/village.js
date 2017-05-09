import { connect } from 'react-redux'
import React, {Component} from 'react';

import {  } from 'antd-mobile';


class village extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {};
  }
  render() {
    return (
      <div>
        villagevillagevillagevillage
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  routing:state.routing.locationBeforeTransitions
})


export default village = connect(
  mapStateToProps
)(village)
