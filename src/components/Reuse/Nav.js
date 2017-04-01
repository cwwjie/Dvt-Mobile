import { connect } from 'react-redux'
import React, {Component} from 'react';

import { TabBar , NavBar , Icon } from 'antd-mobile';

import Homesvg from './Home.svg';
import Home_hover from './Home_hover.svg';
import Servicesvg from './Service.svg';
import Service_hover from './Service_hover.svg';
import Ordersvg from './Order.svg';
import Order_hover from './Order_hover.svg';
import Mesvg from './Me.svg';
import Me_hover from './Me_hover.svg';
import logo from './logo.png';



class Nav extends Component {

  constructor(props, context) {
    super(props,context);
    this.state = {};
  }
  // 初始化 state
  componentWillMount(){
    this.setState(this.props.Nav)
  }
  // 接收 redux state
  componentWillReceiveProps(nextProps) {
    this.setState(nextProps.Nav)
  }
  // 渲染左上角logo
  renderleftContent(state) {
    // state = 'home'   时候 渲染 首页logo 表示在首页
    if (state == 'home') {
      return (
        <div style={{
          width: '1.20rem',
          height: '0.46rem',
          background: 'url('+logo+') center center /  1.20rem 0.46rem no-repeat' }}
        />
      );
    // state = false 时候 返回空 this.setState({leftContent: 'left'}); 显示点击
    }else if (state == false) {
      return <div></div>
    }
  }
  // 渲染右上角logo
  renderRightContent(state) {
    // state = 'login'        时候 返回带点击的按钮 表示还未登录
    if (state == 'login'  ) {
      return (
        <div style={{color:'#888'}} onClick={function(){console.log("123")}}>登录</div>
      )
    // state = 'successful'   时候 渲染 人头logo    表示登录成功
    }else if ( state == 'successful' ) {
      return (
        <div
          style={{
            width: '0.44rem',
            height: '0.44rem',
            background: 'url('+Mesvg+') center center /  0.42rem 0.42rem no-repeat'
          }}
          >
        </div>
      );
    }
  }
	render() {
    return (
      <div>
        <header style={this.state.nav}>
          <NavBar
            mode="light"
            onLeftClick={() => {
              if (this.state.PreURL.length == 1) {
                // 如果 PreURL 堆栈为 1 ，那么点击这里返回首页
                let _data = this.state;
                _data.PreURL = ['/'];
                _data.selectedTab = 'Home';
                _data.navtitle = '潜游时光';
                _data.leftContent = {
                  return:false,
                  logo:'home'
                };
                this.props.dispatch({type:'Chan_Nav',data:_data})
                this.context.router.push('/');
              }
            }}
            iconName={this.state.leftContent.return}
            leftContent={[this.renderleftContent(this.state.leftContent.logo)]}
            rightContent={[this.renderRightContent(this.state.RightContent)]}
          >
          {this.state.navtitle}
          </NavBar>
        </header>
        {this.props.children}
        <div style={{height:"49px"}}></div>
        <TabBar
          unselectedTintColor="#949494"
          tintColor="#33A3F4"
          barTintColor="white"
          hidden={this.state.hidden}
          >
          <TabBar.Item
            title="首页"
            key="首页"
            icon={<div style={{
              width: '0.44rem',
              height: '0.44rem',
              background: 'url('+Homesvg+') center center /  0.42rem 0.42rem no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '0.44rem',
              height: '0.44rem',
              background: 'url('+Home_hover+') center center /  0.42rem 0.42rem no-repeat' }}
            />
            }
            selected={this.state.selectedTab === 'Home'}
            badge={0}
            onPress={() => {
              let _data = this.state;
              _data.PreURL = ['/'];
              _data.selectedTab = 'Home';
              _data.navtitle = '潜游时光';
              _data.leftContent = {
                return:false,
                logo:'home'
              };
              this.props.dispatch({type:'Chan_Nav',data:_data})
              this.context.router.push('/');
            }}
            >
          </TabBar.Item>
          <TabBar.Item
            icon={<div style={{
              width: '0.44rem',
              height: '0.44rem',
              background: 'url('+Servicesvg+') center center /  0.42rem 0.42rem no-repeat' }}
            />
            }
            selectedIcon={<div style={{
              width: '0.44rem',
              height: '0.44rem',
              background: 'url('+Service_hover+') center center /  0.42rem 0.42rem no-repeat' }}
            />
            }
            title="客服"
            key="客服"
            badge={0}
            selected={this.state.selectedTab === 'Service'}
            onPress={() => {
              let _data = this.state;
              _data.PreURL = ['/'];
              _data.navtitle = '客服中心';
              _data.selectedTab = 'Service';
              _data.leftContent = {
                return:false,
                logo:'home'
              };
              this.props.dispatch({type:'Chan_Nav',data:_data})
              this.context.router.push('Cus');
            }}
            >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '0.44rem',
                height: '0.44rem',
                background: 'url('+Ordersvg+') center center /  0.42rem 0.42rem no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '0.44rem',
                height: '0.44rem',
                background: 'url('+Order_hover+') center center /  0.42rem 0.42rem no-repeat' }}
              />
            }
            title="订单"
            key="订单"
            dot
            selected={this.state.selectedTab === 'Order'}
            onPress={() => {
              let _data = this.state;
              _data.PreURL = ['/'];
              _data.navtitle = '我的订单';
              _data.selectedTab = 'Order';
              _data.leftContent = {
                return:false,
                logo:'home'
              };
              this.props.dispatch({type:'Chan_Nav',data:_data})
              this.context.router.push('Ord');
            }}
            >
          </TabBar.Item>
          <TabBar.Item
            icon={
              <div style={{
                width: '0.44rem',
                height: '0.44rem',
                background: 'url('+Mesvg+') center center /  0.42rem 0.42rem no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                width: '0.44rem',
                height: '0.44rem',
                background: 'url('+Me_hover+') center center /  0.42rem 0.42rem no-repeat' }}
              />
            }
            title="我的"
            key="我的"
            selected={this.state.selectedTab === 'Me'}
            onPress={() => {
              let _data = this.state;
              _data.PreURL = ['/'];
              _data.selectedTab = 'Me';
              _data.navtitle = '个人中心';
              _data.leftContent = {
                return:false,
                logo:'home'
              };
              this.props.dispatch({type:'Chan_Nav',data:_data})
              this.context.router.push('Cent');
            }}
            >
          </TabBar.Item>
        </TabBar>
      </div>
    );
  }
}

Nav.contextTypes = {
  router: Object
}


const mapStateToProps = (state, ownProps) => ({
  Nav:state.reducer.Nav,
  routing:state.routing.locationBeforeTransitions
})


export default Nav = connect(
  mapStateToProps
)(Nav)