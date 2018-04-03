import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { 
  Toast, Carousel, List, 
  Checkbox, Steps, ActionSheet, 
  Modal, Stepper, DatePicker 
} from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import onMenuShare from './../../../utils/weixin-onMenuShare';
import cookies from './../../../utils/cookies';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
let wrapProps;
if (new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}

class EquipmentDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carousel: [{'src': null, 'width': null}],

      rentTime: new Date(),
      endTime: new Date(Date.parse(new Date()) + ( 86400000 * 5 ) ),

      selector: { // 选择产品数量
        num: 1,
        max: false
      },

      equipmentItem: {
        // "created": 1519854438000,
        // "updated": 1521793970000,
        // "id": 2,
        // "firstPic": "\\rent\\pic\\D493CA538ED44DD0AF5503E6DD071E86.jpg",
        // "matchedProduct": "3,4,5",
        // "title": "装备1",
        // "sellPoint": "装备1",
        // "price": 20.0,
        // "num": null,
        // "cid": 1,
        // "status": 1,
        // "clickCount": null,
        // "isNew": 1,
        // "itemDesc": "<img src=\"\\rent\\pic\\B42316C5A3494C419B0C0601945BDD1A.jpg\" width=\"1024\" height=\"768\" alt=\"\" />",
        // "rental": 100.0,
        // "deposit": 2000.0,
        // "code": "dsfafsdf"
      },

      targetMatchedProducts: { // productName === '安心保障维修费用70%' 默认必选
        // "productName": "安心保障维修费用70%",
        // "id": 3,
        // "created": 1522115425000,
        // "updated": null,
        // "rental": 60.0,
        // "price": 0.0
      },

      matchedProducts: [ 
        // {
        //   "isSelected": true,

        //   "productName": "安心保障维修费用70%",
        //   "id": 3,
        //   "created": 1522115425000,
        //   "updated": null,
        //   "rental": 60.0,
        //   "price": 0.0
        // }
      ]
    }

    this.buyWaySheetList = ['快递', '度假村自取', '潜游时光公司自取', '取消'];
    this.rentItemId = parseInt(window.location.hash.substring(30, window.location.hash.length));
  }

  componentDidMount() {
    const _this = this;

    this.getRentItem().then(val=> {
      let matchedProducts = _this.initMatchedProducts(val.matchedProducts);
      
      _this.setState({
        carousel: val.rentPicture.map(picture => ({
          'src': `${config.URLbase}${picture.url}`, 'width': document.body.clientWidth
        })),
        equipmentItem: val.rentItem,
        targetMatchedProducts: matchedProducts.target,
        matchedProducts: matchedProducts.list
      });
    });
  }

  initMatchedProducts(value) {
    let products = {
      target: null,
      list: []
    };

    if (value.length !== 0) {
      for (let i = 0; i < value.length; i++) {
        let valList = value[i];
        valList.isSelected = false;

        if (value[i].productName === '安心保障维修费用70%') {
          products.target = valList;
        } else {
          products.list.push(valList);
        }
      }
    }

    return products;
  }

  getRentItem() {
    return new Promise((resolve, reject) => {
      fetch(`${config.URLbase}/Dvt-rent-web/rentItem/${this.rentItemId}.do`, {
        method: 'GET',
        contentType: 'application/json; charset=utf-8'
      }).then(
        response => response.json(),
        error => ({result: '1', message: error})
      ).then(val => {
        if (val.result === '0') {
          resolve(val.data);
        } else {
          reject(Modal.alert('请求出错', `向服务器发起请求度假村直定信息失败, 原因: ${val.message}`));
        }
      }).catch(error => reject(Modal.alert('请求出错', `向服务器发起请求度假村直定信息失败, 原因: ${error}`)));
    });
  }

  jumpToShoppingCart() {
    localStorage.setItem('EquipmentDetailURL', window.location.hash.substring(1, window.location.hash.length)); 
    this.props.dispatch(routerRedux.push('/user/cart/index'));
  }

  addToShoppingCartAction() {
    const shoppingCartList = this.props.shoppingCartList;

    if (shoppingCartList.length === 0) {
      this.showBuyWaySheet();
    } else {
      this.dispatchToShoppingCart();
    }
  }

  dispatchToShoppingCart() {
    const _this = this;

    fetch(`${config.URLbase}/Dvt-rent-web/cart.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      },
      body: JSON.stringify({
        userId: 69,
        itemId: 2,
        itemNum: 1,
        rentTime: 1522307369000,
        endTime: 1522566569000,
        matchedProduct: "3",
      })
    }).then(
      response => response.json(),
      error => ({'result': '1', 'message': error})
    ).then(val => {
      console.log(val)
    }).catch(error => {
      Modal.alert('请求出错', `向服务器发起请求度假村直定信息失败, 原因: ${error}`);
    });

    // this.props.dispatch({ 
    //   'type': 'cart/addEquipment', 
    //   'equipmentItem': this.state.equipmentItem
    // });

    // Modal.alert('添加成功', <div>恭喜你,成功添加至购物车.</div>, [
    //   { 'text': '查看购物车', 'onPress': _this.jumpToShoppingCart.bind(this), 'style': {'color': '#108ee9'} },
    //   { 'text': '返回', 'style': {'color': '#000'} }
    // ]);
  }

  rentTimeHandle(val) {
    const _this = this;
    const rentTimeStamp = Date.parse(val);
    const endTimeStamp = Date.parse(this.state.endTime);

    if (rentTimeStamp >= endTimeStamp) {
      const newendTime = new Date(rentTimeStamp + 86400000) 
      this.setState({
        'rentTime': val,
        'endTime': newendTime
      });

      // Toast.loading('正在查询...');
      // this.getResortby(val, newLeaveDate)
      // .then(json => {
      //   if (json.result === '0') {
      //     _this.dealwithResort(json.data);
      //   } else {
      //     Modal.alert('数据有误', `成功请求服务器, 但是度假村直定信息有误， 原因: ${json.message}`);
      //   }
      //   Toast.hide();
      // });
    } else {
      this.setState({
        'rentTime': val
      });
    }
  }

  endTimeHandle(val) {
    const _this = this;

    this.setState({ 'endTime': val });

    // Toast.loading('正在查询...');
    // this.getResortby(this.state.checkInDate, val)
    // .then(json => {
    //   if (json.result === '0') {
    //     _this.dealwithResort(json.data);
    //   } else {
    //     alert('度假村直定信息加载失败，原因:' + json.message)
    //   }
    //   Toast.hide();
    // });
  }

  showBuyWaySheet() {
    const _this = this;
    const cancelButtonIndex = this.buyWaySheetList.length - 1;

    ActionSheet.showActionSheetWithOptions({
      'options': this.buyWaySheetList,
      'cancelButtonIndex': cancelButtonIndex,
      'title': '请选择收货方式',
      'maskClosable': true,
      'data-seed': 'logId',
      wrapProps,
    }, buttonIndex => {
      if (cancelButtonIndex !== buttonIndex) {
        _this.props.dispatch({ 
          'type': 'cart/changeBuyWay', 
          'buyWay': _this.buyWaySheetList[buttonIndex]
        });
        _this.dispatchToShoppingCart();
      }
    });
  }

  renderEquipmentHeader() {
    return (
      <div className="main-header">
        <div className="header-tiltle">
          {this.state.equipmentItem ? this.state.equipmentItem.title : null }
        </div>
        <div className="header-sellPoint">
          {this.state.equipmentItem ? this.state.equipmentItem.sellPoint : null }
        </div>
      </div>
    )
  }

  matchedProductHandle(event, key) {
    let newMatchedProducts = this.state.matchedProducts.concat([]);

    newMatchedProducts[key].isSelected = event.target.checked;

    this.setState({matchedProducts: newMatchedProducts});
  }

  renderMatchedProducts() {
    let matchedProducts = this.state.matchedProducts;
    let targetMatchedProducts = this.state.targetMatchedProducts;

    if (matchedProducts.length !== 0) {
      return (
        <div className="main-matchedProducts">
          {targetMatchedProducts ? (
            <List renderHeader={() => '搭配产品'}>
              <CheckboxItem checked={true}>安心保障维修费用70%</CheckboxItem>
            </List>
          ) : null}

          <div className="equipmentdetail-line" />

          <List renderHeader={() => '选配产品'}>
            {matchedProducts.map((val, key) => (
              <CheckboxItem 
                key={key} 
                checked={val.isSelected}
                onChange={(event) => this.matchedProductHandle(event, key)}
              >
                {val.productName}
              </CheckboxItem>
            ))}
          </List>
          <div className="equipmentdetail-line" />
        </div>
      );
    }
  }

  renderProductsDetail() {
    let equipmentItem = this.state.equipmentItem;

    if (equipmentItem.itemDesc) {
      return (
        <div>
          <List renderHeader={() => '产品详情'}>
            <div className="main-itemdesc">
              <div dangerouslySetInnerHTML={{__html: equipmentItem.itemDesc}} />
            </div>
          </List>
          <div className="equipmentdetail-line" />
        </div>
      )
    }
  }

  selectorHandle(val) {
    let selector = this.state.selector;
    selector.num = val;

    this.setState({selector: selector});
  }

  renderSelector() {
    return (
      <div className="main-selector">
        <List>
            <List.Item
              wrap
              extra={
                <Stepper
                  style={{ width: '100%', minWidth: '100px' }}
                  showNumber
                  max={10}
                  min={1}
                  value={this.state.selector.num}
                  onChange={this.selectorHandle.bind(this)}
                />}
            >已选数量
            </List.Item>
        </List>
        <div className="equipmentdetail-line" />
      </div>
    )
  }

  renderRentTime() {
    return (
      <div className="main-rentTime">
        <List renderHeader={() => '租赁日期'}>
          <DatePicker
            mode="date"
            title="入住日期"
            minDate={new Date()}
            value={this.state.rentTime}
            onChange={this.rentTimeHandle.bind(this)}
          >
            <List.Item arrow="horizontal">租赁日期</List.Item>
          </DatePicker>
          <div className="equipmentdetail-line" />
          <DatePicker
            mode="date"
            title="退房日期"
            minDate={new Date(Date.parse(this.state.rentTime) + (86400000 * 5) )}
            value={this.state.endTime}
            onChange={this.endTimeHandle.bind(this)}
          >
            <List.Item arrow="horizontal">退还日期</List.Item>
          </DatePicker>
        </List>
        <div className="equipmentdetail-line" />
      </div>
    )
  }

  render() {
    const _this = this;
    const imgCarouselStyle = {
      'height': document.body.clientWidth * 950 / 1280,
      'width': '100%',
      'verticalAlign': 'top'
    };

    return (
      <div className="EquipmentDetail">
        <MyNavBar
          navName='产品详情'
          returnURL='/equipment/index'
        />

        <Carousel autoplay={true} infinite selectedIndex={0}>{this.state.carousel.map(data => (
          <div key={data}>
            <img
              style={imgCarouselStyle}
              src={data.src}
              onLoad={() => { window.dispatchEvent(new Event('resize')); this.setState({ imgHeight: 'auto' }); }}
            />
          </div>
        ))}</Carousel>

        <div className="equipment-products">

          {/* 产品描述信息 */}
          {this.renderEquipmentHeader()}

          {/* 选择租借日期 */}
          {this.renderRentTime()}

          {/* 选择搭配选配产品 */}
          {this.renderMatchedProducts()}

          {/* 选择搭配选配产品 */}
          {this.renderSelector()}

          {/* 产品详情 */}
          {this.renderProductsDetail()}

        </div>

        <div style={{height: '75px'}}/>
        <div className='detail-bottom'>
          <div className='bottom-left'>
            <div>
              <span>¥ </span> {this.state.equipmentItem ? this.state.equipmentItem.price : null }<span>.00 起</span>
            </div>
          </div>
          <div className='bottom-mid'
            onClick={this.addToShoppingCartAction.bind(this)}
          >加入购物车</div>
          <div className='bottom-right'
            onClick={this.jumpToShoppingCart.bind(this)}
          >我的购物车</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  'buyWay': state.cart.buyWay,
  'shoppingCartList': state.cart.shoppingCartList,
  'userId': state.user.userId,
});

export default connect(mapStateToProps)(EquipmentDetail);
