import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import MyNavBar from './../../../components/MyNavBar/index';
import config from './../../../config';
import cookies from './../../../utils/cookies';

import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';

import { Toast, WhiteSpace, List, Modal } from 'antd-mobile';


class Mobile extends Component {
  constructor(props) {
    super(props);
    
    this.returnURL = localStorage.getItem('returnURL');
    localStorage.removeItem('returnURL');

    this.state = {
      'password': '',
      'passwordType': 'password',
      'mobile': '',
      'code': '',
      'VerifiCodeName': '获取验证码',
    };
  }
  
  Svgstyle(Svg) {
    return {
      'background': `url(${Svg}) center center /  23px 23px no-repeat`
    }
  }
  
  renderEyeSvg() {
    return this.state.passwordType === 'password' ? <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'text'})
      }}
      style={this.Svgstyle(eye)}
    /> : <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'password'})
      }}
      style={this.Svgstyle(eye_hover)}
    />;
  }


  getVerifiCode() {
    const _this = this;

    if (this.state.mobile === '') {
      Toast.info('手机号码不能为空', 1.5);
      return
    }
    if (/^1[34578]\d{9}$/.test(this.state.mobile) === false) {
      Toast.info('手机号码格式不正确', 1.5);
      return
    }

    this.setState({VerifiCodeName: '正在获取'});

    fetch(`${config.URLversion}/user/getMobileCode.do`,{
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'body': JSON.stringify({
        'mobile': this.state.mobile,
        'authAction': 'updateMob'
      })
    }).then(
      (response) => (response.json()),
      (error) => ({'result': '1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        for(let i = 0; i < 60; i++ ){
          (function(x){
            setTimeout(() => {
              _this.codeCount--;
              _this.setState({'VerifiCodeName': `${_this.codeCount} 秒重新获取`});

              if (x === 59) {
                _this.codeCount = 60;
                _this.setState({'VerifiCodeName': '获取验证码'});
              }

            }, x * 1000);
          })(i)
        }
      }else {
        _this.setState({'VerifiCodeName': '获取验证码'});
        Modal.alert('数据有误', `获取验证码失败，原因: ${json.message}`);
      }
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
    });
  }

  submitData() {
    const _this = this;

    if (this.state.password === '') {
      Modal.alert('数据有误', '密码不能为空！');
      return
    }

    if (this.state.password.length < 8) {
      Modal.alert('数据有误', '密码应该大于等于8位！');
      return
    }

    if (this.state.code === '') {
      Modal.alert('数据有误', '验证码不能为空！');
      return
    }

    if (this.state.code.length !== 6) {
      Modal.alert('数据有误', '验证码不正确！');
      return
    }

    if (/^1[34578]\d{9}$/.test(this.state.mobile) === false) {
      Modal.alert('数据有误', '手机号码格式不正确');
      return
    }

    const fetchBody = JSON.stringify({
      'authAction': "updateMob",
      'passwd': this.state.password,
      'mobile': this.state.mobile,
      'messageContent': this.state.code
    })

    Toast.loading('正在提交..');
    fetch(`${config.URLversion}/user/updateMobile.do`, {
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
        Modal.alert('绑定手机成功', '恭喜你已成功绑定您的手机!!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/index'));
          },
          style: 'default'
        }]);
      } else if (json.result === '-6') {
        Modal.alert('绑定手机失败', '你输入的密码有误!');
      } else if (json.result === '-3') {
        Modal.alert('绑定手机失败', '此手机已被绑定!');
      } else if (json.result === '-1') {
        Modal.alert('绑定手机失败', '验证码有误!');
      } else {
        Modal.alert('绑定手机失败', `请求服务器成功, 但是请求数据有误! 原因: ${json.message}`);
      }
    }).catch((error) => {
      Toast.hide();
      Modal.alert('请求出错', `向服务器发起请求绑定邮箱失败, 原因: ${error}`);
    })
  }

  render() {

    const VerifiCodeNode = this.state.VerifiCodeName === '获取验证码' ? 
      <div 
        className="input-verifi"
        onClick={this.getVerifiCode.bind(this)}
      >获取验证码</div> :
      <div className="input-verifi">{this.state.VerifiCodeName}</div>;


    return (
      <div className="Account">
        <MyNavBar
          navName='绑定邮箱'
          returnURL={this.returnURL || '/user/personal/account'}
        />

        <WhiteSpace size="lg" />

        <div className="Account-input">
          <input 
            placeholder="请输入您的密码" 
            type={this.state.passwordType}
            value={this.state.password} 
            onChange={(event) => this.setState({'password': event.target.value})}
          />
          {this.renderEyeSvg()}
        </div>

        <div className="Account-input">
          <input 
            placeholder="手机号码" 
            value={this.state.mobile} 
            onChange={(event) => this.setState({'mobile': event.target.value})}
          />
        </div>
          
        <div className="Account-input">
          <input 
            placeholder="验证码" 
            value={this.state.code} 
            onChange={(event) => this.setState({'code': event.target.value})}
          />
          {VerifiCodeNode}
        </div>

        <div className='submit-bottom'>
          <div className='submit-btn' onClick={this.submitData.bind(this)}>绑定新手机</div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(Mobile);
