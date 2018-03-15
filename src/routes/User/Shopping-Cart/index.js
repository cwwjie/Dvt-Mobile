import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import checkboxMarked from './../../../assets/checkbox-marked-circle.svg';

import { Stepper } from 'antd-mobile';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'selectAll': false
    }

    this.returnedUrl = this.initReturnedURL();
  }

  initReturnedURL() {
    let returnedUrl = localStorage.getItem('EquipmentDetailURL');
    return returnedUrl ? returnedUrl : '/user/index';
  }

  jumpToConfirm() {
    localStorage.setItem('returnURL', '/user/cart/index'); 
    this.props.dispatch(routerRedux.push('/user/cart/confirm'));
  }

  renderShoppingCartItem() {
    return (
      <div className="ShoppingCart-list">
        <div className="ShoppingCart-item">
          <div className="item-select">
            <CheckboxSVG isChecked={this.state.selectAll} />
          </div>

          <div className="item-info">
            <div className="item-description">
              <div className="description-picture">
                <img src='' />
              </div>
              <div className="description-main">
                <div className="description-main-content">
                  <div className="description-title">GoPro运动摄像机遥控器Smart Remote</div>
                  <div className="description-date">收寄日期：2018-03-19,2018-03-28</div>
                  <div className="description-other">
                    <div className="description-deposit">押金: ￥50.00</div>
                    <div className="description-logistic">物流至北京 ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item-operate">
              <div className="operate-stepper">
                <div className="stepper-price">￥89<span>.00</span></div>
                <div className="stepper-operate">
                  <Stepper
                    style={{ width: '100%', minWidth: '100px' }}
                    showNumber
                    max={10}
                    min={1}
                    value={1}
                    onChange={() => console.log(1)}
                  />
                </div>
              </div>
              <div className="operate-delete">删除</div>
            </div>
          </div>


        </div>

        <div className="ShoppingCart-item">
          <div className="item-select">
            <CheckboxSVG isChecked={this.state.selectAll} />
          </div>

          <div className="item-info">
            <div className="item-description">
              <div className="description-picture">
                <img src='' />
              </div>
              <div className="description-main">
                <div className="description-main-content">
                  <div className="description-title">GoPro运动摄像机遥控器Smart Remote</div>
                  <div className="description-date">收寄日期：2018-03-19,2018-03-28</div>
                  <div className="description-other">
                    <div className="description-deposit">押金: ￥50.00</div>
                    <div className="description-logistic">物流至北京 ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="item-operate">
              <div className="operate-stepper">
                <div className="stepper-price">￥89<span>.00</span></div>
                <div className="stepper-operate">
                  <Stepper
                    style={{ width: '100%', minWidth: '100px' }}
                    showNumber
                    max={10}
                    min={1}
                    value={1}
                    onChange={() => console.log(1)}
                  />
                </div>
              </div>
              <div className="operate-delete">删除</div>
            </div>
          </div>

        </div>
      </div>
    )
  }
  
  render() {
    return (
      <div className="ShoppingCart">
        <MyNavBar
          navName='我的购物车'
          returnURL={this.returnedUrl}
        />

        {this.renderShoppingCartItem()}

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

          <div className="bottom-submit" onClick={this.jumpToConfirm.bind(this)}>结算</div>
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

export default connect()(ShoppingCart);
