import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';

import config from './../../../config';
import cookies from './../../../utils/cookies';

import SoldOut from './../../../assets/SoldOut.png';
import checkboxMarked from './../../../assets/checkbox-marked-circle.svg';

import { Stepper, Modal, List, ActionSheet, CheckboxItem, WingBlank, WhiteSpace } from 'antd-mobile';

let wrapProps;
if (new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class ShoppingCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'popSelectAddress': false,
      'addressList': [
        // {
        //   'addressId': 1,
        //   'city': 85,
        //   'consignee': "曾杰",
        //   'district': 908,
        //   'mobile': "15976713287",
        //   'province': 7,
        //   'street': "收货地址一",
        //   'telephone': null,
        //   'userId': null,
        //   'zipcode': "123456",
        // }
      ],
      'addressSheetList': [
        // "收货地址一",
      ],
    }

    this.returnedUrl = this.initReturnedURL();
  }

  componentDidMount() {
    const _this = this;

    this.getAddressInfo()
    .then(val => {
      let addressSheetList = [];
      
      if (val) { // 如果 Address 存在
        if (val.length > 0) {
          addressSheetList = val.map(val => val.street);
        }
      }

      addressSheetList.push('新增收货地址');
      addressSheetList.push('取消');

      _this.setState({
        'addressList': val,
        'addressSheetList': addressSheetList,
      });
    });
  }

  getAddressInfo() {
    const _this = this;

    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/user/address/findByUserId.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8',
        'headers': {
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        response => response.json(),
        error => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          resolve(json.data);
        } else {
          reject(Modal.alert('获取旅客信息失败', `请求服务器成功, 但是返回的旅客信息有误! 原因: ${json.message}`));
        }
      }).catch(error => {
        reject(Modal.alert('请求出错', `向服务器发起请求旅客信息失败, 原因: ${error}`));
      });
    });
  }

  initReturnedURL() {
    let returnedUrl = localStorage.getItem('EquipmentDetailURL');
    return returnedUrl ? returnedUrl : '/user/index';
  }

  jumpToConfirm() {
    localStorage.setItem('returnURL', '/user/cart/index'); 
    this.props.dispatch(routerRedux.push('/user/cart/confirm'));
  }

  jumpToEditAddress() {
    localStorage.setItem('Address-Type', 'add');
    localStorage.setItem('Address-edit-returnedUrl', '/user/cart/index'); 
    this.props.dispatch(routerRedux.push('/user/address/edit'));
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

  changeItemCount(count, id) {
    this.props.dispatch({
      'type': 'cart/changeEquipmentCount',
      'count': count,
      'id': id,
    });
  }

  selectAddress(data) {
    this.props.dispatch({ 
      'type': 'cart/changeAddress', 
      'address': data
    });
  }

  showrAddressSheet() {
    const _this = this;
    const addButtonIndex = this.state.addressSheetList.length - 2;
    const cancelButtonIndex = this.state.addressSheetList.length - 1;

    ActionSheet.showActionSheetWithOptions({
      'options': this.state.addressSheetList,
      'cancelButtonIndex': cancelButtonIndex,
      'title': '请选择地址',
      'maskClosable': true,
      'data-seed': 'logId',
      wrapProps,
    }, buttonIndex => {
      if ( buttonIndex === addButtonIndex) {
        _this.jumpToEditAddress();
      }

      if (
        buttonIndex !== addButtonIndex && 
        buttonIndex !== cancelButtonIndex
      ) {
        _this.selectAddress(this.state.addressList[buttonIndex]);
      }
    });

  }

  renderAddress() {
    const _this = this;

    return this.props.buyWay === '快递' ? (
      <div className="ShoppingCart-address">

        <List renderHeader={() => '快递地址(必须提供相应地址)'} className="my-list">
          <List.Item arrow="horizontal"
            extra="选择"
            onClick={this.showrAddressSheet.bind(this)}
          >选择快递信息</List.Item>
          {this.props.address ? (
            <div>
              <List.Item extra={this.props.address.consignee}>收货姓名</List.Item>
              <List.Item extra={this.props.address.street}>详细地址</List.Item>
              <List.Item extra={this.props.address.mobile}>手机号码</List.Item>
            </div>
          ) : null}
        </List>

      </div>
    ) : null;
  }

  renderShoppingCartItem() {
    const _this = this;
    let shoppingCartList = this.props.shoppingCartList ? this.props.shoppingCartList : [];

    return (
      <div className="ShoppingCart-list"> 
        {shoppingCartList.map((val, key) => (
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
                      defaultValue={val.count}
                      value={val.count}
                      onChange={count => _this.changeItemCount(count, key)}
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

        {this.renderShoppingCartItem.call(this)}

        {this.renderAddress.call(this)}

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
  'address': state.cart.address,
  'startLease': state.cart.startLease,
  'returnLease': state.cart.returnLease,
  'isSelectAll': state.cart.isSelectAll,
  'shoppingCartList': state.cart.shoppingCartList,
});

export default connect(mapStateToProps)(ShoppingCart);
