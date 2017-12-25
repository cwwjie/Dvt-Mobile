import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

class SwitchBolck extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="User-SwitchBolck">
        {this.props.isFirstActive ?
          <div className="SwitchBolck-content">
            <div className="SwitchBolck-left-active">{this.props.firstName}</div>
            <div 
              className="SwitchBolck-right"
              onClick={() => this.props.dispatch(routerRedux.push(this.props.jumpToUrl))}
            >{this.props.otherName}</div>
          </div>:
          <div className="SwitchBolck-content">
            <div 
              onClick={() => this.props.dispatch(routerRedux.push(this.props.jumpToUrl))}
              className="SwitchBolck-left"
            >{this.props.firstName}</div>
            <div className="SwitchBolck-right-active">{this.props.otherName}</div>
          </div>
        }
      </div>
    )
  }
}

export default connect()(SwitchBolck);
