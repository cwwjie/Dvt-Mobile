import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Carousel, List, Steps, ActionSheet, Modal } from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import onMenuShare from './../../../utils/weixin-onMenuShare';

const isIPhone = new RegExp('\\biPhone\\b|\\biPod\\b', 'i').test(window.navigator.userAgent);
let wrapProps;
if (isIPhone) {
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

  componentDidMount() {
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

  hiddenBuyWaySheet() {
    this.setState({'isBuyWaySheetShow': false});
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
