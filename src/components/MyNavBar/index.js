import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import logo from './../../assets/logo.png';
import Mesvg from './../../assets/Me.svg';

import { NavBar, Icon } from 'antd-mobile';

// props: {
//   isLogin: boolean
//   navName: '标题名字'
//   returnURL: '/user/login'
// }

class MyNavBar extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch({ type: 'user/checkLogin' });
  }

  onLeftClick() {
    if (this.props.returnURL) {
      this.props.dispatch(routerRedux.push(this.props.returnURL));
      return
    }

    if (window.location.hash !== '#/') {
      this.props.dispatch(routerRedux.push('/'));
    }
  }

  onRightClick() {
    if (window.location.hash !== '#/user/login') {
      this.props.dispatch(routerRedux.push('/user/login'))
    }
  }

  render() {
    const _this = this;

    const logoIconNode = this.props.returnURL ? <Icon type="left" /> : (
      <div
        style={{
          'width': '60px',
          'height': '23px',
          'background': `url(${logo}) center center /  60px 23px no-repeat`
        }}
      />
    );

    const rightContentNode = this.props.isLogin ? (
      <div 
        style={{
          'width': '23px',
          'height': '23px',
          'background': `url(${Mesvg}) center center /  22px 22px no-repeat`
        }}
      />
    ) : (<div onClick={this.onRightClick.bind(this)}>登录</div>);

    return (
      <div className="NavBar">
        <NavBar
          mode="light"
          onLeftClick={this.onLeftClick.bind(this)}
          icon={logoIconNode}
          rightContent={rightContentNode}
        >{this.props.navName}</NavBar>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isLogin: state.user.isLogin
})

export default connect(mapStateToProps)(MyNavBar);
