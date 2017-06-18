import { connect } from 'react-redux'
import React, {Component} from 'react';

import { TabBar , NavBar , Icon } from 'antd-mobile';

import assign from 'lodash.assign'
import Homesvg from './Home.svg';
import Home_hover from './Home_hover.svg';
import Servicesvg from './Service.svg';
import Service_hover from './Service_hover.svg';
import Ordersvg from './Order.svg';
import Order_hover from './Order_hover.svg';
import Mesvg from './Me.svg';
import Me_hover from './Me_hover.svg';
import logo from './logo.png';

import cookie from './../cookie.js';
import appConfig from './../../config/index.js';



class Nav extends Component {

  constructor(props, context) {
    super(props,context);
    this.state = {};
  }
  // 初始化 state
  componentWillMount(){
    const _this = this
    let _data = assign({},_this.props.Nav);
    _this.setState(_this.props.Nav)
    // 如果 URL 不是 '/' '/Cus' "/village" '/Cent' 隐藏       - 暂时过滤这几个
    if (_this.props.routing.pathname != '/' && _this.props.routing.pathname != '/Cus' && _this.props.routing.pathname != '/village' && _this.props.routing.pathname != '/Cent' ) {
      _this.setState({
        hidden:true
      })
    }else {
      if (_this.props.routing.pathname == '/Cus') {
        _data.navtitle = ['客服中心'];
        _data.selectedTab ='Service';
      }else if (_this.props.routing.pathname == '/village') {
        _data.navtitle = ['度假村直订'];
        _data.selectedTab ='Order';
      }else if (_this.props.routing.pathname == '/Cent') {
        _data.navtitle = ['个人中心'];
        _data.selectedTab ='Me';
      }
    }
    // 登录 特殊过滤
    if (_this.props.routing.pathname == '/Cent/login' ) {
      _this.setState({
        hidden:false,
        selectedTab: 'Me'
      })
    }
    // 判断登录  删除后将不进行判断
    if ( cookie.getItem('token')!=null && cookie.getItem('digest')!=null ) {
      _data.RightContent = 'successful';
    }
    _this.props.dispatch({
      type:'Chan_Nav',
      data:_data
    })
  }
  // 接收 redux state
  componentWillReceiveProps(nextProps) {
    const _this = this
    this.setState(nextProps.Nav)
    // 如果 URL 不是 '/' '/village' "/village" '/Cent' 隐藏       - 暂时过滤这几个
    if (this.props.routing.pathname != '/' && this.props.routing.pathname != '/Cus' && this.props.routing.pathname != '/village' && this.props.routing.pathname != '/Cent' ) {
      this.setState({
        hidden:true
      })
    }
    // 登录 特殊过滤
    if (_this.props.routing.pathname == '/Cent/login' ) {
      _this.setState({
        hidden:false,
        selectedTab: 'Me'
      })
    }
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
        <div style={{color:'#888'}} onClick={function(){
          // 页面跳转
          let _this = this
          let _data = assign({},_this.props.Nav);

          _data.navtitle.push('用户登录');
          _data.PreURL.push('/Cent/login');
          _data.leftContent={
            return:'left',
            logo:false
          };

          _this.props.dispatch({
            type:'Chan_Nav',
            data:_data
          });
          _this.context.router.push('/Cent/login');
        }.bind(this)}>登录</div>
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
          onClick={function(){
            // 页面跳转
            let _this = this
            let _data = assign({},_this.props.Nav);

            _data.navtitle=['个人中心'];
            _data.PreURL=['/Cent'];
            _data.leftContent={
              return:false,
              logo:"home"
            };
            _data.selectedTab='Me';

            _this.props.dispatch({
              type:'Chan_Nav',
              data:_data
            });

            _this.context.router.push('/Cent');

          }.bind(this)}
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
              // 如果 PreURL 堆栈为 1 ，那么
              if (this.state.PreURL.length == 1) {

                // 如果不是 Home 则 返回 Home 首页
                if (this.state.PreURL != ['/']) {
                  let _data = assign({},this.state);
                  _data.PreURL = ['/'];
                  _data.selectedTab = 'Home';
                  _data.navtitle = ['潜游时光'];
                  _data.leftContent = {
                    return:false,
                    logo:'home'
                  };
                  _data.hidden = false;
                  this.props.dispatch({type:'Chan_Nav',data:_data});
                  this.context.router.push('/');
                }

              }else if (this.state.PreURL.length == 2) {

                // 如果 PreURL 堆栈为 2 ，那么点击这里返回上一页,并且显示 下方导航
                let _data = assign({},this.state);
                let _Url = this.state.PreURL[(_data.PreURL.length-2)]
                _data.PreURL.pop();
                _data.navtitle.pop();
                _data.leftContent = {
                  return:false,
                  logo:'home'
                };
                _data.hidden = false;
                this.props.dispatch({type:'Chan_Nav',data:_data})
                this.context.router.push(_Url);

              }else {

                // 如果 PreURL 堆栈为 2以上，那么点击这里返回上一页
                let _data = assign({},this.state);
                let _Url = this.state.PreURL[(_data.PreURL.length-2)]
                _data.PreURL.pop();
                _data.navtitle.pop();
                this.props.dispatch({type:'Chan_Nav',data:_data})
                this.context.router.push(_Url);

              }
            }}
            iconName={this.state.leftContent.return}
            leftContent={[this.renderleftContent(this.state.leftContent.logo)]}
            rightContent={[this.renderRightContent(this.state.RightContent)]}
          >
          {this.state.navtitle[(this.state.navtitle.length - 1)]}
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
              _data.navtitle = ['潜游时光'];
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
            icon={
              <div style={{
                margin:'0px 0px 0px 7.5px',
                width: '0.44rem',
                height: '0.44rem',
                background: 'url('+Ordersvg+') center center /  0.42rem 0.42rem no-repeat' }}
              />
            }
            selectedIcon={
              <div style={{
                margin:'0px 0px 0px 7.5px',
                width: '0.44rem',
                height: '0.44rem',
                background: 'url('+Order_hover+') center center /  0.42rem 0.42rem no-repeat' }}
              />
            }
            title="度假村"
            key="度假村"
            dot
            selected={this.state.selectedTab === 'Order'}
            onPress={() => {
              let _data = this.state;
              _data.PreURL = ['/village'];
              _data.navtitle = ['度假村直订'];
              _data.selectedTab = 'Order';
              _data.leftContent = {
                return:false,
                logo:'home'
              };
              this.props.dispatch({type:'Chan_Nav',data:_data})
              this.context.router.push('/village');
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
              _data.PreURL = ['/Cus'];
              _data.navtitle = ['客服中心'];
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
              _data.PreURL = ['/Cent'];
              _data.selectedTab = 'Me';
              _data.navtitle = ['个人中心'];
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