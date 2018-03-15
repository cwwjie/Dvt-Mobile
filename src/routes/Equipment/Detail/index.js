import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Toast, Carousel, WhiteSpace, List, WingBlank, Steps } from 'antd-mobile';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import onMenuShare from './../../../utils/weixin-onMenuShare';

class EquipmentDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      'carousel': [{'src': null, 'width': null}]
    }
  }

  jumpToShoppingCart() {
    localStorage.setItem('EquipmentDetailURL', '/equipment/detail'); 
    this.props.dispatch(routerRedux.push('/user/cart/index'));
  }

  jumpToShoppingConfirm() {
    this.props.dispatch(routerRedux.push('/user/cart/confirm'));
  }

  componentDidMount() {
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

        <div className='detail-bottom'>
          <div className='bottom-left'>
            <div>
              <span>¥ </span> 7500 <span>.00 起</span>
            </div>
          </div>
          <div className='bottom-mid'
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
  'isLogin': state.user.isLogin
})

export default connect(mapStateToProps)(EquipmentDetail);
