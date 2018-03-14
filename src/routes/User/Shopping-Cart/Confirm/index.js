import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../../components/MyNavBar/index';

import { Toast, WhiteSpace, List, Modal } from 'antd-mobile';

class ShoppingConfirm extends Component {
  constructor(props) {
    super(props);
    
    this.returnURL = localStorage.getItem('returnURL');
    localStorage.removeItem('returnURL');
  }

  submitJump() {

  }
  
  render() {
    return (
      <div className="Shopping-confirm">
        <MyNavBar
          navName='确认订单'
          returnURL={this.returnURL ? this.returnURL : '/user/cart/index'}
        />

        <div className="confirm-main">

        </div>


        <div style={{'height': '75px'}}></div>
        <div className="confirm-bottom">
          <div className='confirm-earnest'>合计 1000 RMB</div>
          <div className='confirm-jump' onClick={this.submitJump.bind(this)}>确认订单</div>
        </div>
      </div>
    )
  }
}

export default ShoppingConfirm;
