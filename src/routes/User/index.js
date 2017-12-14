import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../components/MyNavBar/index';
import MyTabBar from './../../components/MyTabBar/index';
import config from './../../config';
import cookies from './../../utils/cookies';
import request from './../../utils/request';

import { Toast, WhiteSpace, List } from 'antd-mobile';

const Item = List.Item;

class MyUser extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.chackLogin().then((val) => {
      if (val.result !== "0") {
        this.props.dispatch(routerRedux.push('/user/login'));
      }
    });
  }

  chackLogin() {
    return fetch(`${config.URLversion}/user/getUserInfo.do`, {
      'method': 'GET',
      'contentType': "application/json; charset=utf-8",
      'headers': {
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      }
    }).then(
      response => response.json(),
      error => request.error('请求出错')
    ).catch((error) => request.error('请求出错'));
  }

  signOut() {
    cookies.removeItem('token', "/");
    cookies.removeItem('digest', "/");
    this.props.dispatch(routerRedux.push('/user/login'));
  }

  render() {
    return (
      <div className="User">
        <div className="User-main">
          <MyNavBar
            navName='用户中心'
          />

          <WhiteSpace size="lg" />
          <List>
            <Item multipleLine
              extra={'个人中心'}
              arrow="horizontal"
              onClick={() => {}}
            >
              <div>
                {this.props.nickname}
              </div>
            </Item>
          </List>
          <List>
            <div className='User-center'>
              <div className='User-passWord'><div>修改密码</div></div>
              <div className='User-mailbox'><div>修改邮箱</div></div>
              <div><div>修改手机</div></div>
            </div>
          </List>

          <WhiteSpace size="lg" />
          <List>
            <Item multipleLine
              extra={'全部订单'}
              arrow="horizontal"
              onClick={() => {}}
            >
              <div>我的订单</div>
            </Item>
          </List>
          <List>
            <div className='User-order'>
              <div className='order-ing'><div>预定中</div></div>
              <div className='order-till'><div>待付款</div></div>
              <div><div>成功/退款</div></div>
            </div>
          </List>

          <WhiteSpace size="lg" />
          <div className='User-info'>
            <List>
              <Item
                arrow="horizontal"
                onClick={() => {}} multipleLine>
                <div>常用旅客信息</div>
              </Item>
            </List>
          </div>

          <WhiteSpace size="lg" />
          <div className='User-SignOut' onClick={this.signOut.bind(this)}>
            <div>账号退出</div>
          </div>

          <MyTabBar
            selectedTab='User'
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  nickname: state.user.nickname,
  isLogin: state.user.isLogin
})

export default connect(mapStateToProps)(MyUser);
