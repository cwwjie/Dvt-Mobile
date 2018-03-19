import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SoldOut from './../../../assets/SoldOut.png';
import checkboxMarked from './../../../assets/checkbox-marked-circle.svg';

import { Stepper, Modal } from 'antd-mobile';

class ShoppingCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'selectAll': false,
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

  selectItem(id) {
    this.props.dispatch({ 
      'type': 'cart/selectEquipment', 
      'id': id
    });
  }

  selectAllItem() {
    this.props.dispatch({'type': 'cart/selectAllEquipment'});
  }

  deleteItem(id) {
    const _this = this;

    Modal.alert('删除', <div>你确定要删除吗?</div>, [
      {'text': '确定', 'style': {'color': '#F56C6C'}, 'onPress': () => {
        _this.props.dispatch({ 
          'type': 'cart/deleteEquipment', 
          'id': id
        });
      }},
      { 'text': '取消', 'style': {'color': '#108ee9'} }
    ]);
  }

  renderShoppingCartItem() {
    const _this = this;

    return (
      <div className="ShoppingCart-list"> 
        {this.props.shoppingCartList.map((val, key) => (
          <div className={ val.inventory ? "ShoppingCart-item" : "ShoppingCart-item ShoppingCart-isSoldOut"} key={key}>

            <div className="item-select">
              {val.inventory ? (
                <CheckboxSVG 
                  isChecked={val.isSelected}
                  clickon={() => _this.selectItem(key)}
                />
              ): (
                <CheckboxSVG isChecked={false} />
              )}
            </div>

            <div className="item-info">
              <div className="item-description">
                {val.inventory ? null : (
                  <div className="description-soldout">
                    <img src={SoldOut} />
                  </div>
                )}
                <div className="description-picture">
                  <img src={val.img} />
                </div>
                <div className="description-main">
                  <div className="description-main-content">
                    <div className="description-title">{val.name}</div>
                    <div className="description-date">收寄日期：2018-03-19,2018-03-28</div>
                    <div className="description-other">
                      <div className="description-deposit">押金: ￥50.00</div>
                      <div className="description-logistic">{_this.props.buyWay} ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item-operate">
                <div className="operate-stepper">
                  <div className="stepper-price">￥89<span>.00</span></div>
                  <div className="stepper-operate">
                    <Stepper
                      style={{ 'width': '100%', 'minWidth': '100px' }}
                      showNumber
                      max={val.inventory ? val.inventory : 1}
                      min={1}
                      value={val.count}
                      onChange={() => console.log(1)}
                    />
                  </div>
                </div>
                <div className="operate-delete"
                  onClick={() => _this.deleteItem(key)}
                >删除</div>
              </div>
            </div>

          </div>
        ))}
      </div>);
  }
  
  render() {
    return (
      <div className="ShoppingCart">
        <MyNavBar
          navName='我的购物车'
          returnURL={this.returnedUrl}
        />

        {this.renderShoppingCartItem()}

        <div style={{'height': '75px'}}/>
        <div className="ShoppingCart-bottom">
          <div className="bottom-select">

            <div className="select-SVG" onClick={this.selectAllItem.bind(this)}>
              <CheckboxSVG isChecked={this.props.isSelectAll} />
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
  checkboxClick() {
    if (this.props.clickon) {
      this.props.clickon();
    }
  }

  render() {
    return (
      <div className="checkboxSVG" onClick={this.checkboxClick.bind(this)}>
        {this.props.isChecked ? (
          <img src={checkboxMarked} />
        ) : (
          <div className="checkboxSVG-content"></div>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  'buyWay': state.cart.buyWay,
  'startLease': state.cart.startLease,
  'returnLease': state.cart.returnLease,
  'isSelectAll': state.cart.isSelectAll,
  'shoppingCartList': state.cart.shoppingCartList,
});

export default connect(mapStateToProps)(ShoppingCart);
