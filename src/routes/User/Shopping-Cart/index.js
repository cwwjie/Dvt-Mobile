import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import checkboxMarked from './../../../assets/checkbox-marked-circle.svg';

import { Toast, WhiteSpace, List, Modal } from 'antd-mobile';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'selectAll': false
    }
  }
  
  render() {
    return (
      <div className="ShoppingCart">
        <MyNavBar
          navName='我的购物车'
          returnURL={'/user/index'}
        />

        <div>
        </div>

        <div className="ShoppingCart-bottom">
          <div className="bottom-select">

            <div className="select-SVG" onClick={() => this.setState({'selectAll': !this.state.selectAll})}>
              <CheckboxSVG isChecked={this.state.selectAll} />
            </div>
            <div>全选</div>
          </div>

          <div className="bottom-description">
            <div className="description-content">
              <div className="description-main">合计: <span>￥1500.00</span></div>
              <div className="description-deputy">押金: ￥1000 运费:￥14</div>
            </div>
          </div>

          <div className="bottom-submit">结算</div>
        </div>
      </div>
    )
  }
}

class CheckboxSVG extends Component {
  render() {
    return (
      <div className="checkboxSVG" onClick={() => this.props.clickon ? this.props.clickon() : null}>
        {this.props.isChecked ? (
          <img src={checkboxMarked} />
        ) : (
          <div className="checkboxSVG-content"></div>
        )}
      </div>
    )
  }
}

export default ShoppingCart;
