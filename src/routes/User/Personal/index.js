import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import SwitchBolck from './../../../components/UserSame/SwitchBolck';
import config from './../../../config';
import cookies from './../../../utils/cookies';
import convertDate from './../../../utils/convertDate';

import { Toast, WhiteSpace, List, InputItem, Picker, DatePicker, Modal } from 'antd-mobile';

const Item = List.Item;

class Personal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nickname: null,
      sex: ['boy'],
      birthday: new Date(), //生日
      telephone: null,
      webchat: null,
      qq: null,

      userName: null,
      mobile: null,
      email: null,
    };

    this.getUserInfo.bind(this);
  }

  componentDidMount() {
    this.getUserInfo()
    .then((val) => {
      this.setState({
        'nickname': val.nickname,
        'sex': val.gender === 1 ? ['boy'] : ['girl'],
        'birthday':  val.birthday ? new Date(val.birthday) : null, //生日
        'telephone': val.telephone,
        'webchat': val.webchat,
        'qq': val.qq,
  
        'userName': val.userName,
        'mobile': val.mobile,
        'email': val.email,
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

  submitData() {
    const _this = this;

    const fetchBody = JSON.stringify({
      'userName': this.state.userName,
      'nickname': this.state.nickname,
      'gender': this.state.sex[0] === 'boy' ? 1 : 2,
      'birthday': convertDate.dateToFormat(this.state.birthday),
      'telephone': this.state.telephone,
      'webchat': this.state.webchat,
      'qq': this.state.qq
    })

    Toast.loading('正在提交..');
    fetch(`${config.URLversion}/user/update.do`, {
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'headers':{
        'token': cookies.getItem('token'),
        'digest': cookies.getItem('digest')
      },
      body: fetchBody
    }).then(
      (response) => ( response.json() ),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      Toast.hide();
      if (json.result === '0') {
        Modal.alert('修改基本信息成功', '恭喜你已成功修改您的基本信息!!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/index'));
          },
          style: 'default'
        }]);
      } else {
        Modal.alert('修改基本信息失败', `请求服务器成功, 但是请求数据有误! 原因: ${json.message}`);
      }
    }).catch((error) => {
      Toast.hide();
      Modal.alert('请求出错', `向服务器发起请求修改基本信息失败, 原因: ${error}`);
    })
  }

  render() {
    return (
      <div className="Personal">
        <MyNavBar
          navName='基本信息'
          returnURL='/user/index'
        />

        <SwitchBolck
          isFirstActive={true}
          firstName='基本信息'
          otherName='账号信息'
          jumpToUrl='/user/personal/account'
        />

        <List renderHeader={() => '基本信息'}>
          <InputItem
            placeholder='请输入你的昵称'
            value={this.state.nickname}
            onChange={(value) => this.setState({'nickname': value})}
          >昵称</InputItem>
          <InputItem
            placeholder='请输入你的用户名'
            value={this.state.userName}
            onChange={(value) => this.setState({'userName': value})}
          >用户名</InputItem>
          <Picker
            data={[{label: '男', value: 'boy'}, {label: '女', value: 'girl'}]}
            cols={1}
            value={this.state.sex}
            title="请选择您的性别"
            onChange={(val) => this.setState({'sex': val})}
          ><List.Item arrow="horizontal">性别</List.Item></Picker>
          <DatePicker
            mode="date"
            title="选择出生日期"
            extra="请选择"
            value={this.state.birthday}
            minDate={new Date(-1351929600000)}
            maxDate={new Date()}
            onChange={(val) => this.setState({'birthday': val})}
          ><List.Item arrow="horizontal">出生日期</List.Item></DatePicker>
          <InputItem
            placeholder='请输入你的电话号码'
            value={this.state.telephone}
            onChange={(value) => this.setState({'telephone': value})}
          >电话号码</InputItem>
          <InputItem
            placeholder='请输入你的微信'
            value={this.state.webchat}
            onChange={(value) => this.setState({'webchat': value})}
          >微信</InputItem>
          <InputItem
            placeholder='请输入你的QQ号码'
            value={this.state.qq}
            onChange={(value) => this.setState({'qq': value})}
          >QQ号码</InputItem>
        </List>

        <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.submitData.bind(this)}>保存信息</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Personal);
