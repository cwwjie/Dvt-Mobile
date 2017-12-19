import React, {Component} from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';

import eye from './../../../assets/eye.svg';
import eye_hover from './../../../assets/eye_hover.svg';

import MyNavBar from './../../../components/MyNavBar/index';

import request from './../../../utils/request';
import config from './../../../config';

import { Button, Flex, WingBlank, WhiteSpace, Toast, Checkbox, Modal } from 'antd-mobile';

class UserForget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFindByMail: true,

      mailBox: '',
      canMailSubmit: false,

      phone: '',
      code: '',
      VerifiCodeName: '获取验证码',
      newPassword: '',
      passwordType: 'password',
      canPhoneSubmit: false,
    };

    this.phone = '';
    this.code = '';
    this.codeCount = 60;
    this.newPassword = '';

    this.switchForgetBy.bind(this);
    this.checkPhoneBase.bind(this);
    this.checkPhoneValue.bind(this);
  }

  switchForgetBy(type) {
    if (type === 'mailBox') {
      this.setState({
        'isFindByMail': true
      })
    } else {
      this.setState({
        'isFindByMail': false
      })
    }
  }

  mailBoxFilter(event) {
    if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(event.target.value)) {
      this.setState({
        'mailBox': event.target.value,
        'canMailSubmit': true
      });
    } else {
      this.setState({
        'mailBox': event.target.value,
        'canMailSubmit': false
      });
    }
  }

  // 不验证 验证码之外的输入
  checkPhoneBase() {
    if (this.phone === '') {
      return request.error('手机号码不能为空!');
    }
    if (/^1[34578]\d{9}$/.test(this.phone) === false ) {
      return request.error('手机号码格式不正确!');
    }

    return request.success();
  }

  // 包含 验证码的所有验证
  checkPhoneValue() {
    let checkBase = this.checkPhoneBase();
    if (checkBase.result !== 1) {
      return checkBase;
    }

    if (this.code === '') {
      return request.error('验证码不能为空!');
    }
    if (this.newPassword === '') {
      return request.error('新密码不能为空!');
    }
    if (this.code.length !== 6) {
      return request.error('验证码不正确!');
    }
    if (this.newPassword.length  < 8) {
      return request.error('新密码要大于8位!');
    }

    return request.success();
  }

  setPhoneInputState() {
    let checkValue = this.checkPhoneValue();

    if (checkValue.result === 1) {
      this.setState({'canPhoneSubmit': true});
    } else {
      this.setState({'canPhoneSubmit': false});
    }
  }

  phoneFilter(event) {
    this.phone = event.target.value;
    this.setState({'phone': event.target.value}, this.setPhoneInputState.call(this));
  }
  
  codeFilter(event) {
    this.code = event.target.value;
    this.setState({'code': event.target.value}, this.setPhoneInputState.call(this));
  }
  
  newPasswordFilter(event) {
    this.newPassword = event.target.value;
    this.setState({'newPassword': event.target.value}, this.setPhoneInputState.call(this));
  }

  findBackByMail() {
    const _this = this;
    
    Toast.loading('正在提交...');
    fetch(`${config.URLversion}/user/forgetPw.do?email=${this.state.mailBox}`, {
      method: 'GET',
      contentType: 'application/json; charset=utf-8'
    }).then(
      (response) => (response.json()),
      (error) => ({'result':'1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        Modal.alert('修改密码成功', '已将重置链接发至您的邮箱!!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/login'));
          },
          style: 'default'
        }]);
      } else {
        Modal.prompt('发生错误', `服务器发生错误, 原因: ${json.message}`);
      }
      Toast.hide();
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
      Toast.hide();
    })
  }

  getVerifiCode() {
    const _this = this;
    let checkBase = this.checkPhoneBase();
    if (checkBase.result !== 1) {
      return Toast.info(checkBase.message, 1.5);
    }

    this.setState({VerifiCodeName: '正在获取'});

    fetch(`${config.URLversion}/user/getMobileCode.do`,{
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'body': JSON.stringify({
        'mobile': this.state.phone,
        'authAction': 'forgetPw'
      })
    }).then(
      (response) => (response.json()),
      (error) => ({'result':'1', 'message': error})
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

  findBackByPhone() {
    const _this = this;

    Toast.loading('正在提交...');
    fetch(`${config.URLversion}/user/forgetPwtToMob.do`,{
      'method': 'POST',
      'contentType': 'application/json; charset=utf-8',
      'body': JSON.stringify({
        'authAction':'forgetPw',
        'mobile': this.state.phone,
        'messageContent': this.state.code,
        'passwd': this.state.newPassword
      })
    }).then(
      (response) => (response.json()),
      (error) => ({'result':'1', 'message': error})
    ).then((json) => {
      if (json.result === '0') {
        Modal.alert('重置密码成功', '恭喜你密码重置成功!!!', [{
          text: '确定',
          onPress: () => {
            _this.props.dispatch(routerRedux.push('/user/login'));
          },
          style: 'default'
        }]);
      }else {
        Modal.prompt('数据有误', `服务器发生错误, 原因: ${json.message}`);
      }
      Toast.hide();
    }).catch((error) => {
      Modal.alert('请求出错', `向服务器发起请求失败, 原因: ${error}`);
      Toast.hide();
    });

  }

  renderEyeSvg() {
    const Svgstyle = (Svg) => ({
      'background': `url(${Svg}) center center /  23px 23px no-repeat`
    });

    return this.state.passwordType === 'password' ? <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'text'})
      }}
      style={Svgstyle(eye)}
    /> : <div
      className='Login-eye'
      onClick={() => {
        this.setState({'passwordType': 'password'})
      }}
      style={Svgstyle(eye_hover)}
    />;
  }

  render() {
    const mailBoxStyle = this.state.isFindByMail ? { display: 'block' } : { display: 'none' };
    const phoneStyle = this.state.isFindByMail ? { display: 'none' } : { display: 'block' };

    const mailBoxsubmitNode = this.state.canMailSubmit ? 
      <div className="submit-btn btn-permit" onClick={this.findBackByMail.bind(this)}>找回密码</div> : 
      <div className="submit-btn btn-primary" onClick={() => {Toast.info('请输入正确的邮箱!', 1.5)}}>找回密码</div>;

    const phonesubmitNode = this.state.canPhoneSubmit ? 
      <div className="submit-btn btn-permit" onClick={this.findBackByPhone.bind(this)}>重置密码</div> : 
      <div className="submit-btn btn-primary" onClick={() => {
        let checkValue = this.checkPhoneValue();
        Toast.info(checkValue.message, 1.5);
      }}>重置密码</div>;

    const VerifiCodeNode = this.state.VerifiCodeName === '获取验证码' ? 
      <div 
        className="input-verifi"
        onClick={this.getVerifiCode.bind(this)}
      >获取验证码</div> :
      <div className="input-verifi">{this.state.VerifiCodeName}</div>;

    return (
      <div className="User-Login User-Forget">
        <MyNavBar
          navName='忘记密码'
          returnURL='/user/login'
        />

        <WhiteSpace size="lg" />

        <div style={mailBoxStyle}>
          <div className="User-input">
            <input 
              placeholder="请输入你的邮箱" 
              value={this.state.mailBox} 
              onChange={this.mailBoxFilter.bind(this)}
            />
          </div>
          <div className="User-submit">
            {mailBoxsubmitNode}
          </div>
        </div>

        <div style={phoneStyle}>
          <div className="User-input">
            <input 
              placeholder="请输入你的手机号码" 
              value={this.state.phone} 
              onChange={this.phoneFilter.bind(this)}
            />
          </div>
          
          <div className="User-input">
            <input 
              placeholder="验证码" 
              value={this.state.code} 
              onChange={this.codeFilter.bind(this)}
            />
            {VerifiCodeNode}
          </div>

          <div className="User-input">
            <input 
              placeholder="你的新密码" 
              type={this.state.passwordType}
              value={this.state.newPassword} 
              onChange={this.newPasswordFilter.bind(this)}
            />
            {this.renderEyeSvg()}
          </div>

          <div className="User-submit">
            {phonesubmitNode}
          </div>
        </div>

        <div className="Forget-select">
          <div
            className={this.state.isFindByMail ? "btn-primary" : "btn-actived"}
            onClick={() => {this.switchForgetBy('mailBox')}}
          ><div>邮箱找回</div></div>
          <div 
            className={this.state.isFindByMail ? "btn-actived" : "btn-primary"}
            onClick={() => {this.switchForgetBy('phone')}}
          ><div>手机找回</div></div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
})

export default connect()(UserForget);
