import { connect } from 'react-redux'
import React, {Component} from 'react';

import appConfig from './../../../config/index.js';
import cookie from './../../../method/cookie.js';

class Orderfilter extends Component {
  constructor(props, context) {
    super(props,context);
    this.state = {};
  }
  componentWillMount(){
    const _this = this;
    // 获取所有订单
    if (_this.props.Order.state == 0) {
      fetch(
        appConfig.getOrder,{
        method: "GET",
        contentType: "application/json; charset=utf-8",
        headers:{
          token:cookie.getItem('token'),
          digest:cookie.getItem('digest')
        }
       }).then(function(response) {
        return response.json()
       }).then(function(json) {
        if (json.result=="0") {
          _this.props.dispatch({
            type:'Chan_Order',
            data:json.data
          })
        }else {
          alert("获取所有订单失败");
        }
      })
    }
  }
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  Order:state.reducer.Order
})


export default Orderfilter = connect(
  mapStateToProps
)(Orderfilter)

















