import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SwitchBolck from './../../../components/UserSame/SwitchBolck';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import { Toast, Modal } from 'antd-mobile';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const _this = this;

    return (
      <div className="Order-taobao">
        <MyNavBar
          navName='淘宝订单'
          returnURL='/user/index'
        />

        <SwitchBolck
          isFirstActive={false}
          firstName='商城订单'
          otherName='淘宝订单'
          jumpToUrl='/user/order/index'
        />

      </div>
    )
  }
}

export default ShoppingCart;
