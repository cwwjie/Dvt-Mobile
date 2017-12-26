import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SwitchBolck from './../../../components/UserSame/SwitchBolck';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import convertDate from './../../../utils/convertDate';

import { Toast, WhiteSpace, List, Modal, WingBlank } from 'antd-mobile';

const Item = List.Item;

class AccountInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'mobile': '正在加载...',
      'email': '正在加载...',
    };
  }
  
  componentDidMount() {
    this.getUserInfo()
    .then((val) => {
      this.setState({
        'mobile': val.mobile ? val.mobile : '暂未绑定',
        'email': val.email ? val.email : '暂未绑定',
      })
    })
  }
  
  getUserInfo() {
    const _this = this;
    return new Promise((resolve, reject) => {
      fetch(`${config.URLversion}/user/getUserInfo.do`, {
        'method': 'GET',
        'contentType': 'application/json; charset=utf-8',
        'headers':{
          'token': cookies.getItem('token'),
          'digest': cookies.getItem('digest')
        }
      }).then(
        (response) => ( response.json() ),
        (error) => ({'result': '1', 'message': error})
      ).then((json) => {
        if (json.result === '0') {
          resolve(json.data);
        } else {
          reject('获取旅客信息失败', `请求服务器成功, 但是返回的旅客信息有误! 原因: ${json.message}`);
          Modal.alert('获取旅客信息失败', `请求服务器成功, 但是返回的旅客信息有误! 原因: ${json.message}`);
        }
      }).catch((error) => {
          reject('请求出错', `向服务器发起请求旅客信息失败, 原因: ${error}`);
          Modal.alert('请求出错', `向服务器发起请求旅客信息失败, 原因: ${error}`);
      })
    })
  }

  render() {
    return (
      <div className="Personal">
        <MyNavBar
          navName='账号信息'
          returnURL='/user/index'
        />

        <SwitchBolck
          isFirstActive={false}
          firstName='基本信息'
          otherName='账号信息'
          jumpToUrl='/user/personal/index'
        />

        <List renderHeader={() => '账号信息'}>
          <Item
            extra={'修改'}
            arrow="horizontal"
            onClick={() => this.props.dispatch(routerRedux.push('/user/account/password'))}
          >密码</Item>
          <Item>
            <WingBlank size="md">*********</WingBlank>
          </Item>
          <Item
            extra={'修改/绑定'}
            arrow="horizontal"
            onClick={() => this.props.dispatch(routerRedux.push('/user/account/mailbox'))}
          >邮箱</Item>
          <Item>
            <WingBlank size="md">{this.state.email}</WingBlank>
          </Item>
          <Item
            extra={'修改/绑定'}
            arrow="horizontal"
            onClick={() => this.props.dispatch(routerRedux.push('/user/account/mobile'))}
          >手机</Item>
          <Item>
            <WingBlank size="md">{this.state.mobile}</WingBlank>
          </Item>
        </List>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(AccountInfor);
