import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { 
  Toast, Carousel, List, 
  Checkbox, Steps, ActionSheet, 
  Modal, Stepper, DatePicker,
  Picker
} from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import convertDate from './../../../utils/convertDate';
import ajaxs from './ajaxs';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;
let wrapProps;
if (new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent)) {
  wrapProps = {
    onTouchStart: e => e.preventDefault(),
  };
}
const imgCarouselStyle = {
  'height': document.body.clientWidth * 950 / 1280,
  'width': '100%',
  'verticalAlign': 'top'
};
const minTimeInterval = 86400000 * 5;

class EquipmentDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      carousel: [{'src': null, 'width': null}],

      rentTime: new Date(),
      endTime: new Date(Date.parse(new Date()) + minTimeInterval),
      
      selector: { // 选择产品数量
        num: 1,
        max: false
      },

      rentSize: { // 选择产品尺寸
        isSucceed: false,
        data: [ null ],
        list: [
          // {
          //   value: 'XL',
          //   label: 'XL',
          // }
        ]
      },

      rentColor: { // 选择产品颜色
        isSucceed: false,
        data: [ null ],
        list: []
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

    this.buyWaySheetList = ['快递', '潜游时光公司自取', '取消'];
    this.rentItemId = parseInt(window.location.hash.substring(30, window.location.hash.length));
    this.jumpTo.bind(this);
  }

  // 初始化数据
  componentDidMount() {
    const _this = this;
    const initProducts = value => { // 初始化产品数据 的方法
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

    // 初始化产品数据
    ajaxs.getRentItembyId(this.rentItemId)
    .then(val => {
      let matchedProducts = initProducts(val.matchedProducts);
      
      _this.setState({
        carousel: val.rentPicture.map(picture => ({
          'src': `${config.URLbase}${picture.url}`, 'width': document.body.clientWidth
        })),
        equipmentItem: val.rentItem,
        targetMatchedProducts: matchedProducts.target,
        matchedProducts: matchedProducts.list
      });
    }, error => Modal.alert('请求出错', `向服务器发起请求度设备详情信息失败, 原因: ${error}`));

    // 初始化产品尺寸
    ajaxs.getRentSizebyId(this.rentItemId)
    .then(val => {
      if (val.length !== 0) {
        _this.setState({
          rentSize: {
            isSucceed: true,
            data: '',
            list: val.map(size => ({
              value: size,
              label: size
            }))
          }
        });
      }
    }, error => Modal.alert('请求出错', `向服务器发起请求度设备尺寸信息失败, 原因: ${error}`));

    // 初始化产品颜色
    ajaxs.getRentColorbyId(this.rentItemId)
    .then(val => {
      if (val.length !== 0) {
        let colorList = {
          black: '黑色',
          while: '白色',
          grey: '灰色',
          red: '红色',
          yellow: '黄色',
          blue: '蓝色',
          green: '绿色',
          purple: '紫色',
        }

        _this.setState({
          rentColor: {
            isSucceed: true,
            data: '',
            list: val.map(color => ({
              value: color,
              label: colorList[color] ? colorList[color] : color,
            }))
          }
        });
      }
    }, error => Modal.alert('请求出错', `向服务器发起请求度设备颜色信息失败, 原因: ${error}`));

    // 查询产品库存
    this.findInventory();
  }

  // 加入 购物车
  addToCart() {
    const _this = this;
    const shoppingCartList = this.props.shoppingCartList;
    const itemSize = this.state.rentSize.data;
    const itemColor = this.state.rentColor.data;
    const targetMatchedProducts = this.state.targetMatchedProducts;
    const matchedProducts = this.state.matchedProducts;
    const initMatchedProduct = () => {
      let data = [];
      data.push(targetMatchedProducts.id);

      matchedProducts.map(val => {
        if (val.isSelected) {
          data.push(val.id);
        }
        
        return val
      });

      return data.join(',');
    }
    const showBuyWaySheet = () => {
      const cancelButtonIndex = this.buyWaySheetList.length - 1;
  
      return new Promise((resolve, reject) => {
        // 如果购物车列表为空 则选择 收货方式
        if (shoppingCartList.length === 0) {
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
              resolve();
            }
          });
        } else {
          resolve();
        }
      });
    }
    
    if (!this.props.isLogin) {
      return Modal.alert('请登录', '你尚未登录, 暂不能将此产品加入购物车!!', [
        {
          text: '取消',
          style: 'default'
        }, {
          text: '登录',
          onPress: () => _this.props.dispatch(routerRedux.push('/user/login')),
          style: 'default'
        }
      ]);
    }

    if (!this.state.selector.max) {
      return alert('此日期暂时无货, 请选择其他时间点。');
    }

    let rentItem = {
      userId: this.props.userId,
      itemId: this.rentItemId,
      itemNum: this.state.selector.num,
      rentDate: convertDate.dateToYYYYmmNumber(this.state.rentTime),
      endDate: convertDate.dateToYYYYmmNumber(this.state.endTime),
      matchedProduct: initMatchedProduct(),
      itemSize: itemSize[0] || null,
      itemColor: itemColor[0] || null,
    }

    showBuyWaySheet().then(buttonIndex => {

      ajaxs.addRentItemToCart(rentItem)
      .then(val=> {

        Modal.alert(
          '添加成功', 
          (<div>恭喜你,成功添加至购物车.</div>), 
          [
            { 
              'text': '查看购物车', 
              'onPress': () => _this.jumpTo('ShoppingCart'), 
              'style': {'color': '#108ee9'} 
            }, { 
              'text': '返回', 
              'style': {'color': '#000'} 
            }
          ]
        );

      }, error => alert(error));
    })
  }

  // 查看 库存 
  findInventory(rentTime, endTime) {
    const _this = this;
    let selector = this.state.selector;
    let itemSize = this.state.rentSize.data;
    let itemColor = this.state.rentColor.data;

    let condition = {
      itemId: this.rentItemId,
      skuNum: this.state.selector.num,
      rentDate: convertDate.dateToYYYYmmNumber(rentTime || this.state.rentTime),
      endDate: convertDate.dateToYYYYmmNumber(endTime || this.state.endTime),
      itemSize: itemSize[0] || null,
      itemColor: itemColor[0] || null,
    }

    Toast.loading('正在查询...');
    ajaxs.findItemSku(condition)
    .then(val => {
      selector.max = val;
      _this.setState({selector: selector}, () => Toast.hide());
    }, error => alert(error));
  }

  // 跳转
  jumpTo(url) {
    if (url === 'ShoppingCart') {
      localStorage.setItem('EquipmentDetailURL', window.location.hash.substring(1, window.location.hash.length)); 
      this.props.dispatch(routerRedux.push('/user/cart/index'));
    }
  }

  // 加入购物车
  addToShoppingCartAction() {
    const _this = this;
    const shoppingCartList = this.props.shoppingCartList;

    const showBuyWaySheet = () => {
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

    if (shoppingCartList.length === 0) {
      showBuyWaySheet();
    } else {
      this.dispatchToShoppingCart();
    }
  }

  // 渲染 租借日期
  renderRentTime() {
    const _this = this;
    const maxStepper = this.state.selector.max;

    const rentTimeHandle = val => {
      const selectedTimeStamp = Date.parse(val);
      const endTimeStamp = Date.parse(this.state.endTime);
      const newendTime = selectedTimeStamp + minTimeInterval;

      // 新时间 必须大于 结束时间
      if (newendTime >= endTimeStamp) {

        this.setState({
          'rentTime': val,
          'endTime': new Date(newendTime)
        });
        this.findInventory(val, new Date(newendTime));
      } else {

        this.setState({
          'rentTime': val
        });
        this.findInventory(val, this.state.endTime);
      }
    }

    const endTimeHandle = val => {
      this.setState({ 'endTime': val });
      this.findInventory(this.state.rentTime, val);
    }

    return (
      <div className={ maxStepper ? "main-rentTime" : "main-rentTime outStock"}>
        <List renderHeader={() => `${ maxStepper ? '租还日期' : '此日期暂时无货, 请选择其他时间。'}`}>
          <DatePicker
            mode="date"
            title="租赁日期"
            minDate={new Date()}
            value={this.state.rentTime}
            onChange={val => rentTimeHandle(val)}
          >
            <List.Item arrow="horizontal">租赁日期</List.Item>
          </DatePicker>
          <div className="equipmentdetail-line" />
          <DatePicker
            mode="date"
            title="退还日期"
            minDate={new Date(Date.parse(this.state.rentTime) + (86400000 * 5) )}
            value={this.state.endTime}
            onChange={val => endTimeHandle(val)}
          >
            <List.Item arrow="horizontal">退还日期</List.Item>
          </DatePicker>
        </List>
        <div className="equipmentdetail-line" />
      </div>
    )
  }

  // 渲染 产品描述信息
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

  // 渲染 选配产品
  renderMatchedProducts() {
    const _this = this;
    const matchedProducts = this.state.matchedProducts;
    const targetMatchedProducts = this.state.targetMatchedProducts;
    const matchedProductHandle = (event, key) => {
      let newMatchedProducts = _this.state.matchedProducts.concat([]);
  
      newMatchedProducts[key].isSelected = event.target.checked;
      this.setState({matchedProducts: newMatchedProducts});
    }

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
                onChange={(event) => matchedProductHandle(event, key)}
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

  // 渲染 产品数量
  renderSelector() {
    const _this = this;
    const maxStepper = this.state.selector.max;
    const selectorHandle = val => {
      let selector = JSON.parse(JSON.stringify(_this.state.selector));
      selector.num = val;
  
      _this.setState({selector: selector});
    }

    if (maxStepper) {
      return (
        <div className="main-selector">
          <List>
              <List.Item
                wrap
                extra={
                  <Stepper
                    style={{ width: '100%', minWidth: '100px' }}
                    showNumber
                    max={maxStepper}
                    min={1}
                    value={this.state.selector.num}
                    onChange={(val) => selectorHandle(val)}
                  />}
              >已选数量
              </List.Item>
          </List>
          <div className="equipmentdetail-line" />
        </div>
      )
    }

  }

  // 渲染 产品详情
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

  // 渲染 选择产品配色
  renderRentColor() {
    const _this = this;

    if (this.state.rentColor.isSucceed === false) {
      return null
    }

    return (
      <div className="equipmentdetail-color">
        <List renderHeader={() => '设备颜色'}>
          <Picker 
            cols={1}
            value={this.state.rentColor.data}
            data={this.state.rentColor.list}
            onChange={val => {
              let rentColor = JSON.parse(JSON.stringify(_this.state.rentColor));
              rentColor.data = val;
              _this.setState({rentColor: rentColor});
            }}
          >
            <List.Item arrow="horizontal">选择设备颜色</List.Item>
          </Picker>
        </List>
        <div className="equipmentdetail-line" />
      </div>
    )
  }

  // 渲染 选择产品尺寸
  renderRentSize() {
    const _this = this;

    if (this.state.rentSize.isSucceed === false) {
      return null
    }

    return (
      <div className="equipmentdetail-size">
        <List renderHeader={() => '设备尺寸'}>
          <Picker 
            cols={1}
            value={this.state.rentSize.data}
            data={this.state.rentSize.list}
            onChange={val => {
              let rentSize = JSON.parse(JSON.stringify(_this.state.rentSize));
              rentSize.data = val;
              _this.setState({rentSize: rentSize});
            }}
          >
            <List.Item arrow="horizontal">选择设备尺寸</List.Item>
          </Picker>
        </List>
        <div className="equipmentdetail-line" />
      </div>
    )
  }

  render() {
    const _this = this;

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

          {/* 选择选配产品 */}
          {this.renderMatchedProducts()}

          {/* 选择产品数量 */}
          {this.renderSelector()}

          {/* 选择产品配色 */}
          {this.renderRentColor()}

          {/* 选择产品尺寸 */}
          {this.renderRentSize()}

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
            onClick={this.addToCart.bind(this)}
          >加入购物车</div>
          <div className='bottom-right'
            onClick={() => this.jumpTo('ShoppingCart')}
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
  'isLogin': state.user.isLogin,
});

export default connect(mapStateToProps)(EquipmentDetail);
