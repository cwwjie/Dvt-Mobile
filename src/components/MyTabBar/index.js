import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import Homesvg from './../../assets/Home.svg';
import Home_hover from './../../assets/Home_hover.svg';
import Servicesvg from './../../assets/Service.svg';
import Service_hover from './../../assets/Service_hover.svg';
import Ordersvg from './../../assets/Order.svg';
import Order_hover from './../../assets/Order_hover.svg';
import Mesvg from './../../assets/Me.svg';
import Me_hover from './../../assets/Me_hover.svg';

import { TabBar } from 'antd-mobile';

class MyTabBar extends Component {
  constructor(props) {
    super(props);
  }

  jumpToHome() {
    this.props.dispatch(routerRedux.push('/'));
  }

  jumpToService() {
    this.props.dispatch(routerRedux.push('/service'));
  }

  jumpToUser() {
    if (this.props.isLogin) {
      this.props.dispatch(routerRedux.push('/user/index'));
    } else {
      this.props.dispatch(routerRedux.push('/user/login'));
    }
  }

  render() {
    const myIcon = (svg) => (
      <div style={{
        width: '23px',
        height: '23px',
        background: `url(${svg}) center center /  22px 22px no-repeat` }}
      />
    )

    return (
      <div className="TabBar">
        <div style={{height:"49px"}}></div>
        <div className="TabBar-content">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
            hidden={this.props.isHidden ? true : false}
          >
            <TabBar.Item
              icon={myIcon(Homesvg)}
              selectedIcon={myIcon(Home_hover)}
              title="首页"
              key="首页"
              selected={this.props.selectedTab === 'Home'}
              onPress={this.jumpToHome.bind(this)}
            />
            <TabBar.Item
              icon={myIcon(Ordersvg)}
              selectedIcon={myIcon(Order_hover)}
              title="度假村"
              key="度假村"
              selected={this.props.selectedTab === 'Order'}
              onPress={() => {}}
            />
            <TabBar.Item
              icon={myIcon(Servicesvg)}
              selectedIcon={myIcon(Service_hover)}
              title="客服"
              key="客服"
              selected={this.props.selectedTab === 'Service'}
              onPress={this.jumpToService.bind(this)}
            />
            <TabBar.Item
              icon={myIcon(Mesvg)}
              selectedIcon={myIcon(Me_hover)}
              title="我的"
              key="我的"
              selected={this.props.selectedTab === 'User'}
              onPress={this.jumpToUser.bind(this)}
              >
            </TabBar.Item>
          </TabBar>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLogin: state.user.isLogin
})

export default connect(mapStateToProps)(MyTabBar);
