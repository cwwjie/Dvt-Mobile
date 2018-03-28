import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Carousel, List, Steps, ActionSheet, Modal } from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import onMenuShare from './../../../utils/weixin-onMenuShare';

// 192.168.2.102:8080/Dvt-rent-web/rentItem/2.do
// let data = {"result":"0","message":"Success.","data":{"rentPicture":[{"created":null,"updated":null,"id":2,"title":null,"itemId":2,"picDesc":null,"url":"\\rent\\pic\\D493CA538ED44DD0AF5503E6DD071E86.jpg","thumbUrl":"\\rent\\pic\\thumb/thum_D493CA538ED44DD0AF5503E6DD071E86.jpg","sortOrder":1,"status":1},{"created":null,"updated":null,"id":16,"title":null,"itemId":2,"picDesc":null,"url":"\\rent\\pic\\EFDE984AE48E45799382A7BED685A986.jpg","thumbUrl":"\\rent\\pic\\thumb/thum_EFDE984AE48E45799382A7BED685A986.jpg","sortOrder":0,"status":1}],"rentItem":{"created":1519854438000,"updated":1521793970000,"id":2,"firstPic":"\\rent\\pic\\D493CA538ED44DD0AF5503E6DD071E86.jpg","matchedProduct":"3,4,5","title":"装备1","sellPoint":"装备1","price":20.0,"num":null,"cid":1,"status":1,"clickCount":null,"isNew":1,"itemDesc":"<img src=\"\\rent\\pic\\B42316C5A3494C419B0C0601945BDD1A.jpg\" width=\"1024\" height=\"768\" alt=\"\" />","rental":100.0,"deposit":2000.0,"code":"dsfafsdf"},"matchedProducts":[{"created":1522115425000,"updated":null,"id":3,"productName":"安心保障维修费用70%","rental":60.0,"price":0.0},{"created":1522115461000,"updated":null,"id":4,"productName":"gopro潜水镜","rental":20.0,"price":300.0},{"created":1522115509000,"updated":null,"id":5,"productName":"gopro头带","rental":20.0,"price":100.0}]},"date":"2018-03-27T17:01:18.668+08:00"};

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
      'carousel': [{'src': null, 'width': null}],
      'equipmentItem': {
        'name': 'GoPro运动摄像机遥控器Smart Remote'
      }
    }

    this.buyWaySheetList = ['快递', '度假村自取', '潜游时光公司自取', '取消'];
  }

  jumpToShoppingCart() {
    localStorage.setItem('EquipmentDetailURL', '/equipment/detail'); 
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
    this.props.dispatch({ 
      'type': 'cart/addEquipment', 
      'equipmentItem': this.state.equipmentItem
    });

    Modal.alert('添加成功', <div>恭喜你,成功添加至购物车.</div>, [
      { 'text': '查看购物车', 'onPress': _this.jumpToShoppingCart.bind(this), 'style': {'color': '#108ee9'} },
      { 'text': '返回', 'style': {'color': '#000'} }
    ]);
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

        <div className="Equipment-buyWaySheet">
        </div>

        <div className='detail-bottom'>
          <div className='bottom-left'>
            <div>
              <span>¥ </span> 7500 <span>.00 起</span>
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
})

export default connect(mapStateToProps)(EquipmentDetail);
