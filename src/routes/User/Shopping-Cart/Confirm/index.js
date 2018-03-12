import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../../components/MyNavBar/index';

import { Toast, WhiteSpace, List, Modal } from 'antd-mobile';

class ShoppingConfirm extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div className="Shopping-confirm">
        <MyNavBar
          navName='确认订单'
          returnURL={'/user/personal/account'}
        />

      </div>
    )
  }
}

export default ShoppingConfirm;
